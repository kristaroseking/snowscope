# Quick Fix for Localhost Issue

## Try This Now

### Option 1: Use Debug Script (Recommended)

**Double-click:** `START_SERVER_DEBUG.bat`

This will show you exactly what's wrong.

---

### Option 2: Manual PowerShell Commands

Open PowerShell and run:

```powershell
cd "C:\Users\Krista\OneDrive\Snowscope"

# Install/update packages
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" -m pip install --upgrade Flask requests beautifulsoup4 lxml

# Start server
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" app.py
```

---

### What to Look For

**✅ Server is working when you see:**
```
Running on http://127.0.0.1:5000
```

**❌ Server NOT working if:**
- Script exits immediately
- No "Running on..." message
- Error messages appear

---

### Then Open Browser

**After** you see "Running on...", wait 5 seconds, then:

1. Open any browser
2. Go to: **http://localhost:5000**
3. OR: **http://127.0.0.1:5000**

---

### If Still Not Working

**Check for port conflict:**
```powershell
netstat -ano | findstr ":5000"
```

If something is using port 5000:
```powershell
taskkill /F /IM python.exe
```

Then try starting again.

---

**Run `START_SERVER_DEBUG.bat` and tell me what error messages you see!**

