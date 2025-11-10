# Quick Start Guide

## 🚀 Running the Application

### Step 1: Setup Backend

Open a terminal in the `backend` directory:

```bash
cd backend
pip install -r requirements.txt
python init_db.py
python run.py
```

The backend will start on **http://127.0.0.1:8000**

### Step 2: Setup Frontend

Open a **NEW** terminal in the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**

### Step 3: Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. Register a new account or login with:
   - Email: `admin@example.com`
   - Password: `admin`

### Step 4: Add Data Connections

1. Go to **Connections** page
2. Add a connection (CSV, Excel, Database, etc.)
3. For CSV/Excel, provide the full file path
4. For databases, provide connection details

### Step 5: Query Your Data

1. Go to **Query** page
2. Type natural language queries like:
   - "Show top 5 students by marks"
   - "Average sales by region"
   - "Count total orders"
3. Click "Search" to see results

## 📝 Notes

- Make sure both backend and frontend are running simultaneously
- Backend API docs: http://127.0.0.1:8000/docs
- If you see connection errors, check that the backend is running on port 8000

## 🔧 Troubleshooting

**Backend not starting?**
- Check if port 8000 is available
- Run `python init_db.py` to initialize database

**Frontend connection errors?**
- Ensure backend is running
- Check browser console for errors

**Can't login?**
- Register a new account through the frontend
- Or use: admin@example.com / admin

