from flask import Blueprint, request, jsonify, make_response
from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from decorators import admin_required
import csv
import io
from models import db, Simulation, SimulationParameters, SimulationStatus, SimulationSteps, User, UserType
from datetime import datetime
import constants as c
from simulation_engine import run_simulation

simulations_bp = Blueprint('simulations', __name__)


@simulations_bp.route('/', methods=['GET'])
def get_all_simulations():
    """
    Listar todas as simulações (Admin Only).
    ---
    tags:
      - Simulations
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de todas as simulações
        schema:
          type: array
          items:
            type: object
    """
    @admin_required()
    def get_all_simulations_wrapper():
        sims = Simulation.query.order_by(Simulation.created_at.desc()).all()
        results = []
        for s in sims:
            status = SimulationStatus.query.get(s.simulation_status_id)
            user = User.query.get(s.user_id)
            results.append({
                'id': s.id,
                'user_email': user.email if user else 'Unknown',
                'date': s.created_at.isoformat(),
                'description': s.description,
                'status': status.label
            })
        return jsonify(results), 200
    return get_all_simulations_wrapper()


@simulations_bp.route('/', methods=['POST'])
def create_simulation():
    """
    Criar nova simulação.
    ---
    tags:
      - Simulations
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - user_id
            - parameters
          properties:
            user_id:
              type: integer
            description:
              type: string
            parameters:
              type: object
              required:
                - population_total
                - infected_initial
                - beta
                - gamma
                - duration
              properties:
                population_total:
                  type: integer
                infected_initial:
                  type: integer
                beta:
                  type: number
                gamma:
                  type: number
                duration:
                  type: integer
    responses:
      201:
        description: Simulação criada e executada
        schema:
          type: object
          properties:
            id:
              type: integer
            status:
              type: string
            parameters:
              type: object
            steps:
              type: array
              items:
                type: object
                properties:
                  step:
                    type: integer
                  S:
                    type: integer
                  I:
                    type: integer
                  R:
                    type: integer
                  Rt:
                    type: number
      400:
        description: Parâmetros inválidos
    """
    @jwt_required()
    def create_simulation_wrapper():
        return create_simulation_impl()

    return create_simulation_wrapper()


def create_simulation_impl():
    data = request.get_json()

    # Verificar autorização
    current_user_id = get_jwt_identity()
    # Se o user_id vier no body, tem de bater certo com o token
    if data.get('user_id') and str(current_user_id) != str(data.get('user_id')):
        return jsonify({'error': 'Acesso não autorizado'}), 403

    # Validação básica
    if not data.get('user_id') or not data.get('parameters'):
        return jsonify({'error': 'Dados incompletos'}), 400

    params_data = data.get('parameters')

    # Validação de Negócio (QA Feedback)
    if params_data.get('population_total', 0) <= 0:
        return jsonify({'error': 'População total deve ser maior que 0'}), 400
    if params_data.get('infected_initial', 0) < 0:
        return jsonify({'error': 'Infetados iniciais não pode ser negativo'}), 400
    if params_data.get('beta', 0) < 0 or params_data.get('gamma', 0) < 0:
        return jsonify({'error': 'Taxas (beta/gamma) não podem ser negativas'}), 400

    try:
        # 1. Criar a Simulação
        # Por defeito, status é 'running' (ou 'pending')
        initial_status = SimulationStatus.query.filter_by(
            label=c.SIM_STATUS_RUNNING).first()

        new_sim = Simulation(
            user_id=data.get('user_id'),
            description=data.get('description', ''),
            simulation_status_id=initial_status.id,
            created_at=datetime.utcnow()
        )
        db.session.add(new_sim)
        db.session.flush()  # Para obter o ID da simulação antes do commit final

        # 2. Criar os Parâmetros associados
        new_params = SimulationParameters(
            simulation_id=new_sim.id,
            population_total=params_data.get('population_total'),
            infected_initial=params_data.get('infected_initial'),
            beta=params_data.get('beta'),
            gamma=params_data.get('gamma'),
            duration=params_data.get('duration')
        )
        db.session.add(new_params)

        # 3. Executar a Simulação (Sprint C)
        # Calcular os passos usando o motor estocástico
        simulation_results = run_simulation(
            N=new_params.population_total,
            I0=new_params.infected_initial,
            beta=new_params.beta,
            gamma=new_params.gamma,
            duration=new_params.duration
        )

        # 4. Guardar os Resultados (Steps)
        for step_data in simulation_results:
            new_step = SimulationSteps(
                simulation_id=new_sim.id,
                step_number=step_data['step'],
                susceptible=step_data['S'],
                infected=step_data['I'],
                recovered=step_data['R'],
                rt_value=step_data['Rt']
            )
            db.session.add(new_step)

        # 5. Confirmar tudo (Simulação + Parâmetros + Steps)
        db.session.commit()

        # Construir resposta completa (igual ao GET details)
        response = {
            'id': new_sim.id,
            'user_id': new_sim.user_id,
            'created_at': new_sim.created_at.isoformat(),
            'description': new_sim.description,
            'status': initial_status.label,
            'parameters': {
                'population_total': new_params.population_total,
                'infected_initial': new_params.infected_initial,
                'beta': new_params.beta,
                'gamma': new_params.gamma,
                'duration': new_params.duration
            },
            # Já está no formato correto (lista de dicts)
            'steps': simulation_results
        }

        return jsonify(response), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@simulations_bp.route('/<int:sim_id>', methods=['GET'])
@jwt_required()
def get_simulation_details(sim_id):
    """
    Obter detalhes da simulação.
    ---
    tags:
      - Simulations
    security:
      - Bearer: []
    parameters:
      - in: path
        name: sim_id
        type: integer
        required: true
    responses:
      200:
        description: Detalhes completos e passos
        schema:
          type: object
          properties:
            id:
              type: integer
            status:
              type: string
            parameters:
              type: object
            steps:
              type: array
              items:
                type: object
                properties:
                  step:
                    type: integer
                  S:
                    type: integer
                  I:
                    type: integer
                  R:
                    type: integer
                  Rt:
                    type: number
    """
    sim = Simulation.query.get_or_404(sim_id)

    # Verificar autorização (Próprio ou Admin)
    current_user_id = get_jwt_identity()
    is_admin = False

    curr_user = User.query.get(current_user_id)
    if curr_user:
        user_type = UserType.query.get(curr_user.user_type_id)
        if user_type and user_type.label == 'admin':
            is_admin = True

    if str(sim.user_id) != str(current_user_id) and not is_admin:
        return jsonify({'error': 'Acesso não autorizado'}), 403
    params = SimulationParameters.query.get(sim.id)
    status = SimulationStatus.query.get(sim.simulation_status_id)

    # Construir resposta
    response = {
        'id': sim.id,
        'user_id': sim.user_id,
        'created_at': sim.created_at.isoformat(),
        'description': sim.description,
        'status': status.label,
        'parameters': {
            'population_total': params.population_total,
            'infected_initial': params.infected_initial,
            'beta': params.beta,
            'gamma': params.gamma,
            'duration': params.duration
        },
        'steps': [
            {
                'step': step.step_number,
                'S': step.susceptible,
                'I': step.infected,
                'R': step.recovered,
                'Rt': step.rt_value
            } for step in sim.steps
        ]
    }

    return jsonify(response), 200


@simulations_bp.route('/<int:sim_id>/export', methods=['GET'])
@jwt_required()
def export_simulation_csv(sim_id):
    """
    Exportar simulação para CSV.
    ---
    tags:
      - Simulations
    security:
      - Bearer: []
    produces:
      - text/csv
    parameters:
      - in: path
        name: sim_id
        type: integer
        required: true
    responses:
      200:
        description: Ficheiro CSV para download
        schema:
          type: file
    """
    sim = Simulation.query.get_or_404(sim_id)

    # Verificar autorização
    current_user_id = get_jwt_identity()
    if str(sim.user_id) != str(current_user_id):
        return jsonify({'error': 'Acesso não autorizado'}), 403

    # Criar CSV em memória
    si = io.StringIO()
    cw = csv.writer(si)

    # Cabeçalho
    cw.writerow(['Day', 'Susceptible', 'Infected', 'Recovered', 'Rt'])

    # Dados
    # Ordenar por step_number para garantir ordem cronológica
    steps = sorted(sim.steps, key=lambda x: x.step_number)
    for step in steps:
        cw.writerow([step.step_number, step.susceptible,
                    step.infected, step.recovered, step.rt_value])

    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = f"attachment; filename=simulation_{sim_id}.csv"
    output.headers["Content-type"] = "text/csv"
    return output


@simulations_bp.route('/<int:sim_id>', methods=['DELETE'])
def delete_simulation(sim_id):
    """
    Apagar simulação (Admin Only).
    ---
    tags:
      - Simulations
    security:
      - Bearer: []
    parameters:
      - in: path
        name: sim_id
        type: integer
        required: true
    responses:
      200:
        description: Simulação apagada
    """
    @jwt_required()
    def delete_simulation_wrapper(sim_id):
        sim = Simulation.query.get_or_404(sim_id)

        # Verificar autorização (Próprio ou Admin)
        current_user_id = get_jwt_identity()
        is_admin = False

        curr_user = User.query.get(current_user_id)
        if curr_user:
            user_type = UserType.query.get(curr_user.user_type_id)
            if user_type and user_type.label == 'admin':
                is_admin = True

        if str(sim.user_id) != str(current_user_id) and not is_admin:
            return jsonify({'error': 'Acesso não autorizado'}), 403

        db.session.delete(sim)
        db.session.commit()
        return jsonify({'message': 'Simulação apagada com sucesso'}), 200
    return delete_simulation_wrapper(sim_id)
