import os

# Obter o diretório base onde este ficheiro está (pasta backend)
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Chave secreta para assinar cookies de sessão e tokens (importante para segurança)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'uma-chave-muito-secreta-desenvolvimento'
    
    # Configuração da Base de Dados SQLite
    # O ficheiro .db será criado na pasta 'instance' ou na raiz, dependendo da configuração
    # Aqui defino para ficar na raiz do backend para ser mais fácil de encontrar
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'projecto_integrador.db')
    
    # Desativar notificações de modificação do SQLAlchemy para poupar recursos
    SQLALCHEMY_TRACK_MODIFICATIONS = False
