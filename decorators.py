from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User, UserType
import constants as c

def admin_required():
    """
    Decorador para proteger rotas que requerem privilégios de Administrador.
    Verifica se o utilizador autenticado tem o tipo 'admin'.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Garantir que o JWT é válido
            verify_jwt_in_request()
            
            # Obter ID do utilizador do token
            user_id = get_jwt_identity()
            
            # Verificar na BD se é admin
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'Utilizador não encontrado'}), 404
                
            # Verificar se o tipo de utilizador é 'admin'
            # Assumindo que temos acesso à relação user_type ou ao ID
            # Vamos buscar o label do tipo para ser mais seguro/legível
            user_type = UserType.query.get(user.user_type_id)
            
            if not user_type or user_type.label != c.USER_TYPE_ADMIN:
                return jsonify({'error': 'Acesso restrito a Administradores'}), 403
                
            return fn(*args, **kwargs)
        return decorator
    return wrapper
