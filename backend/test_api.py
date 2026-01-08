import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def test_register():
    print("\n--- Testing Register ---")
    url = f"{BASE_URL}/auth/register"
    payload = {
        "name": "Test User",
        "email": "test_script@example.com",
        "password": "password123",
        "birth_date": "1990-01-01",
        "gender_id": 1
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 201 or response.status_code == 409 # 409 se já existir
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_login():
    print("\n--- Testing Login ---")
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": "test_script@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_dashboard():
    print("\n--- Testing Dashboard Stats ---")
    url = f"{BASE_URL}/stats/dashboard"
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if test_register():
        test_login()
    test_dashboard()
