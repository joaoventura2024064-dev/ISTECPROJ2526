from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, User, UserType, UserStatus, Genders
from datetime import datetime
import constants as c

# Criar um "Blueprint" para agrupar as rotas de autenticação
# Isto ajuda a organizar o código, separando-o do app.py principal
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Rota para registar novos utilizadores.
    Recebe JSON com: name, email, password, birth_date, gender_id
    """
    data = request.get_json()

    # 1. Validar dados obrigatórios
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email e password são obrigatórios'}), 400

    # 2. Verificar se o email já existe
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'Este email já está registado'}), 409

    try:
        # 3. Obter valores predefinidos para novos utilizadores
        # Por defeito, um novo utilizador é 'registered' e 'active' (ou 'pending' se preferires validação)
        user_type = UserType.query.filter_by(label=c.USER_TYPE_REGISTERED).first()
        user_status = UserStatus.query.filter_by(label=c.USER_STATUS_ACTIVE).first()

        # 4. Criar o novo utilizador
        # Converter data de nascimento se vier como string
        birth_date_val = data.get('birth_date')
        if birth_date_val and isinstance(birth_date_val, str):
            try:
                birth_date_val = datetime.strptime(birth_date_val, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Data de nascimento inválida. Use YYYY-MM-DD'}), 400

        new_user = User(
            name=data.get('name'),
            email=data.get('email'),
            password_hash=generate_password_hash(data.get('password')), # Nunca guardar plain text!
            birth_date=birth_date_val, # Formato esperado: YYYY-MM-DD
            gender_id=data.get('gender_id'),
            user_type_id=user_type.id,
            user_status_id=user_status.id
        )

        # 5. Guardar na Base de Dados
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Utilizador registado com sucesso', 'user_id': new_user.id}), 201

    except Exception as e:
        db.session.rollback() # Desfazer alterações em caso de erro
        return jsonify({'error': f'Erro ao registar: {str(e)}'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Rota para autenticação.
    Recebe: email, password
    Retorna: Sucesso + token JWT + dados do user
    """
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Dados em falta'}), 400

    # 1. Procurar o utilizador pelo email
    user = User.query.filter_by(email=data.get('email')).first()

    # 2. Verificar se existe e se a password corresponde ao hash guardado
    if not user or not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({'error': 'Credenciais inválidas'}), 401

    # 3. Verificar se a conta está ativa
    status = UserStatus.query.get(user.user_status_id)
    if status.label != c.USER_STATUS_ACTIVE:
        return jsonify({'error': 'Conta suspensa ou pendente'}), 403

    # 4. Login com sucesso - Gerar Token
    # identity pode ser o ID do user ou o email
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': 'Login efetuado com sucesso',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': UserType.query.get(user.user_type_id).label
        }
    }), 200
