from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import db, User, Simulation, SimulationStatus
import constants as c

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    """
    Estatísticas do Dashboard.
    ---
    tags:
      - Stats
    security:
      - Bearer: []
    responses:
      200:
        description: Estatísticas gerais
        schema:
          type: object
          properties:
            total_users:
              type: integer
            total_simulations:
              type: integer
            completed_simulations:
              type: integer
    """
    @jwt_required()
    def get_dashboard_stats_wrapper():
        return get_dashboard_stats_impl()
    return get_dashboard_stats_wrapper()

def get_dashboard_stats_impl():
    try:
        # 1. Total de Utilizadores
        total_users = User.query.count()

        # 2. Total de Simulações
        total_simulations = Simulation.query.count()

        # 3. Simulações por Estado (Exemplo de agregação simples)
        # Contar quantas simulações estão 'completed'
        completed_status = SimulationStatus.query.filter_by(label=c.SIM_STATUS_COMPLETE).first()
        completed_sims = 0
        if completed_status:
            completed_sims = Simulation.query.filter_by(simulation_status_id=completed_status.id).count()

        return jsonify({
            'total_users': total_users,
            'total_simulations': total_simulations,
            'completed_simulations': completed_sims
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
