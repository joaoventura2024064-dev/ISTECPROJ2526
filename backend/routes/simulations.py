from flask import Blueprint, request, jsonify, make_response
import csv
import io
from models import db, Simulation, SimulationParameters, SimulationStatus, SimulationSteps, User
from datetime import datetime
import constants as c
from simulation_engine import run_simulation

simulations_bp = Blueprint('simulations', __name__)

@simulations_bp.route('/', methods=['POST'])
def create_simulation():
    """
    Cria uma nova simulação e os seus parâmetros.
    Recebe JSON com: user_id, description, parameters: { population_total, ... }
    """
    data = request.get_json()
    
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
        initial_status = SimulationStatus.query.filter_by(label=c.SIM_STATUS_RUNNING).first()
        
        new_sim = Simulation(
            user_id=data.get('user_id'),
            description=data.get('description', ''),
            simulation_status_id=initial_status.id,
            created_at=datetime.utcnow()
        )
        db.session.add(new_sim)
        db.session.flush() # Para obter o ID da simulação antes do commit final

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
        
        return jsonify({'message': 'Simulação criada com sucesso', 'id': new_sim.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@simulations_bp.route('/<int:sim_id>', methods=['GET'])
def get_simulation_details(sim_id):
    """
    Obtém detalhes completos de uma simulação, incluindo parâmetros e resultados (steps).
    """
    sim = Simulation.query.get_or_404(sim_id)
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
def export_simulation_csv(sim_id):
    """
    Exporta os dados da simulação para CSV (US_C011).
    """
    sim = Simulation.query.get_or_404(sim_id)
    
    # Criar CSV em memória
    si = io.StringIO()
    cw = csv.writer(si)
    
    # Cabeçalho
    cw.writerow(['Day', 'Susceptible', 'Infected', 'Recovered', 'Rt'])
    
    # Dados
    # Ordenar por step_number para garantir ordem cronológica
    steps = sorted(sim.steps, key=lambda x: x.step_number)
    for step in steps:
        cw.writerow([step.step_number, step.susceptible, step.infected, step.recovered, step.rt_value])
        
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = f"attachment; filename=simulation_{sim_id}.csv"
    output.headers["Content-type"] = "text/csv"
    return output
