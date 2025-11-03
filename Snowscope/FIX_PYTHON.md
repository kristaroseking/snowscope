# Fix: "Python was not found" Error

This happens because Windows has a Store app alias that redirects to the Microsoft Store. Here's how to fix it:

## Solution 1: Disable the Store App Alias (Recommended)

1. Open **Settings** (Windows + I)
2. Go to **Apps** → **App execution aliases**
3. Find **python.exe** and **python3.exe**
4. **Turn them OFF** (toggle to disabled)
5. Restart your terminal/command prompt

Then try `python` again.

## Solution 2: Use Full Path to Python

First, find where Python is installed:

### Option A: Run the finder script
Double-click `find_python.bat` - it will search for Python installations

### Option B: Manual search
Python is usually in one of these locations:
- `C:\Python39\python.exe` (or Python38, Python310, etc.)
- `C:\Program Files\Python39\python.exe`
- `C:\Users\[YourName]\AppData\Local\Programs\Python\Python39\python.exe`
- `%LOCALAPPDATA%\Programs\Python\Python39\python.exe`

### Option C: Check Start Menu
1. Open Start Menu
2. Search for "Python"
3. Right-click on "Python 3.x"
4. Choose "Open file location"
5. This will show you where Python is installed

Once you find it, use the full path:
```bash
"C:\Path\To\Python\python.exe" app.py
```

## Solution 3: Add Python to PATH

If you found Python but `python` command doesn't work:

1. Find where Python is installed (see Solution 2)
2. Copy the folder path (e.g., `C:\Python39` or `C:\Python39\Scripts`)
3. Open **System Properties**:
   - Press `Win + R`
   - Type `sysdm.cpl` and press Enter
   - Go to **Advanced** tab
   - Click **Environment Variables**
4. Under **System Variables**, find **Path** and click **Edit**
5. Click **New** and add your Python folder path
6. Click **OK** on all dialogs
7. **Restart your terminal**

## Solution 4: Use Python Launcher (py)

If you installed Python from python.org, try:
```bash
py app.py
```

## Solution 5: Reinstall Python Properly

If nothing works:

1. Download Python from https://www.python.org/downloads/
2. **IMPORTANT:** During installation, check **"Add Python to PATH"**
3. Choose "Install for all users" if you have admin rights
4. Complete installation
5. Restart your computer
6. Try `python` again

## Quick Test

After trying any solution, test if Python works:
```bash
python --version
```

You should see something like: `Python 3.11.5`

If that works, then try:
```bash
python app.py
```

## Still Stuck?

Run `find_python.bat` and share the output - it will show where Python is installed on your system!

