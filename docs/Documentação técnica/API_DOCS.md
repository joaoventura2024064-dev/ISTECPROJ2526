# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### POST Register User
**URL**: `/auth/register`
**Description**: Registers a new user in the system.
**Auth Required**: No

#### Request
**Headers**:
- `Content-Type`: `application/json`

**Body Parameters**:
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Full name of the user. |
| `email` | string | **Yes** | Valid email address (must be unique). |
| `password` | string | **Yes** | Password for the account. |
| `birth_date` | string | No | Date of birth in `YYYY-MM-DD` format. |
| `gender_id` | integer | No | ID of the gender (1: Male, 2: Female, etc.). |

**Example Request**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "birth_date": "1990-05-15",
  "gender_id": 1
}
```

#### Response
**Success (201 Created)**:
```json
{
  "message": "Utilizador registado com sucesso",
  "user_id": 15
}
```

**Errors**:
- `400 Bad Request`: Missing required fields or invalid date format.
- `409 Conflict`: Email already exists.

---

### POST Login
**URL**: `/auth/login`
**Description**: Authenticates a user and returns a JWT token.
**Auth Required**: No

#### Request
**Headers**:
- `Content-Type`: `application/json`

**Body Parameters**:
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | string | **Yes** | Registered email address. |
| `password` | string | **Yes** | User password. |

**Example Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response
**Success (200 OK)**:
```json
{
  "message": "Login efetuado com sucesso",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 15,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "registered"
  }
}
```

**Errors**:
- `401 Unauthorized`: Invalid credentials.
- `403 Forbidden`: Account suspended or pending.

---

## Users

### GET User Profile
**URL**: `/users/<user_id>`
**Description**: Retrieves public profile information of a user.
**Auth Required**: No (Public profile)

#### Request
**Path Parameters**:
- `user_id`: Integer ID of the user.

**Example Request**:
`GET /users/15`

#### Response
**Success (200 OK)**:
```json
{
  "id": 15,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "birth_date": "1990-05-15",
  "gender": "Male",
  "role": "registered",
  "status": "active",
  "img_url": "/static/uploads/user_15_1705489200_profile.jpg",
  "created_at": "2024-01-10T14:30:00"
}
```

**Errors**:
- `404 Not Found`: User does not exist.

---

### PUT Update User Profile
**URL**: `/users/<user_id>`
**Description**: Updates user profile details.
**Auth Required**: Yes (Should match the logged-in user)

#### Request
**Headers**:
- `Authorization`: `Bearer <token>`
- `Content-Type`: `application/json`

**Body Parameters**:
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | No | New full name. |
| `gender_id` | integer | No | New gender ID. |
| `birth_date` | string | No | New birth date (`YYYY-MM-DD`). |

**Example Request**:
```json
{
  "name": "Johnathan Doe",
  "gender_id": 1
}
```

#### Response
**Success (200 OK)**:
```json
{
  "message": "Perfil atualizado com sucesso"
}
```

---

### POST Upload Profile Image
**URL**: `/users/<user_id>/upload-image`
**Description**: Uploads a profile picture for the user.
**Auth Required**: Yes

#### Request
**Headers**:
- `Authorization`: `Bearer <token>`
- `Content-Type`: `multipart/form-data`

**Form Data**:
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `file` | File | **Yes** | Image file (jpg, png, gif). |

#### Response
**Success (200 OK)**:
```json
{
  "message": "Upload com sucesso",
  "img_url": "/static/uploads/user_15_1705489200_profile.jpg"
}
```

**Errors**:
- `400 Bad Request`: No file selected or invalid file type.

---

### GET User Simulations
**URL**: `/users/<user_id>/simulations`
**Description**: Retrieves a list of simulations created by the user.
**Auth Required**: Yes

#### Request
**Path Parameters**:
- `user_id`: Integer ID of the user.

**Example Request**:
`GET /users/15/simulations`

#### Response
**Success (200 OK)**:
```json
[
  {
    "id": 101,
    "date": "2024-01-15T10:30:00",
    "description": "Simulation Test 1",
    "status": "complete",
    "pinned": false
  },
  {
    "id": 102,
    "date": "2024-01-16T14:20:00",
    "description": "High Beta Scenario",
    "status": "running",
    "pinned": true
  }
]
```

---

## Simulations

### POST Create Simulation
**URL**: `/simulations/`
**Description**: Creates and immediately executes a new stochastic SIR simulation.
**Auth Required**: Yes

#### Request
**Headers**:
- `Authorization`: `Bearer <token>`
- `Content-Type`: `application/json`

**Body Parameters**:
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | integer | **Yes** | ID of the user creating the simulation. |
| `description` | string | No | Short description/name for the simulation. |
| `parameters` | object | **Yes** | Object containing simulation parameters. |
| `parameters.population_total` | integer | **Yes** | Total population (N). Must be > 0. |
| `parameters.infected_initial` | integer | **Yes** | Initial infected count (I0). |
| `parameters.beta` | float | **Yes** | Effective contact rate. |
| `parameters.gamma` | float | **Yes** | Recovery rate. |
| `parameters.duration` | integer | **Yes** | Duration in days. |

**Example Request**:
```json
{
  "user_id": 15,
  "description": "Baseline Scenario - Sprint C",
  "parameters": {
    "population_total": 1000,
    "infected_initial": 10,
    "beta": 0.5,
    "gamma": 0.1,
    "duration": 50
  }
}
```

#### Response
**Success (201 Created)**:
```json
{
  "message": "Simulação criada com sucesso",
  "id": 103
}
```

**Errors**:
- `400 Bad Request`: Invalid parameters (e.g., negative population).

---

### GET Simulation Details
**URL**: `/simulations/<sim_id>`
**Description**: Retrieves full details of a simulation, including parameters and daily results (steps).
**Auth Required**: Yes

#### Request
**Path Parameters**:
- `sim_id`: Integer ID of the simulation.

**Example Request**:
`GET /simulations/103`

#### Response
**Success (200 OK)**:
```json
{
  "id": 103,
  "user_id": 15,
  "created_at": "2024-01-17T10:00:00",
  "description": "Baseline Scenario - Sprint C",
  "status": "complete",
  "parameters": {
    "population_total": 1000,
    "infected_initial": 10,
    "beta": 0.5,
    "gamma": 0.1,
    "duration": 50
  },
  "steps": [
    { "step": 0, "S": 990, "I": 10, "R": 0, "Rt": 5.0 },
    { "step": 1, "S": 985, "I": 15, "R": 0, "Rt": 4.9 },
    { "step": 2, "S": 970, "I": 30, "R": 0, "Rt": 4.8 },
    ...
  ]
}
```

---

### GET Export Simulation CSV
**URL**: `/simulations/<sim_id>/export`
**Description**: Exports the simulation results as a CSV file download.
**Auth Required**: Yes

#### Request
**Path Parameters**:
- `sim_id`: Integer ID of the simulation.

**Example Request**:
`GET /simulations/103/export`

#### Response
**Success (200 OK)**:
- **Content-Type**: `text/csv`
- **Header**: `Content-Disposition: attachment; filename=simulation_103.csv`
- **Body**:
  ```csv
  Day,Susceptible,Infected,Recovered,Rt
  0,990,10,0,5.0
  1,985,15,0,4.9
  ...
  ```

---

## Stats

### GET Dashboard Stats
**URL**: `/stats/dashboard`
**Description**: Retrieves global statistics for the dashboard.
**Auth Required**: No (Public dashboard)

#### Request
**Example Request**:
`GET /stats/dashboard`

#### Response
**Success (200 OK)**:
```json
{
  "total_users": 150,
  "total_simulations": 342,
  "completed_simulations": 320
}
```
