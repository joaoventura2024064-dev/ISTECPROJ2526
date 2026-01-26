import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    # Configuração do Servidor.
    # Usamos variáveis de ambiente para flexibilidade, permitindo alterar definições
    # sem modificar o código (ex: portas diferentes para dev vs prod).
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")
    # O modo de debug ativa o 'hot reloading' e páginas de erro detalhadas.
    # IMPORTANTE: Definir sempre como False em produção para evitar expor informações sensíveis.
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    # Configuração de Email para envio de notificações ou recuperação de password.
    # Usamos o Brevo como o nosso fornecedor SMTP.
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp-relay.brevo.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 2525))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))

    # Configuração da Base de Dados.
    # Usamos SQLite para desenvolvimento local porque é uma base de dados baseada em ficheiro
    # que não requer um processo de servidor separado.
    # O ficheiro da base de dados será guardado na pasta 'instance' por defeito.
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or \
        'sqlite:///' + os.path.join(basedir, 'instance', 'projecto_integrador.db')

    # Desativamos o rastreio de modificações porque consome memória extra e
    # geralmente não é necessário para operações CRUD padrão.
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ.get(
        'SQLALCHEMY_TRACK_MODIFICATIONS', 'False')

    # Chave Secreta.
    # Esta chave é usada para assinar cookies de sessão e outros tokens de segurança.
    # Deve ser mantida secreta e aleatória para impedir que atacantes alterem os dados.
    SECRET_KEY = os.environ.get('SECRET_KEY', 'uma!chave!muito!fixe')

    # Expiração do JWT (JSON Web Token).
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
