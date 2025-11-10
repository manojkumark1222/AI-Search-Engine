<<<<<<< HEAD
# Data Visualizer & Analyzer Tool

A full-stack AI-driven Data Search and Analysis Platform that connects to any type of data source (CSV, Excel, SQL databases, MongoDB) and allows users to query and analyze their data through natural language.

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 🔌 **Multiple Data Sources** - Connect to CSV, Excel, PostgreSQL, MySQL, MongoDB
- 🤖 **NLP Query Engine** - Convert natural language queries to executable SQL/Pandas queries
- 📊 **Data Analysis** - Execute queries and get results in real-time
- 📝 **Query History** - Track and manage query history per user session
- 💾 **Session Management** - Maintain user context and query history

## Project Structure

```
.
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/     # Login, Dashboard, Connections, QueryChat
│   │   ├── services/  # API service
│   │   └── App.jsx    # Main app component
│   └── package.json
│
└── backend/           # FastAPI backend
    ├── routers/       # API routes (auth, connections, query, history)
    ├── connectors/    # Database connectors (CSV, Excel, SQL, MongoDB)
    ├── nlp/           # NLP query engine
    ├── models.py      # Database models
    └── main.py        # FastAPI application
```

## Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm** or **yarn** (for frontend)

## Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize the database:**
   ```bash
   python init_db.py
   ```
   This creates the database and a default admin user:
   - Email: `admin@example.com`
   - Password: `admin`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install npm dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Start Backend Server

From the `backend` directory:

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at:
- **API Server:** http://127.0.0.1:8000
- **API Documentation:** http://127.0.0.1:8000/docs
- **ReDoc Documentation:** http://127.0.0.1:8000/redoc

### Start Frontend Server

From the `frontend` directory:

```bash
npm run dev
```

The frontend will be available at:
- **Frontend:** http://localhost:5173 (or the port shown in terminal)

## Usage Guide

### 1. Register/Login

1. Open the frontend application in your browser (http://localhost:5173)
2. Click "Don't have an account? Register" to create a new account
3. Enter your email and password (minimum 6 characters)
4. Click "Register"
5. After registration, login with your credentials

**Default Admin Account:**
- Email: `admin@example.com`
- Password: `admin`

### 2. Add Data Connections

1. After logging in, navigate to **Connections** page
2. Enter a connection name
3. Select connection type:
   - **CSV** - Upload CSV files
   - **Excel** - Upload Excel files
   - **Postgres** - PostgreSQL database
   - **MySQL** - MySQL database
   - **MongoDB** - MongoDB database
4. For file-based connections (CSV/Excel), provide the file path
5. For database connections, provide:
   - Host
   - Port
   - Database name
   - Username
   - Password
6. Click "Add" to save the connection

### 3. Query Data Using Natural Language

1. Navigate to **Query** page
2. Enter your question in natural language, for example:
   - "Show top 5 students by marks"
   - "Average sales by region this quarter"
   - "Count total orders"
   - "Find highest revenue by product"
3. Click "Search" to execute the query
4. View results in the table format
5. Use suggested actions like "Show as table", "Export to CSV", "Visualize as chart"

### Example Queries

- `Show top 10 students by marks`
- `Average sales by region`
- `Count total customers`
- `Find maximum revenue`
- `Group by category and show average price`
- `Show all products with price greater than 100`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Connections
- `GET /connections` - Get all connections
- `POST /connections/add` - Add new connection
- `GET /connections/{id}` - Get specific connection
- `DELETE /connections/{id}` - Delete connection

### Query
- `POST /query/run` - Execute natural language query
- `GET /query/schema/{connection_id}` - Get schema for connection

### History
- `GET /history` - Get query history
- `POST /history/log` - Log query to history
- `DELETE /history/{id}` - Delete history item

## Configuration

### Backend Configuration

Edit `backend/config.py` or create a `.env` file:

```env
DATABASE_URL=sqlite:///./data_analyzer.db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key (optional)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Configuration

The frontend API base URL is configured in `frontend/src/services/api.js`:

```javascript
baseURL: "http://127.0.0.1:8000"
```

## Troubleshooting

### Backend Issues

1. **Port already in use:**
   - Change port in `backend/run.py` or use: `uvicorn main:app --port 8001`

2. **Database errors:**
   - Delete `data_analyzer.db` and run `python init_db.py` again

3. **Import errors:**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`

### Frontend Issues

1. **Connection refused:**
   - Ensure backend server is running on port 8000
   - Check CORS settings in `backend/main.py`

2. **White screen:**
   - Check browser console for errors
   - Ensure backend is accessible

## Development

### Backend Development

- FastAPI automatically reloads on code changes when using `--reload` flag
- API documentation is available at `/docs` endpoint
- Database is SQLite by default (can be changed to PostgreSQL/MySQL)

### Frontend Development

- Vite hot-reloads on code changes
- React DevTools recommended for debugging

## Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **Pandas** - Data manipulation
- **Pydantic** - Data validation
- **JWT** - Authentication

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the API documentation at http://127.0.0.1:8000/docs

=======
# Data_AI_Insights
>>>>>>> c9898f187be4c877381550610954ea28677a129f
