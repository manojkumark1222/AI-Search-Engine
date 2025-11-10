# How to Run the Application

## Complete Setup and Run Instructions

### Prerequisites

Before starting, ensure you have:
- **Python 3.8+** installed
- **Node.js 16+** and **npm** installed
- Both terminals/command prompts ready (one for backend, one for frontend)

---

## Step 1: Install Dependencies

### Backend Dependencies

1. Open a terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Install Python packages:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Dependencies

1. Open a **NEW** terminal/command prompt
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install npm packages:
   ```bash
   npm install
   ```

---

## Step 2: Initialize Database

In the backend terminal:

```bash
cd backend
python init_db.py
```

This will:
- Create the database file (`data_analyzer.db`)
- Create a default admin user:
  - **Email:** `admin@example.com`
  - **Password:** `admin`

---

## Step 3: Start the Servers

### Option A: Using Batch Files (Windows)

**Easiest Method - Run both servers:**
1. Double-click `START_ALL.bat`
   - This starts both backend and frontend in separate windows

**Or start separately:**
1. Double-click `START_BACKEND.bat` (starts backend)
2. Double-click `START_FRONTEND.bat` (starts frontend)

### Option B: Manual Start

**Start Backend:**
```bash
cd backend
python run.py
```
Or:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

---

## Step 4: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:5173**
   - The frontend will display the login page

---

## Step 5: Login or Register

### Option 1: Use Default Admin Account
- **Email:** `admin@example.com`
- **Password:** `admin`

### Option 2: Register New Account
1. Click "Don't have an account? Register"
2. Enter your email and password (minimum 6 characters)
3. Click "Register"
4. After registration, you'll be prompted to login

---

## Step 6: Add Data Connections

1. After logging in, click **"Connections"** in the sidebar
2. Fill in the connection details:

   **For CSV Files:**
   - Connection Name: e.g., "Sales Data"
   - Type: CSV File
   - File Path: `C:/path/to/your/file.csv` (use forward slashes or double backslashes)

   **For Excel Files:**
   - Connection Name: e.g., "Customer Data"
   - Type: Excel File
   - File Path: `C:/path/to/your/file.xlsx`
   - Sheet Name: (optional) e.g., "Sheet1"

   **For Databases (PostgreSQL/MySQL):**
   - Connection Name: e.g., "Production DB"
   - Type: PostgreSQL or MySQL
   - Host: e.g., `localhost`
   - Port: e.g., `5432` (PostgreSQL) or `3306` (MySQL)
   - Database Name: Your database name
   - Username: Your database username
   - Password: Your database password

   **For MongoDB:**
   - Connection Name: e.g., "MongoDB Data"
   - Type: MongoDB
   - Host: e.g., `localhost`
   - Port: e.g., `27017`
   - Database Name: Your database name
   - Collection Name: Your collection name
   - Username/Password: (optional)

3. Click **"Add Connection"**

---

## Step 7: Query Your Data

1. Click **"Query Chat"** in the sidebar
2. Enter your question in natural language, for example:
   - `Show top 5 students by marks`
   - `Average sales by region`
   - `Count total orders`
   - `Find highest revenue by product`
   - `Group by category and show average price`
3. Click **"Search"** or press **Ctrl+Enter**
4. View the results in the table below
5. Use suggested actions if available

---

## Troubleshooting

### Backend Issues

**Port access error (WinError 10013):**
```bash
# The backend now uses port 8001 by default to avoid Windows port access issues
# If you need a different port, change it in backend/run.py
```

**Database errors:**
```bash
# Delete database and reinitialize:
cd backend
del data_analyzer.db  # Windows
# or
rm data_analyzer.db   # Linux/Mac
python init_db.py
```

**Module not found errors:**
```bash
pip install -r requirements.txt
```

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically use the next available port
- Check the terminal output for the actual port

**Connection refused:**
- Ensure backend is running on port 8001
- Check browser console (F12) for errors
- Verify CORS settings in `backend/main.py`
- Verify API URL in `frontend/src/services/api.js` is set to http://127.0.0.1:8001

**Cannot login:**
- Register a new account
- Or use default: `admin@example.com` / `admin`

### General Issues

**Servers not starting:**
- Check that Python and Node.js are installed
- Verify you're in the correct directories
- Check for error messages in the terminal

---

## API Documentation

While the backend is running, access:
- **Swagger UI:** http://127.0.0.1:8001/docs
- **ReDoc:** http://127.0.0.1:8001/redoc

This provides interactive API documentation where you can test endpoints.

---

## Quick Reference

### Backend URLs
- API Server: http://127.0.0.1:8001
- API Docs: http://127.0.0.1:8001/docs
- Health Check: http://127.0.0.1:8001/health

### Frontend URLs
- Application: http://localhost:5173 (or port shown in terminal)

### Default Credentials
- Email: `admin@example.com`
- Password: `admin`

---

## Next Steps

1. ✅ Application is running
2. ✅ You've logged in
3. ✅ Add your data connections
4. ✅ Start querying your data with natural language!

Enjoy using the Data Visualizer & Analyzer Tool! 🚀

