import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    # Configuração da porta e host do servidor
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")

    # Configuração da Base de Dados SQLite
    # O ficheiro .db será criado na pasta 'instance' ou na raiz, dependendo da configuração
    # Aqui defino para ficar na raiz do backend para ser mais fácil de encontrar
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    #    'sqlite:///' + os.path.join(basedir, 'projecto_integrador.db')
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')

    # Desativar notificações de modificação do SQLAlchemy para poupar recursos
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ.get(
        'SQLALCHEMY_TRACK_MODIFICATIONS', 'False')

    # Chave secreta para assinar cookies de sessão e tokens (importante para segurança)
    SECRET_KEY = os.environ.get('SECRET_KEY', 'uma!chave!muito!fixe')
