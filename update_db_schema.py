import os
from dotenv import load_dotenv

load_dotenv()

# Fallback to local SQLite if not set
if not os.environ.get('SQLALCHEMY_DATABASE_URI'):
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance', 'projecto_integrador.db')
    os.environ['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    print(f"Using database: {os.environ['SQLALCHEMY_DATABASE_URI']}")

# Import app AFTER setting environment variables
from app import create_app
from models import db
from sqlalchemy import text

app = create_app()

def update_schema():
    with app.app_context():
        print("Updating database schema...")
        try:
            # Check if column exists (PostgreSQL specific, but works for checking)
            # For simplicity in this environment, we'll try to add it and catch error if it exists
            # or just run the ALTER TABLE command.
            
            # Using text() for raw SQL execution
            with db.engine.connect() as connection:
                # connection.execute(text("ALTER TABLE users ADD COLUMN cargo VARCHAR(20)"))
                connection.execute(text("ALTER TABLE users ADD COLUMN about_me TEXT"))
                connection.commit()
                print("Column 'about_me' added successfully.")
        except Exception as e:
            print(f"Error (column might already exist): {e}")

if __name__ == '__main__':
    update_schema()
