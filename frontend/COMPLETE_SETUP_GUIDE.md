# Complete Setup and Run Guide

## 🎯 Quick Start (5 Minutes)

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python init_db.py
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Access Application

Open browser: **http://localhost:5173**

Login with:
- Email: `admin@example.com`
- Password: `admin`

---

## 📋 Detailed Instructions

### Prerequisites Check

```bash
# Check Python version (need 3.8+)
python --version

# Check Node.js version (need 16+)
node --version

# Check npm
npm --version
```

### Step-by-Step Setup

#### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database:**
   ```bash
   python init_db.py
   ```
   Expected output:
   ```
   Initializing database...
   [OK] Database initialized
   [OK] Default admin user created:
     Email: admin@example.com
     Password: admin
   ```

5. **Start backend server:**
   ```bash
   python run.py
   ```
   Or:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   ✅ Backend running on: http://127.0.0.1:8000

#### Frontend Setup

1. **Navigate to frontend (new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start frontend server:**
   ```bash
   npm run dev
   ```

   ✅ Frontend running on: http://localhost:5173

---

## 🚀 Using the Application

### Step 1: Login/Register

1. Open http://localhost:5173
2. **Register new account:**
   - Click "Don't have an account? Register"
   - Enter email and password (min 6 chars)
   - Click "Register"
   - Login with your credentials

   **OR use default admin:**
   - Email: `admin@example.com`
   - Password: `admin`

### Step 2: Add Data Connection

1. Click **"Connections"** in sidebar
2. Fill connection details:

   **CSV File Example:**
   ```
   Connection Name: Sales Data
   Type: CSV File
   File Path: C:/Users/YourName/Documents/sales.csv
   ```

   **Excel File Example:**
   ```
   Connection Name: Customer Data
   Type: Excel File
   File Path: C:/Users/YourName/Documents/customers.xlsx
   Sheet Name: Sheet1 (optional)
   ```

   **PostgreSQL Example:**
   ```
   Connection Name: Production DB
   Type: PostgreSQL Database
   Host: localhost
   Port: 5432
   Database Name: mydatabase
   Username: myuser
   Password: mypassword
   ```

3. Click **"Add Connection"**

### Step 3: Query Your Data

1. Click **"Query Chat"** in sidebar
2. Enter natural language query:
   ```
   Show top 5 students by marks
   ```
3. Click **"Search"**
4. View results in table format
5. See suggested actions below results

---

## 📝 Example Queries

Try these natural language queries:

- `Show top 10 students by marks`
- `Average sales by region`
- `Count total orders`
- `Find maximum revenue`
- `Group by category and show average price`
- `Show all products with price greater than 100`
- `What is the total sales for this month?`
- `List customers sorted by registration date`

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error: Port 8000 already in use**
```bash
# Use different port
uvicorn main:app --port 8001
# Then update frontend/src/services/api.js baseURL to http://127.0.0.1:8001
```

**Error: Module not found**
```bash
pip install -r requirements.txt
```

**Error: Database locked**
```bash
# Close any programs using the database
# Or delete and reinitialize
del data_analyzer.db  # Windows
python init_db.py
```

### Frontend Won't Start

**Error: Port 5173 already in use**
- Vite will automatically use next available port
- Check terminal for actual port number

**Error: Cannot find module**
```bash
npm install
```

**Error: Connection refused**
- Ensure backend is running
- Check backend URL in `frontend/src/services/api.js`
- Verify backend is accessible at http://127.0.0.1:8000

### Login Issues

**Cannot login:**
- Register a new account
- Use default: admin@example.com / admin
- Check browser console for errors (F12)

**Registration fails:**
- Ensure backend is running
- Check password is at least 6 characters
- Verify email format is correct

### Query Issues

**No results returned:**
- Check that you have added a data connection
- Verify file path is correct (for CSV/Excel)
- Ensure database connection details are correct
- Check backend logs for errors

**Query fails:**
- Try simpler queries first
- Check data source connection
- Verify data exists in the source
- Check backend terminal for error messages

---

## 📂 File Paths for CSV/Excel

### Windows
```
C:/Users/YourName/Documents/data.csv
C:\Users\YourName\Documents\data.csv
```

### Linux/Mac
```
/home/username/documents/data.csv
/Users/username/documents/data.csv
```

**Important:** Use forward slashes (/) or escape backslashes (\\) in Windows paths.

---

## 🔐 Security Notes

1. **Default Password:** Change the admin password in production
2. **Database Credentials:** Never commit database passwords to version control
3. **API Keys:** Store sensitive keys in `.env` file (not committed)
4. **CORS:** Configure CORS properly for production deployment

---

## 🎓 Next Steps

1. ✅ Application is running
2. ✅ You're logged in
3. ✅ Add your data connections
4. ✅ Start querying!

### Advanced Features (Future)

- Data visualization charts
- Export results to CSV/Excel
- Save queries for later
- Share queries with team
- Advanced NLP with LLM integration

---

## 📞 Support

- **API Documentation:** http://127.0.0.1:8000/docs
- **Backend Health:** http://127.0.0.1:8000/health
- **Check logs:** Backend terminal for server logs

---

## ✅ Verification Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can register/login
- [ ] Can add data connection
- [ ] Can execute queries
- [ ] Results display correctly

---

**Congratulations! Your Data Visualizer & Analyzer Tool is ready to use! 🎉**

