from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from decorators import admin_required
from models import db, User, Simulation, SimulationStatus
import constants as c

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    """
    Estatísticas do Dashboard (Admin Only).
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
              example: 50
            total_simulations:
              type: integer
              example: 120
            completed_simulations:
              type: integer
              example: 100
      403:
        description: Acesso restrito a Administradores
    """
    @admin_required()
    def get_dashboard_stats_wrapper():
        return get_dashboard_stats_impl()
    return get_dashboard_stats_wrapper()

def get_dashboard_stats_impl():
    try:
        # 1. Total de Utilizadores
        # Contamos todos os registos na tabela User.
        total_users = User.query.count()

        # 2. Total de Simulações
        # Contamos todas as simulações criadas até hoje.
        total_simulations = Simulation.query.count()

        # 3. Simulações por Estado
        # Queremos saber quantas simulações foram concluídas com sucesso.
        # Primeiro, obtemos o ID do estado 'complete'.
        completed_status = SimulationStatus.query.filter_by(label=c.SIM_STATUS_COMPLETE).first()
        completed_sims = 0
        if completed_status:
            # Depois filtramos as simulações que têm esse status_id.
            completed_sims = Simulation.query.filter_by(simulation_status_id=completed_status.id).count()

        return jsonify({
            'total_users': total_users,
            'total_simulations': total_simulations,
            'completed_simulations': completed_sims
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
