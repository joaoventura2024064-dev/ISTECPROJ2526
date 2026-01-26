from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Inicializar a extensão SQLAlchemy.
# Este objeto será usado para definir os nossos modelos (tabelas) e interagir com a base de dados.
# É ligado à aplicação Flask no ficheiro app.py usando db.init_app(app).
db = SQLAlchemy()

# ==========================================
# TABELAS DE LOOKUP (Tipos, Status, Géneros)
# ==========================================
# Usamos tabelas de lookup para normalizar a nossa base de dados. Em vez de guardar strings como "admin"
# repetidamente na tabela Users, guardamos um ID inteiro que refere estas tabelas.
# Isto poupa espaço e garante consistência (ex: previne erros como "Admin" vs "admin").

class UserType(db.Model):
    """
    Define os tipos de utilizador no sistema (ex: 'admin', 'registered').
    Isto permite-nos gerir facilmente as permissões com base no papel do utilizador.
    """
    __tablename__ = 'user_types'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False,
                      unique=True)  # O nome do tipo (ex: 'admin')

    def __repr__(self):
        return f'<UserType {self.label}>'


class UserStatus(db.Model):
    """
    Define os estados possíveis de uma conta de utilizador (ex: 'active', 'pending', 'suspended').
    Isto é útil para gerir o acesso do utilizador sem apagar registos.
    """
    __tablename__ = 'user_status'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<UserStatus {self.label}>'


class Genders(db.Model):
    """
    Define as opções de género disponíveis para os utilizadores.
    Usar uma tabela permite-nos adicionar facilmente mais opções no futuro, se necessário.
    """
    __tablename__ = 'genders'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<Gender {self.label}>'


class SimulationStatus(db.Model):
    """
    Define os estados do ciclo de vida de uma simulação (ex: 'running', 'completed', 'failed').
    Isto ajuda o frontend a saber se deve mostrar um spinner de carregamento ou os resultados.
    """
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
    A tabela principal de Utilizadores.
    Guarda dados de autenticação, informação de perfil e ligações às tabelas de lookup.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)  # Nome completo
    email = db.Column(db.String(100), unique=True,
                      nullable=False)  # O email deve ser único para login
    
    # Guardamos a hash da password, NÃO a password real.
    # Se a base de dados for comprometida, os atacantes não terão acesso às passwords dos utilizadores.
    password_hash = db.Column(db.String(255), nullable=False)

    birth_date = db.Column(db.Date, nullable=True)
    # Cargo ou função do utilizador
    cargo = db.Column(db.String(20), nullable=True)
    about_me = db.Column(db.Text, nullable=True)  # Biografia ou descrição
    # URL para a imagem de perfil guardada na pasta static/uploads
    img_url = db.Column(db.String(255), nullable=True)

    # Definir automaticamente a data de registo quando o utilizador é criado
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)  # Atualizado em cada login

    # Chaves Estrangeiras (Foreign Keys)
    # Estas ligam o utilizador às linhas específicas nas tabelas de lookup definidas acima.
    gender_id = db.Column(db.Integer, db.ForeignKey(
        'genders.id'), nullable=True)
    user_type_id = db.Column(db.Integer, db.ForeignKey(
        'user_types.id'), nullable=False, default=1)
    user_status_id = db.Column(db.Integer, db.ForeignKey(
        'user_status.id'), nullable=False, default=1)

    # Relações
    # Isto permite-nos aceder às simulações de um utilizador via `user.simulations`.
    # `lazy=True` significa que as simulações são carregadas da BD apenas quando acedemos a esta propriedade.
    simulations = db.relationship('Simulation', backref='creator', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'


class Simulation(db.Model):
    """
    Representa uma simulação criada por um utilizador.
    Liga o utilizador, os parâmetros e os resultados (passos).
    """
    __tablename__ = 'simulations'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=True)
    # Permite aos utilizadores "fixar" ou dar favourite simulações para as encontrar facilmente mais tarde
    pinned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Chaves Estrangeiras
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    simulation_status_id = db.Column(db.Integer, db.ForeignKey(
        'simulation_status.id'), nullable=False, default=1)

    # Relações
    # `uselist=False` garante uma relação 1:1 (uma simulação tem um conjunto de parâmetros).
    # `cascade="all, delete-orphan"` garante que se apagarmos uma simulação,
    # os seus parâmetros e passos também são apagados automaticamente.
    parameters = db.relationship(
        'SimulationParameters', backref='simulation', uselist=False, cascade="all, delete-orphan")
    
    # Relação 1:Many com os passos da simulação (dias).
    steps = db.relationship(
        'SimulationSteps', backref='simulation', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Simulation {self.id} - User {self.user_id}>'


class SimulationParameters(db.Model):
    """
    Guarda os parâmetros de entrada para uma simulação.
    Separar isto da tabela Simulation mantém o esquema limpo e organizado.
    """
    __tablename__ = 'simulation_parameters'

    # A chave primária é também uma chave estrangeira para Simulation, forçando uma relação 1:1.
    simulation_id = db.Column(db.Integer, db.ForeignKey(
        'simulations.id'), primary_key=True)

    # Usamos BigInteger para contagens de população para suportar simulações à escala global (triliões).
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
    Guarda os resultados diários de uma simulação.
    Cada linha representa um dia (passo) da simulação.
    """
    __tablename__ = 'simulation_steps'

    id = db.Column(db.Integer, primary_key=True)
    simulation_id = db.Column(db.Integer, db.ForeignKey(
        'simulations.id'), nullable=False)

    # O número do dia (ex: 1, 2, 3...)
    step_number = db.Column(db.Integer, nullable=False)

    # Métricas SIR (Suscetíveis, Infetados, Recuperados)
    # Usamos BigInteger para corresponder à escala da população.
    susceptible = db.Column(db.BigInteger, nullable=False)
    infected = db.Column(db.BigInteger, nullable=False)
    recovered = db.Column(db.BigInteger, nullable=False)

    # Métricas Adicionais
    # Número Reprodutivo Efetivo (Rt) - ajuda a entender se o vírus está a espalhar-se ou a morrer.
    rt_value = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return f'<Step {self.step_number} for Sim {self.simulation_id}>'
