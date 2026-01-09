from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db


def create_app(config_class=Config):
    # Inicializar a aplicação Flask
    app = Flask(__name__)

    # Carregar configurações do ficheiro config.py
    app.config.from_object(config_class)

    # Configurar pasta de uploads (para imagens de perfil)
    import os
    UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Inicializar a Base de Dados com a app
    db.init_app(app)

    # Inicializar JWT
    jwt = JWTManager(app)

    # Ativar CORS (Cross-Origin Resource Sharing)
    # Isto permite que o frontend (React) noutra porta comunique com este backend
    CORS(app)

    # Registar Blueprints (Rotas)
    from routes.auth import auth_bp
    from routes.simulations import simulations_bp
    from routes.stats import stats_bp
    from routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(simulations_bp, url_prefix='/api/simulations')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    # Contexto da aplicação para operações de base de dados
    with app.app_context():
        # Importar modelos para garantir que o SQLAlchemy os conhece antes de criar as tabelas
        from models import User, Simulation  # e outros...

        # Criar todas as tabelas definidas no models.py se não existirem
        db.create_all()
        print("Base de dados verificada/criada com sucesso.")

    return app


# Se este ficheiro for executado diretamente, arranca o servidor
if __name__ == '__main__':
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
