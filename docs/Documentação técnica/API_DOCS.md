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
- **Errors**:
    - `400 Bad Request`: Email/Password missing or Invalid Date Format (YYYY-MM-DD).
    - `409 Conflict`: Email already registered.

### Login (JWT)
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
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "registered"
    }
  }
  ```
- **Note**: The `access_token` should be sent in the Authorization header for protected routes: `Authorization: Bearer <token>`.

## Users

### Get Profile
- **URL**: `/users/<id>`
- **Method**: `GET`

### Upload Profile Image
- **URL**: `/users/<id>/upload-image`
- **Method**: `POST`
- **Body**: `multipart/form-data` with key `file`.
- **Response (200)**:
  ```json
  {
    "message": "Upload com sucesso",
    "img_url": "/static/uploads/user_1_123456_image.jpg"
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
- **Validation**:
    - `population_total` > 0
    - `infected_initial` >= 0
    - `beta`, `gamma` >= 0

### Get User Simulations
- **URL**: `/simulations/user/<user_id>`
- **Method**: `GET`

## Stats (Dashboard)

### Get Dashboard Stats
- **URL**: `/stats/dashboard`
- **Method**: `GET`
