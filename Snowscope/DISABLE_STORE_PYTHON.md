# Fix Windows Store Python Alias - 2 Minutes!

## The Problem
Windows Store is intercepting the `python` command. Even though you have Python installed, Windows redirects to the Store.

## The Fix (Choose One)

### Method 1: Disable Store Alias (Recommended - Permanent Fix)

1. **Open Windows Settings**
   - Press `Win + I` 
   - Or click Start → Settings

2. **Go to App Execution Aliases**
   - Click **Apps** (left sidebar)
   - Scroll down and click **App execution aliases**
   - Or search for "app execution aliases" in Settings search

3. **Disable Python Aliases**
   - Find `python.exe` 
   - Toggle it **OFF** (gray/disabled)
   - Find `python3.exe`
   - Toggle it **OFF** (gray/disabled)

4. **Restart Your Terminal**
   - Close ALL Command Prompt/PowerShell windows
   - Open a NEW one

5. **Test It**
   ```bash
   python --version
   ```
   Should show: `Python 3.14.0` ✅

6. **Start Server**
   ```bash
   cd "C:\Users\Krista\OneDrive\Snowscope"
   python app.py
   ```

### Method 2: Use the Fixed Batch File (Temporary Workaround)

Just double-click: **`START_SERVER_FIXED.bat`**

This uses the full Python path, bypassing the Store alias entirely.

---

## After Fixing

Once `python` command works, you can use:
- `python app.py` - to start the server
- `python -m pip install Flask` - to install packages
- All normal Python commands will work!

Then open: **http://localhost:5000**

