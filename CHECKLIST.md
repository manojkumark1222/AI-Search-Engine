# ✅ Startup Checklist

Follow these steps in order:

## Step 1: Initialize Database (One-time setup)
- [ ] Open terminal/PowerShell
- [ ] Run: `cd "D:\Final Out\backend"`
- [ ] Run: `python init_db.py`
- [ ] Should see: `[OK] Database initialized` and `[OK] Default admin user created`

## Step 2: Start Backend Server
- [ ] **Option A:** Double-click `QUICK_START.bat` in root folder
- [ ] **Option B:** Double-click `frontend/START_BACKEND.bat`
- [ ] **Option C:** Manual: Open new terminal, run:
  ```bash
  cd "D:\Final Out\backend"
  python run.py
  ```
- [ ] Verify you see: `INFO: Uvicorn running on http://127.0.0.1:8888`
- [ ] **Keep this window open!**

## Step 3: Start Frontend Server (if not using QUICK_START.bat)
- [ ] Open a NEW terminal/PowerShell window
- [ ] Run:
  ```bash
  cd "D:\Final Out\frontend"
  npm run dev
  ```
- [ ] Verify you see: `Local: http://localhost:5173`
- [ ] **Keep this window open!**

## Step 4: Access Application
- [ ] Open browser: http://localhost:5173
- [ ] Login with:
  - Email: `admin@example.com`
  - Password: `admin`

## ✅ Success Indicators

- Backend terminal shows: `Uvicorn running on http://127.0.0.1:8888`
- Frontend terminal shows: `Local: http://localhost:5173`
- Browser loads login page without errors
- Can successfully login

## ❌ Common Issues

**"Backend Connection Error" in browser:**
- ✅ Backend is NOT running - Go to Step 2

**Backend shows "WinError 10013":**
- ✅ Port 8888 is blocked - Try running terminal as Administrator

**"Module not found" errors:**
- ✅ Dependencies not installed - Run `pip install -r backend/requirements.txt`

**Frontend won't start:**
- ✅ Node modules not installed - Run `npm install` in frontend folder

