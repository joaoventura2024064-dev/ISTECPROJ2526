import requests
import json
import os

BASE_URL = "http://127.0.0.1:5000/api"

# Variável global para guardar o token
ACCESS_TOKEN = None
USER_ID = None

def test_register():
    print("\n--- Testing Register ---")
    url = f"{BASE_URL}/auth/register"
    # Usar um email aleatório para não falhar em execuções repetidas
    import random
    rand_id = random.randint(1000, 9999)
    payload = {
        "name": f"Test User {rand_id}",
        "email": f"test_{rand_id}@example.com",
        "password": "password123",
        "birth_date": "1990-01-01",
        "gender_id": 1
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 201:
            global USER_ID
            USER_ID = response.json().get('user_id')
            return True, payload['email']
        return False, None
    except Exception as e:
        print(f"Error: {e}")
        return False, None

def test_login(email):
    print("\n--- Testing Login (JWT) ---")
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": "password123"
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            global ACCESS_TOKEN
            ACCESS_TOKEN = response.json().get('access_token')
            print(f"Token received: {ACCESS_TOKEN[:20]}...")
            return True
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_validation():
    print("\n--- Testing Validation (QA) ---")
    # 1. Data Inválida
    url = f"{BASE_URL}/auth/register"
    payload = {
        "name": "Bad Date",
        "email": "baddate@example.com",
        "password": "123",
        "birth_date": "01-01-1990", # Formato errado
        "gender_id": 1
    }
    res = requests.post(url, json=payload)
    print(f"Invalid Date Test: {res.status_code} (Expected 400)")
    
    # 2. População Negativa
    if not USER_ID: return
    url_sim = f"{BASE_URL}/simulations/"
    payload_sim = {
        "user_id": USER_ID,
        "description": "Negative Pop",
        "parameters": {
            "population_total": -100,
            "infected_initial": 10,
            "beta": 0.5,
            "gamma": 0.1,
            "duration": 30
        }
    }
    res_sim = requests.post(url_sim, json=payload_sim)
    print(f"Negative Pop Test: {res_sim.status_code} (Expected 400)")

def test_upload():
    print("\n--- Testing Image Upload (End User) ---")
    if not USER_ID: return
    
    url = f"{BASE_URL}/users/{USER_ID}/upload-image"
    
    # Criar um ficheiro dummy
    with open("test_image.jpg", "wb") as f:
        f.write(b"fake image content")
        
    try:
        with open('test_image.jpg', 'rb') as f_img:
            files = {'file': ('test_image.jpg', f_img)}
            response = requests.post(url, files=files)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Garantir que o ficheiro está fechado antes de remover
        if os.path.exists("test_image.jpg"):
            try:
                os.remove("test_image.jpg")
            except PermissionError:
                print("Warning: Could not remove test_image.jpg (file in use)")

if __name__ == "__main__":
    success, email = test_register()
    if success:
        test_login(email)
        test_validation()
        test_upload()
