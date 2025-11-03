# Troubleshooting: Site Can't Be Reached

Follow these steps to diagnose the issue:

## Step 1: Check if the server is actually running

When you run `python app.py`, you should see output like:
```
============================================================
Snowscope Skiing Condition Rating Server
============================================================

Starting Flask server...
Server will be available at:
  - http://localhost:5000
  - http://127.0.0.1:5000

Press CTRL+C to stop the server
============================================================

 * Running on http://127.0.0.1:5000
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

**If you DON'T see "Running on http://..." the server didn't start!**

## Step 2: Common Issues

### Issue A: Import Errors
If you see errors like:
- `ModuleNotFoundError: No module named 'flask'`
- `ImportError: cannot import name 'WeatherData'`

**Solution:** The script has import errors. Check the terminal output for the exact error.

### Issue B: Port Already in Use
If you see:
- `OSError: [WinError 10048] Address already in use`

**Solution:** Another program is using port 5000.
1. Close any other Python scripts
2. Or change the port in `app.py` from `5000` to `5001`

### Issue C: No Output at All
If nothing happens when you run `python app.py`:

**Solution:** 
1. Make sure you're in the right folder: `cd "C:\Users\Krista\OneDrive\Snowscope"`
2. Check Python is working: `python --version`
3. Check Flask is installed: `python -m pip list | findstr Flask`

## Step 3: Test if Server Started

After running `python app.py`, you should see the "Running on..." message. If you do:

1. **Wait 5-10 seconds** - sometimes Flask takes a moment to fully start
2. Try these URLs in your browser (one at a time):
   - http://localhost:5000
   - http://127.0.0.1:5000
   - http://0.0.0.0:5000

3. **Check the terminal** - when you try to access the site, you should see log messages like:
   ```
   127.0.0.1 - - [DATE] "GET / HTTP/1.1" 200 -
   ```

## Step 4: Quick Test Script

Run this to test if everything works:
```bash
python test_server.py
```

This will:
- Check all imports work
- Try to start a simple server
- Show any errors clearly

## Step 5: Manual Check

1. Open Task Manager (Ctrl+Shift+Esc)
2. Look for `python.exe` processes
3. If you see multiple, they might be conflicting
4. End any old Python processes and try again

## Still Not Working?

Share the EXACT output you see when you run `python app.py` and I can help fix it!

