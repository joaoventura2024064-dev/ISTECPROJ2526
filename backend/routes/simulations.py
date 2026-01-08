from flask import Blueprint, request, jsonify
from models import db, Simulation, SimulationParameters, SimulationStatus, User
from datetime import datetime

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

    try:
        # 1. Criar a Simulação
        # Por defeito, status é 'running' (ou 'pending')
        initial_status = SimulationStatus.query.filter_by(label='running').first()
        
        new_sim = Simulation(
            user_id=data.get('user_id'),
            description=data.get('description', ''),
            simulation_status_id=initial_status.id,
            created_at=datetime.utcnow()
        )
        db.session.add(new_sim)
        db.session.flush() # Para obter o ID da simulação antes do commit final

        # 2. Criar os Parâmetros associados
        params_data = data.get('parameters')
        new_params = SimulationParameters(
            simulation_id=new_sim.id,
            population_total=params_data.get('population_total'),
            infected_initial=params_data.get('infected_initial'),
            beta=params_data.get('beta'),
            gamma=params_data.get('gamma'),
            duration=params_data.get('duration')
        )
        db.session.add(new_params)

        # 3. Confirmar tudo
        db.session.commit()

        # TODO: Aqui poderíamos disparar o processo de cálculo da simulação (Sprint C)
        
        return jsonify({'message': 'Simulação criada', 'id': new_sim.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@simulations_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_simulations(user_id):
    """
    Lista todas as simulações de um utilizador.
    """
    sims = Simulation.query.filter_by(user_id=user_id).order_by(Simulation.created_at.desc()).all()
    
    results = []
    for s in sims:
        status = SimulationStatus.query.get(s.simulation_status_id)
        results.append({
            'id': s.id,
            'date': s.created_at.isoformat(),
            'description': s.description,
            'status': status.label,
            'pinned': s.pinned
        })
    
    return jsonify(results), 200

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
        'steps': [] # Sprint C: Aqui iríamos buscar os SimulationSteps
    }
    
    return jsonify(response), 200
