import os
from flask import current_app
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from decorators import admin_required
from werkzeug.security import generate_password_hash
from models import db, User, UserType, UserStatus, Genders, Simulation, SimulationStatus
from datetime import datetime

users_bp = Blueprint('users', __name__)


@users_bp.route('/', methods=['GET'])
def get_all_users():
    """
    Listar todos os utilizadores (Admin Only).
    ---
    tags:
      - Users
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de utilizadores
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 15
              name:
                type: string
                example: John Doe
              email:
                type: string
                example: john@example.com
              role:
                type: string
                example: registered
              status:
                type: string
                example: active
              created_at:
                type: string
                example: "2023-10-27T10:00:00"
              total_simulations:
                type: integer
                example: 5
              last_login:
                type: string
                example: "2023-10-28T12:00:00"
              cargo:
                type: string
                example: Investigador Chefe
      403:
        description: Acesso restrito a Administradores
    """
    # Usamos o decorador personalizado @admin_required para garantir que apenas admins acedem.
    @admin_required()
    def get_all_users_wrapper():
        # Vamos buscar todos os utilizadores à base de dados.
        users = User.query.all()
        results = []
        for user in users:
            # Para cada utilizador, vamos buscar as labels legíveis (ex: 'admin' em vez de 1).
            type_label = UserType.query.get(user.user_type_id).label
            status_label = UserStatus.query.get(user.user_status_id).label
            results.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': type_label,
                'status': status_label,
                'created_at': user.created_at.isoformat(),
                # Contamos o número de simulações que este utilizador criou.
                'total_simulations': len(user.simulations),
                'last_login': user.last_login.isoformat() if user.last_login else None,
                'cargo': user.cargo
            })
        return jsonify(results), 200
    return get_all_users_wrapper()


@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    """
    Obter perfil do utilizador.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: ID do utilizador
    responses:
      200:
        description: Detalhes do perfil
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 15
            name:
              type: string
              example: John Doe
            email:
              type: string
              example: john@example.com
            birth_date:
              type: string
              example: "1990-01-01"
            gender_id:
              type: integer
              example: 1
            role:
              type: string
              example: registered
            status:
              type: string
              example: active
            img_url:
              type: string
              example: /static/uploads/user_15_123456_pic.jpg
            cargo:
              type: string
              example: Investigador Chefe
            about_me:
              type: string
              example: Sou um investigador apaixonado por epidemiologia.
            created_at:
              type: string
              example: "2023-10-27T10:00:00"
      403:
        description: Acesso não autorizado (apenas o próprio ou admin)
      404:
        description: Utilizador não encontrado
    """
    # Verificar autorização (Próprio ou Admin)
    # Queremos garantir que um utilizador não pode ver os dados privados de outro,
    # a menos que seja um administrador.
    current_user_id = get_jwt_identity()
    is_admin = False

    # Verificar se quem faz o pedido é admin
    curr_user = User.query.get(current_user_id)
    if curr_user:
        user_type = UserType.query.get(curr_user.user_type_id)
        if user_type and user_type.label == 'admin':
            is_admin = True

    # Se não for o próprio utilizador E não for admin, bloqueamos.
    if str(current_user_id) != str(user_id) and not is_admin:
        return jsonify({'error': 'Acesso não autorizado'}), 403
        
    # get_or_404 retorna automaticamente erro 404 se o ID não existir.
    user = User.query.get_or_404(user_id)

    # Obter labels das tabelas de lookup para enviar ao frontend
    type_label = UserType.query.get(user.user_type_id).label
    status_label = UserStatus.query.get(user.user_status_id).label

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'birth_date': user.birth_date.isoformat() if user.birth_date else None,
        'gender_id': user.gender_id,
        'role': type_label,
        'status': status_label,
        'cargo': user.cargo,
        'about_me': user.about_me,
        'img_url': user.img_url,
        'created_at': user.created_at.isoformat()
    }), 200


@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    """
    Atualizar perfil do utilizador.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: ID do utilizador
      - in: body
        name: body
        description: Campos a atualizar
        schema:
          type: object
          properties:
            name:
              type: string
              example: John Doe Updated
            email:
              type: string
              example: newemail@example.com
            cargo:
              type: string
              example: Investigador Chefe
            about_me:
              type: string
              example: Sou um investigador apaixonado por epidemiologia.
            birth_date:
              type: string
              example: "1990-01-01"
            gender_id:
              type: integer
              example: 2
            currentPassword:
              type: string
              description: Password atual (obrigatória para mudar password)
              example: oldsecret123
            newPassword:
              type: string
              description: Nova password
              example: newsecret123
            confirmNewPassword:
              type: string
              description: Confirmação da nova password
              example: newsecret123
    responses:
      200:
        description: Perfil atualizado
        schema:
          type: object
          properties:
            message:
              type: string
              example: Perfil atualizado com sucesso
      400:
        description: Dados inválidos ou sem dados
      403:
        description: Acesso não autorizado
      409:
        description: Email já existe
    """
    # Verificar autorização (Próprio ou Admin)
    current_user_id = get_jwt_identity()
    is_admin = False

    curr_user = User.query.get(current_user_id)
    if curr_user:
        user_type = UserType.query.get(curr_user.user_type_id)
        if user_type and user_type.label == 'admin':
            is_admin = True

    if str(current_user_id) != str(user_id) and not is_admin:
        return jsonify({'error': 'Acesso não autorizado'}), 403
        
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Sem dados para atualizar'}), 400

    try:
        # 1. Atualizar campos simples
        if 'name' in data:
            user.name = data['name']

        if 'cargo' in data:
            # Limitar a 20 caracteres
            cargo_val = data['cargo']
            if cargo_val and len(cargo_val) > 20:
                return jsonify({'error': 'Cargo não pode ter mais de 20 caracteres'}), 400
            user.cargo = cargo_val

        if 'about_me' in data:
            user.about_me = data['about_me']

        if 'birth_date' in data:
            bdate = data['birth_date']
            if bdate:
                try:
                    # Tentar converter se for string (formato ISO YYYY-MM-DD)
                    if isinstance(bdate, str):
                        user.birth_date = datetime.strptime(
                            bdate, '%Y-%m-%d').date()
                    else:
                        # Assumir que já é date object ou compatível
                        user.birth_date = bdate
                except ValueError:
                    return jsonify({'error': 'Data de nascimento inválida. Use YYYY-MM-DD'}), 400
            else:
                user.birth_date = None

        if 'gender_id' in data:
            user.gender_id = data['gender_id']

        # 2. Atualizar Email
        # Se o email mudar, temos de garantir que o novo email não está a ser usado por outra pessoa.
        if 'email' in data and data['email'] != user.email:
            new_email = data['email']
            existing = User.query.filter_by(email=new_email).first()
            if existing:
                return jsonify({'error': 'Este email já está em uso'}), 409
            user.email = new_email

        # 3. Atualizar Password
        # Requer a password atual por segurança.
        if 'newPassword' in data and data['newPassword']:
            current_password = data.get('currentPassword')
            new_password = data.get('newPassword')
            confirm_password = data.get('confirmNewPassword')

            # Validar input
            if not current_password:
                return jsonify({'error': 'Password atual é necessária para definir uma nova'}), 400

            # Verificar password atual
            from werkzeug.security import check_password_hash
            if not check_password_hash(user.password_hash, current_password):
                return jsonify({'error': 'Password atual incorreta'}), 400

            # Verificar confirmação
            if new_password != confirm_password:
                return jsonify({'error': 'A nova password e a confirmação não coincidem'}), 400

            # Atualizar hash
            user.password_hash = generate_password_hash(new_password)

        # Admin pode alterar status e role de qualquer utilizador
        if is_admin:
            if 'user_status_id' in data:
                user.user_status_id = data['user_status_id']
            if 'user_type_id' in data:
                user.user_type_id = data['user_type_id']

        db.session.commit()
        return jsonify({'message': 'Perfil atualizado com sucesso'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    """Verifica se a extensão do ficheiro é permitida."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@users_bp.route('/<int:user_id>/upload-image', methods=['POST'])
def upload_image(user_id):
    """
    Upload de imagem de perfil.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    consumes:
      - multipart/form-data
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: ID do utilizador
      - in: formData
        name: file
        type: file
        required: true
        description: Imagem de perfil (jpg, png)
    responses:
      200:
        description: Upload com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
              example: Upload com sucesso
            img_url:
              type: string
              example: /static/uploads/user_15_123456_pic.jpg
      400:
        description: Ficheiro inválido ou em falta
      403:
        description: Acesso não autorizado
    """
    @jwt_required()
    def upload_image_wrapper(user_id):
        # Verificar autorização
        current_user_id = get_jwt_identity()
        if str(current_user_id) != str(user_id):
            return jsonify({'error': 'Acesso não autorizado'}), 403
        return upload_image_impl(user_id)
    return upload_image_wrapper(user_id)


def upload_image_impl(user_id):
    if 'file' not in request.files:
        return jsonify({'error': 'Sem ficheiro'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Sem ficheiro selecionado'}), 400

    if file and allowed_file(file.filename):
        # secure_filename remove caracteres perigosos do nome do ficheiro (ex: ../)
        filename = secure_filename(file.filename)
        
        # Adicionar timestamp e ID do user para evitar conflitos de nomes
        # (ex: user_15_1698400000_foto.jpg)
        filename = f"user_{user_id}_{int(datetime.utcnow().timestamp())}_{filename}"

        # Construir o caminho completo onde o ficheiro será guardado
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Atualizar DB com o novo URL
        user = User.query.get_or_404(user_id)
        # Guardar caminho relativo para servir via static folder do Flask
        user.img_url = f"/static/uploads/{filename}"
        db.session.commit()

        return jsonify({'message': 'Upload com sucesso', 'img_url': user.img_url}), 200

    return jsonify({'error': 'Tipo de ficheiro não permitido'}), 400


@users_bp.route('/<int:user_id>/simulations', methods=['GET'])
def get_user_simulations(user_id):
    """
    Listar simulações do utilizador.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: ID do utilizador
    responses:
      200:
        description: Lista de simulações
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 101
              description:
                type: string
                example: Simulação de Teste
              status:
                type: string
                example: completed
              date:
                type: string
                example: "2023-10-27T10:00:00"
              pinned:
                type: boolean
                example: true
              parameters:
                type: object
                properties:
                  population_total:
                    type: integer
                    example: 1000
                  infected_initial:
                    type: integer
                    example: 10
                  beta:
                    type: number
                    format: float
                    example: 0.5
                  gamma:
                    type: number
                    format: float
                    example: 0.1
                  duration:
                    type: integer
                    example: 30
      403:
        description: Acesso não autorizado
    """
    @jwt_required()
    def get_user_simulations_wrapper(user_id):
        # Verificar autorização
        current_user_id = get_jwt_identity()
        if str(current_user_id) != str(user_id):
            return jsonify({'error': 'Acesso não autorizado'}), 403
        return get_user_simulations_impl(user_id)
    return get_user_simulations_wrapper(user_id)


def get_user_simulations_impl(user_id):
    # Verificar se o user existe
    user = User.query.get_or_404(user_id)

    # Obter simulações ordenadas da mais recente para a mais antiga
    sims = Simulation.query.filter_by(user_id=user_id).order_by(
        Simulation.created_at.desc()).all()

    results = []
    for s in sims:
        status = SimulationStatus.query.get(s.simulation_status_id)
        params = s.parameters
        results.append({
            'id': s.id,
            'date': s.created_at.isoformat(),
            'description': s.description,
            'status': status.label,
            'pinned': s.pinned,
            'parameters': {
                'population_total': params.population_total if params else None,
                'infected_initial': params.infected_initial if params else None,
                'beta': params.beta if params else None,
                'gamma': params.gamma if params else None,
                'duration': params.duration if params else None
            }
        })

    return jsonify(results), 200


@users_bp.route('/<int:user_id>/status', methods=['PATCH'])
@admin_required()
def update_user_status(user_id):
    """
    Alterar estado do utilizador (Bloquear/Desbloquear) - Admin Only.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: ID do utilizador
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - status
          properties:
            status:
              type: string
              description: Novo estado (active, suspended, pending)
              example: suspended
    responses:
      200:
        description: Estado atualizado com sucesso
      400:
        description: Estado inválido
      403:
        description: Acesso restrito a Administradores
      404:
        description: Utilizador não encontrado
    """
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not data or 'status' not in data:
        return jsonify({'error': 'Campo status é obrigatório'}), 400

    new_status_label = data['status']

    # Validar se o estado existe na BD
    status_obj = UserStatus.query.filter_by(label=new_status_label).first()
    if not status_obj:
        return jsonify({'error': f'Estado inválido. Opções: active, suspended, pending'}), 400

    try:
        user.user_status_id = status_obj.id
        db.session.commit()
        return jsonify({'message': f'Estado do utilizador alterado para {new_status_label}'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>/role', methods=['PATCH'])
@admin_required()
def update_user_role(user_id):
    """
    Alterar role do utilizador (Promover/Despromover) - Admin Only.
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: ID do utilizador
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - role
          properties:
            role:
              type: string
              description: Novo role (admin, registered, researcher)
              example: admin
    responses:
      200:
        description: Role atualizado com sucesso
      400:
        description: Role inválido
      403:
        description: Acesso restrito a Administradores
      404:
        description: Utilizador não encontrado
    """
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not data or 'role' not in data:
        return jsonify({'error': 'Campo role é obrigatório'}), 400

    new_role_label = data['role']

    # Validar se o role existe na BD
    role_obj = UserType.query.filter_by(label=new_role_label).first()
    if not role_obj:
        return jsonify({'error': f'Role inválido. Opções: admin, registered, researcher'}), 400

    try:
        user.user_type_id = role_obj.id
        db.session.commit()
        return jsonify({'message': f'Role do utilizador alterado para {new_role_label}'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
