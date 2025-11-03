# IMMEDIATE FIX - Follow These Steps

## The Problem
Windows Store is blocking the `python` command. We need to either:
1. Use the full Python path, OR
2. Disable the Store alias

## Solution A: Disable Windows Store Python Alias (Recommended)

1. Press **Windows + I** to open Settings
2. Go to **Apps** → **App execution aliases** (or search for "app execution")
3. Find these and turn them **OFF** (toggle to disabled):
   - `python.exe`
   - `python3.exe`
4. **Close and reopen** your Command Prompt/PowerShell
5. Try `python --version` - it should work now!

## Solution B: Find Your Real Python

Run `test_python_paths.bat` to find where Python is installed.

Then use that full path in commands like:
```
"C:\Path\To\Python\python.exe" app.py
```

## Solution C: Install Python Properly (If Missing)

If Python isn't actually installed:

1. Download from: https://www.python.org/downloads/
2. **CRITICAL:** Check "Add Python to PATH" during installation
3. Choose "Install for all users" if possible
4. Complete installation
5. Restart your computer
6. Try `python --version`

## Quick Test After Fix

After doing Solution A, test:
```
python --version
```

If you see a version number (like `Python 3.14.0`), then run:
```
python app.py
```

Then open: http://localhost:5000

