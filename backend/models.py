from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Inicializar a extensão SQLAlchemy
# Será ligada à app Flask mais tarde no ficheiro app.py
db = SQLAlchemy()

# ==========================================
# TABELAS DE LOOKUP (Tipos, Status, Géneros)
# ==========================================


class UserType(db.Model):
    """Tabela para definir os tipos de utilizador (ex: admin, registered)."""
    __tablename__ = 'user_types'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False,
                      unique=True)  # O nome do tipo

    def __repr__(self):
        return f'<UserType {self.label}>'


class UserStatus(db.Model):
    """Tabela para estados de conta (ex: active, pending, suspended)."""
    __tablename__ = 'user_status'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<UserStatus {self.label}>'


class Genders(db.Model):
    """Tabela para opções de género."""
    __tablename__ = 'genders'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<Gender {self.label}>'


class SimulationStatus(db.Model):
    """Tabela para estados da simulação (ex: complete, paused)."""
    __tablename__ = 'simulation_status'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<SimulationStatus {self.label}>'


# ==========================================
# TABELAS PRINCIPAIS
# ==========================================

class User(db.Model):
    """
    Tabela principal de Utilizadores.
    Guarda toda a informação de perfil e credenciais.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)  # Nome completo
    email = db.Column(db.String(100), unique=True,
                      nullable=False)  # Email deve ser único
    # Guardamos apenas a hash, nunca a password real
    password_hash = db.Column(db.String(255), nullable=False)

    birth_date = db.Column(db.Date, nullable=True)
    # Cargo/Função do utilizador
    cargo = db.Column(db.String(20), nullable=True)
    about_me = db.Column(db.Text, nullable=True)  # Sobre mim (Biografia)
    # URL para a imagem de perfil
    img_url = db.Column(db.String(255), nullable=True)

    # Data de registo automática
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)  # Data do último login

    # Chaves Estrangeiras (Foreign Keys)
    # Ligam este utilizador às tabelas de lookup
    gender_id = db.Column(db.Integer, db.ForeignKey(
        'genders.id'), nullable=True)
    user_type_id = db.Column(db.Integer, db.ForeignKey(
        'user_types.id'), nullable=False, default=1)
    user_status_id = db.Column(db.Integer, db.ForeignKey(
        'user_status.id'), nullable=False, default=1)

    # Relações (para facilitar o acesso via código, ex: user.simulations)
    simulations = db.relationship('Simulation', backref='creator', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'


class Simulation(db.Model):
    """
    Tabela que representa uma Simulação criada por um utilizador.
    """
    __tablename__ = 'simulations'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=True)
    # Se o utilizador "fixou" esta simulação
    pinned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Chaves Estrangeiras
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    simulation_status_id = db.Column(db.Integer, db.ForeignKey(
        'simulation_status.id'), nullable=False, default=1)

    # Relações
    # uselist=False garante que é uma relação 1-para-1
    parameters = db.relationship(
        'SimulationParameters', backref='simulation', uselist=False, cascade="all, delete-orphan")
    # Relação 1-para-Muitos com os passos da simulação
    steps = db.relationship(
        'SimulationSteps', backref='simulation', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Simulation {self.id} - User {self.user_id}>'


class SimulationParameters(db.Model):
    """
    Parâmetros de entrada de uma simulação.
    Relação 1-para-1 com a tabela Simulations.
    """
    __tablename__ = 'simulation_parameters'

    # A chave primária é também a chave estrangeira para garantir 1-para-1
    simulation_id = db.Column(db.Integer, db.ForeignKey(
        'simulations.id'), primary_key=True)

    population_total = db.Column(
        db.BigInteger, nullable=False)  # População Total (N)
    infected_initial = db.Column(
        db.BigInteger, nullable=False)  # Infetados Iniciais (I0)
    beta = db.Column(db.Float, nullable=False)  # Taxa de transmissão
    gamma = db.Column(db.Float, nullable=False)  # Taxa de recuperação
    duration = db.Column(db.Integer, nullable=False)  # Duração em dias

    def __repr__(self):
        return f'<Params for Sim {self.simulation_id}>'


class SimulationSteps(db.Model):
    """
    Resultados detalhados de cada passo (dia) da simulação.
    Guarda tanto os valores SIR como o Rt.
    """
    __tablename__ = 'simulation_steps'

    id = db.Column(db.Integer, primary_key=True)
    simulation_id = db.Column(db.Integer, db.ForeignKey(
        'simulations.id'), nullable=False)

    # O dia ou passo da simulação
    step_number = db.Column(db.Integer, nullable=False)

    # Métricas SIR
    susceptible = db.Column(db.BigInteger, nullable=False)
    infected = db.Column(db.BigInteger, nullable=False)
    recovered = db.Column(db.BigInteger, nullable=False)

    # Métricas Adicionais
    # Reproductive number efetivo
    rt_value = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return f'<Step {self.step_number} for Sim {self.simulation_id}>'
