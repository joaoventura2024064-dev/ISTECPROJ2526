from flask import Blueprint, request, jsonify
from models import db, User, UserType, UserStatus, Genders, Simulation, SimulationStatus
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
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
def update_user_profile(user_id):
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
            birth_date:
              type: string
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
