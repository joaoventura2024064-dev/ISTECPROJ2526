from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, User, UserType, UserStatus, Genders
from datetime import datetime, timedelta
import constants as c
from flask_mail import Message
from app import mail
import jwt # Usar pyjwt para gerar tokens de reset seguros

# Criar um "Blueprint" para agrupar as rotas de autenticação
# Isto ajuda a organizar o código, separando-o do app.py principal
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registar novo utilizador.
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - name
            - email
            - password
          properties:
            name:
              type: string
              example: John Doe
            email:
              type: string
              example: john@example.com
            password:
              type: string
              example: secret123
            birth_date:
              type: string
              example: "1990-01-01"
            gender_id:
              type: integer
              example: 1
    responses:
      201:
        description: Utilizador criado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
            user_id:
              type: integer
      400:
        description: Dados inválidos
      409:
        description: Email já existe
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
    Autenticação de utilizador (Login).
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: john@example.com
            password:
              type: string
              example: secret123
    responses:
      200:
        description: Login com sucesso
        schema:
          type: object
          properties:
            access_token:
              type: string
            user:
              type: object
              properties:
                id:
                  type: integer
                name:
                  type: string
                email:
                  type: string
                role:
                  type: string
      401:
        description: Credenciais inválidas
      403:
        description: Conta suspensa
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


@auth_bp.route('/recover-password', methods=['POST'])
def recover_password():
    """
    Recuperar password (enviar email).
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - email
          properties:
            email:
              type: string
    responses:
      200:
        description: Email enviado (ou simulado por segurança)
    """
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email é obrigatório'}), 400
        
    user = User.query.filter_by(email=email).first()
    
    # Por segurança, respondemos sempre 200 mesmo que o email não exista
    if not user:
        return jsonify({'message': 'Se o email existir, receberá instruções.'}), 200
        
    # Gerar token de reset (válido por 1 hora)
    from flask import current_app
    reset_token = jwt.encode(
        {'reset_password': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    
    # URL do Frontend para reset
    # TODO: Ajustar URL base conforme ambiente (dev/prod)
    reset_url = f"https://seios-frontend.onrender.com/reset-password?token={reset_token}"
    
    # Enviar Email
    try:
        msg = Message(
            subject="Recuperação de Password - SEIOS",
            recipients=[user.email],
            body=f"Olá {user.name},\n\nPara redefinir a sua password, clique no link abaixo:\n{reset_url}\n\nEste link expira em 1 hora.\n\nSe não pediu isto, ignore este email."
        )
        mail.send(msg)
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return jsonify({'error': f'Erro ao enviar email: {str(e)}'}), 500
        
    return jsonify({'message': 'Se o email existir, receberá instruções.'}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Redefinir password com token.
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - token
            - newPassword
          properties:
            token:
              type: string
            newPassword:
              type: string
    responses:
      200:
        description: Password alterada com sucesso
      400:
        description: Token inválido ou expirado
    """
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('newPassword')
    
    if not token or not new_password:
        return jsonify({'error': 'Token e nova password são obrigatórios'}), 400
        
    try:
        from flask import current_app
        # Descodificar token
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload.get('reset_password')
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Utilizador inválido'}), 400
            
        # Atualizar Password
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password alterada com sucesso'}), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'O link expirou. Peça um novo.'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Link inválido.'}), 400
