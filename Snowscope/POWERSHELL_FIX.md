# PowerShell Fix - Use These Commands

Since you're in PowerShell and `python` command isn't recognized, use these:

## Quick Solution: Run the PowerShell Script

In PowerShell, navigate to the folder and run:
```powershell
cd "C:\Users\Krista\OneDrive\Snowscope"
.\start_server.ps1
```

**If you get an execution policy error**, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run `.\start_server.ps1` again.

---

## Alternative: Use Full Path Directly

In PowerShell, you can use the full Python path:

```powershell
cd "C:\Users\Krista\OneDrive\Snowscope"

# Install Flask
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" -m pip install Flask

# Start server
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" app.py
```

The `&` is PowerShell's call operator to run executables with spaces in the path.

---

## Create an Alias (Optional)

To make `python` work in PowerShell, add this to your PowerShell profile:

```powershell
# Open your profile
notepad $PROFILE

# Add this line:
Set-Alias python "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe"
```

Then restart PowerShell and `python` will work!

---

## Easiest: Just Double-Click the Batch File

Even from PowerShell, you can run:
```powershell
.\START_SERVER_FIXED.bat
```

This will work regardless of PowerShell or Command Prompt!

