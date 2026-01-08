# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secretpassword",
    "birth_date": "1990-01-01",
    "gender_id": 1
  }
  ```
- **Response (201)**:
  ```json
  {
    "message": "Utilizador registado com sucesso",
    "user_id": 1
  }
  ```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "secretpassword"
  }
  ```
- **Response (200)**:
  ```json
  {
    "message": "Login efetuado com sucesso",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "registered"
    }
  }
  ```

## Users

### Get Profile
- **URL**: `/users/<id>`
- **Method**: `GET`
- **Response (200)**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "birth_date": "1990-01-01",
    "gender": "Male",
    "role": "registered",
    "status": "active",
    "created_at": "2026-01-08T20:00:00"
  }
  ```

## Simulations

### Create Simulation
- **URL**: `/simulations/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "user_id": 1,
    "description": "Simulation Test 1",
    "parameters": {
      "population_total": 1000,
      "infected_initial": 10,
      "beta": 0.5,
      "gamma": 0.1,
      "duration": 30
    }
  }
  ```

### Get User Simulations
- **URL**: `/simulations/user/<user_id>`
- **Method**: `GET`

## Stats (Dashboard)

### Get Dashboard Stats
- **URL**: `/stats/dashboard`
- **Method**: `GET`
- **Response (200)**:
  ```json
  {
    "total_users": 10,
    "total_simulations": 5,
    "completed_simulations": 2
  }
  ```
