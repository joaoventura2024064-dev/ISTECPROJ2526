from app import create_app
from models import db, UserType, UserStatus, Genders, SimulationStatus, User
from werkzeug.security import generate_password_hash

app = create_app()

def seed_database():
    """
    Função para popular a base de dados com valores iniciais (Lookup Tables).
    Executar isto uma vez para garantir que temos os dados básicos.
    """
    with app.app_context():
        print("A iniciar povoamento da Base de Dados...")

        # 1. Tipos de Utilizador
        types = ['registered', 'admin', 'researcher']
        for t in types:
            if not UserType.query.filter_by(label=t).first():
                db.session.add(UserType(label=t))
                print(f"Adicionado UserType: {t}")

        # 2. Estados de Utilizador
        statuses = ['active', 'pending', 'suspended']
        for s in statuses:
            if not UserStatus.query.filter_by(label=s).first():
                db.session.add(UserStatus(label=s))
                print(f"Adicionado UserStatus: {s}")

        # 3. Géneros
        genders = ['Male', 'Female', 'Other', 'Prefer not to say']
        for g in genders:
            if not Genders.query.filter_by(label=g).first():
                db.session.add(Genders(label=g))
                print(f"Adicionado Gender: {g}")

        # 4. Estados de Simulação
        sim_statuses = ['complete', 'running', 'paused', 'failed', 'deleted']
        for ss in sim_statuses:
            if not SimulationStatus.query.filter_by(label=ss).first():
                db.session.add(SimulationStatus(label=ss))
                print(f"Adicionado SimulationStatus: {ss}")

        # Commit das tabelas de lookup
        db.session.commit()

        # 5. Criar um Admin de teste (Opcional)
        admin_email = "admin@istec.pt"
        if not User.query.filter_by(email=admin_email).first():
            # Precisamos dos IDs dos lookups
            admin_type = UserType.query.filter_by(label='admin').first()
            active_status = UserStatus.query.filter_by(label='active').first()
            
            admin = User(
                name="Administrador Principal",
                email=admin_email,
                password_hash=generate_password_hash("admin123"), # Hash da password
                user_type_id=admin_type.id,
                user_status_id=active_status.id
            )
            db.session.add(admin)
            print(f"Criado utilizador Admin: {admin_email}")
            db.session.commit()

        print("Povoamento concluído com sucesso!")

if __name__ == '__main__':
    seed_database()
