# Data Visualizer & Analyzer Tool - Backend

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Initialize Database

```bash
python init_db.py
```

This will create the database and a default admin user:
- Email: `admin@example.com`
- Password: `admin123`

### 3. Run the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://127.0.0.1:8000`

### 4. API Documentation

Once the server is running, visit:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Features

- **Authentication**: JWT-based authentication
- **Data Connections**: Support for CSV, Excel, PostgreSQL, MySQL, MongoDB
- **NLP Query Engine**: Convert natural language to executable queries
- **Query History**: Track and manage query history
- **Session Management**: User session context and history

## Environment Variables

Create a `.env` file (optional, defaults are provided):

```env
DATABASE_URL=sqlite:///./data_analyzer.db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key (optional)
```

## API Endpoints

- `POST /auth/login` - Login
- `POST /auth/register` - Register new user
- `GET /connections` - Get all connections
- `POST /connections/add` - Add new connection
- `POST /query/run` - Execute natural language query
- `GET /history` - Get query history

