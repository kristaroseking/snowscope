# Troubleshooting: Localhost Not Working

## Quick Fix Steps

### 1. Use the Debug Startup Script

Double-click: **`START_SERVER_DEBUG.bat`**

This will:
- Check Python is installed
- Check Flask is installed  
- Check all imports work
- Check template file exists
- Show detailed error messages

### 2. Check What's Actually Happening

When you run the server, look for these messages:

**✅ GOOD - Server is running:**
```
Running on http://127.0.0.1:5000
 * Debug mode: on
```

**❌ BAD - Server didn't start:**
- No "Running on..." message
- Error messages
- Script exits immediately

### 3. Common Issues & Fixes

#### Issue: "Port 5000 already in use"

**Fix:**
```powershell
# Find what's using port 5000
netstat -ano | findstr ":5000"

# Kill Python processes
taskkill /F /IM python.exe
```

Then try starting the server again.

#### Issue: "ModuleNotFoundError"

**Fix:**
```bash
C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe -m pip install Flask requests beautifulsoup4 lxml
```

#### Issue: "Template not found"

**Fix:**
- Make sure `templates/stowe_app.html` exists
- Check you're in the right folder: `C:\Users\Krista\OneDrive\Snowscope`

#### Issue: Browser shows "This site can't be reached"

**Check:**
1. Is the server actually running? Look for "Running on..." message
2. Wait 5-10 seconds after seeing "Running on..."
3. Try `http://127.0.0.1:5000` instead of `localhost:5000`
4. Check Windows Firewall isn't blocking

### 4. Test Step by Step

**Step 1:** Test simple server
```bash
python test_server_simple.py
```
If this works, Flask is fine. If not, Flask issue.

**Step 2:** Test app imports
```bash
python -c "import app; print('OK')"
```
If this fails, there's an import error.

**Step 3:** Check template
```bash
dir templates\stowe_app.html
```
Should show the file exists.

### 5. Manual Server Start (PowerShell)

```powershell
cd "C:\Users\Krista\OneDrive\Snowscope"

# Check Python
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" --version

# Install dependencies
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" -m pip install Flask requests beautifulsoup4 lxml

# Start server
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" app.py
```

### 6. What Should Happen

When it works:
1. Terminal shows: `Running on http://127.0.0.1:5000`
2. Browser shows: The Stowe conditions page with ratings
3. No errors in terminal

### 7. Still Not Working?

Share the EXACT output from the terminal when you run `START_SERVER_DEBUG.bat` and I can help fix the specific issue!

