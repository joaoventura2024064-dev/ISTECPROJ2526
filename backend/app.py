from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import Config
from models import db

mail = Mail()


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

    # Inicializar Mail
    mail.init_app(app)

    # Ativar CORS (Cross-Origin Resource Sharing)
    # Isto permite que o frontend (React) noutra porta comunique com este backend
    CORS(app)

    # Rota para a documentação Scalar (Interface Moderna)
    @app.route('/docs')
    def scalar_docs():
        html = """
        <!doctype html>
        <html>
          <head>
            <title>API Documentation</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; }
            </style>
          </head>
          <body>
            <script
              id="api-reference"
              data-url="/apispec_1.json">
            </script>
            <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
          </body>
        </html>
        """
        return html

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
        from models import (
            User, Simulation, SimulationParameters, SimulationSteps,
            UserType, UserStatus, Genders, SimulationStatus
        )

        # Criar todas as tabelas definidas no models.py se não existirem
        db.create_all()
        print("Base de dados verificada/criada com sucesso.")

    return app


# Se este ficheiro for executado diretamente, arranca o servidor
if __name__ == '__main__':
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
