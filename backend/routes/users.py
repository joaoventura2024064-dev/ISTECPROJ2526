from flask import Blueprint, request, jsonify
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
    """
    @admin_required()
    def get_all_users_wrapper():
        users = User.query.all()
        results = []
        for user in users:
            type_label = UserType.query.get(user.user_type_id).label
            status_label = UserStatus.query.get(user.user_status_id).label
            results.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': type_label,
                'status': status_label,
                'created_at': user.created_at.isoformat()
            })
        return jsonify(results), 200
    return get_all_users_wrapper()

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    # Verificar autorização (Próprio ou Admin)
    current_user_id = get_jwt_identity()
    is_admin = False
    
    # Check if admin
    curr_user = User.query.get(current_user_id)
    if curr_user:
        user_type = UserType.query.get(curr_user.user_type_id)
        if user_type and user_type.label == 'admin':
            is_admin = True
            
    if str(current_user_id) != str(user_id) and not is_admin:
        return jsonify({'error': 'Acesso não autorizado'}), 403
    """
    Obter perfil do utilizador.
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: Detalhes do perfil
        schema:
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
            status:
              type: string
      404:
        description: Utilizador não encontrado
    """
    user = User.query.get_or_404(user_id)
    
    # Obter labels das tabelas de lookup
    gender_label = Genders.query.get(user.gender_id).label if user.gender_id else None
    type_label = UserType.query.get(user.user_type_id).label
    status_label = UserStatus.query.get(user.user_status_id).label

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'birth_date': user.birth_date.isoformat() if user.birth_date else None,
        'gender': gender_label,
        'role': type_label,
        'status': status_label,
        'img_url': user.img_url,
        'created_at': user.created_at.isoformat()
    }), 200

@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
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
    """
    Atualizar perfil do utilizador.
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
      - in: body
        name: body
        schema:
          type: object
          properties:
            name:
              type: string
            gender_id:
              type: integer
            gender_id:
              type: integer
            birth_date:
              type: string
            password:
              type: string
              description: Nova password (opcional)
    responses:
      200:
        description: Perfil atualizado
      400:
        description: Dados inválidos
    """
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Sem dados para atualizar'}), 400

    try:
        if 'name' in data:
            user.name = data['name']
        
        if 'birth_date' in data:
            # Assumindo formato YYYY-MM-DD
            # TODO: Adicionar conversão de string para date object se necessário
            pass 

        if 'gender_id' in data:
            user.gender_id = data['gender_id']

        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])

        # Admin pode alterar status e role
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

import os
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
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
            img_url:
              type: string
      400:
        description: Ficheiro inválido ou em falta
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
        filename = secure_filename(file.filename)
        # Adicionar timestamp ou ID para evitar conflitos
        filename = f"user_{user_id}_{int(datetime.utcnow().timestamp())}_{filename}"
        
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Atualizar DB
        user = User.query.get_or_404(user_id)
        # Guardar caminho relativo para servir via static
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
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
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
              description:
                type: string
              status:
                type: string
              date:
                type: string
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
