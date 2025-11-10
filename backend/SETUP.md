# Backend Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize database:**
   ```bash
   python init_db.py
   ```

3. **Start server:**
   ```bash
   python run.py
   ```
   Or:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Default User

After running `init_db.py`, you can login with:
- Email: `admin@example.com`
- Password: `admin`

Or register a new user through the frontend.

## API Documentation

Once the server is running:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Adding Data Connections

### CSV Connection
```json
{
  "name": "My CSV File",
  "type": "csv",
  "details": {
    "file_path": "C:/path/to/your/file.csv"
  }
}
```

### Excel Connection
```json
{
  "name": "My Excel File",
  "type": "excel",
  "details": {
    "file_path": "C:/path/to/your/file.xlsx",
    "sheet_name": "Sheet1"
  }
}
```

### PostgreSQL Connection
```json
{
  "name": "My Postgres DB",
  "type": "postgres",
  "details": {
    "host": "localhost",
    "port": 5432,
    "database": "mydb",
    "username": "user",
    "password": "password"
  }
}
```

### MySQL Connection
```json
{
  "name": "My MySQL DB",
  "type": "mysql",
  "details": {
    "host": "localhost",
    "port": 3306,
    "database": "mydb",
    "username": "user",
    "password": "password"
  }
}
```

### MongoDB Connection
```json
{
  "name": "My MongoDB",
  "type": "mongodb",
  "details": {
    "host": "localhost",
    "port": 27017,
    "database": "mydb",
    "collection": "mycollection",
    "username": "user",
    "password": "password"
  }
}
```

