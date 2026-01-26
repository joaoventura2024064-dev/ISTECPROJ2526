from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User, UserType
import constants as c

def admin_required():
    """
    Decorador personalizado para proteger rotas que requerem privilégios de Administrador.
    

    1. Intercepta o pedido antes de chegar à função da rota.
    2. Verifica se o token JWT é válido.
    3. Verifica na base de dados se o utilizador associado ao token tem o tipo 'admin'.
    4. Se sim, deixa passar; se não, retorna erro 403 (Proibido).
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # 1. Garantir que o JWT está presente e é válido no pedido.
            # Se não estiver, esta função lança logo um erro (abort).
            verify_jwt_in_request()
            
            # 2. Obter o ID do utilizador que vem dentro do token (payload).
            user_id = get_jwt_identity()
            
            # 3. Verificar na Base de Dados quem é este utilizador.
            user = User.query.get(user_id)
            if not user:
                # Caso raro: o token é válido mas o utilizador foi apagado da BD entretanto.
                return jsonify({'error': 'Utilizador não encontrado'}), 404
                
            # 4. Verificar o tipo de utilizador.
            # Vamos buscar o registo na tabela UserType usando o ID guardado no user.
            user_type = UserType.query.get(user.user_type_id)
            
            # Se não for admin, bloqueamos o acesso aqui.
            if not user_type or user_type.label != c.USER_TYPE_ADMIN:
                return jsonify({'error': 'Acesso restrito a Administradores'}), 403
                
            # 5. Se tudo estiver ok, executamos a função original da rota.
            return fn(*args, **kwargs)
        return decorator
    return wrapper
