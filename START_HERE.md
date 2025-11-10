# 🚀 Quick Start Guide - Data Visualizer & Analyzer Tool

## ✅ Prerequisites Check

Before starting, make sure you have:
- ✅ Python 3.8+ installed
- ✅ Node.js 16+ and npm installed
- ✅ Database initialized (run `python backend/init_db.py` if not done)

---

## 🎯 EASIEST WAY TO START (Recommended)

### Option 1: Use the Batch File (Windows)

1. **Double-click `QUICK_START.bat`** in the root folder (`D:\Final Out\`)
   - This will automatically start BOTH backend and frontend servers
   - Two new windows will open (one for each server)

2. **Wait for both servers to start:**
   - Backend window will show: `API will be available at: http://127.0.0.1:8888`
   - Frontend window will show: `Local: http://localhost:5173`

3. **Open your browser** and go to: `http://localhost:5173`

4. **Login with:**
   - Email: `admin@example.com`
   - Password: `admin`

### Option 2: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd "D:\Final Out\backend"
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd "D:\Final Out\frontend"
npm run dev
```

---

## 📍 Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://127.0.0.1:8888
- **API Documentation:** http://127.0.0.1:8888/docs

---

## ⚠️ Troubleshooting

### Backend won't start?

**Error: WinError 10013 (Port access denied)**
- Port 8888 might be in use
- Solution: Close other applications using port 8888, or run PowerShell as Administrator

**Error: Module not found**
- Solution: Run `pip install -r backend/requirements.txt`

**Database errors**
- Solution: Delete `backend/data_analyzer.db` and run `python backend/init_db.py` again

### Frontend shows "Backend Connection Error"?

1. **Make sure backend is running:**
   - Check if you see a terminal window with "Uvicorn running on http://127.0.0.1:8888"
   - If not, start the backend using `QUICK_START.bat` or manually

2. **Check the backend port:**
   - Backend should be on port 8888
   - If different, update `frontend/src/services/api.js` line 4 to match

3. **Refresh the browser** after starting the backend

### Can't login?

- Make sure you've run `python backend/init_db.py` first
- Use the default credentials:
  - Email: `admin@example.com`
  - Password: `admin`
- Or register a new account

---

## 🔧 Manual Configuration

### Change Backend Port

Edit `backend/run.py` and change:
```python
port = 8888  # Change this number
```

Then update `frontend/src/services/api.js` line 4 to match:
```javascript
baseURL: "http://127.0.0.1:8888",  // Match the port number
```

### Change Frontend Port

Edit `frontend/vite.config.js` and change:
```javascript
server: {
  port: 5173,  // Change this number
}
```

---

## 📝 Next Steps After Starting

1. ✅ Login to the application
2. ✅ Go to "Connections" to add your data sources
3. ✅ Go to "Query Chat" to start querying your data

---

## 💡 Tips

- **Keep both server windows open** while using the application
- **Don't close the terminal windows** - closing them stops the servers
- **Use CTRL+C** in the terminal to stop a server when needed

---

## 🆘 Still Having Issues?

1. Check that Python and Node.js are in your PATH
2. Verify all dependencies are installed:
   - Backend: `pip install -r backend/requirements.txt`
   - Frontend: `npm install` (in frontend folder)
3. Make sure no firewall is blocking ports 8888 or 5173
4. Try running terminals as Administrator

