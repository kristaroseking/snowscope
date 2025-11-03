# How to Start the Server

Since Python might need to be accessed differently, here are the steps:

## Step 1: Find Your Python Installation

Open a NEW Command Prompt or PowerShell window (not the one you're using now) and try these commands one by one:

```bash
python --version
```

If that doesn't work, try:
```bash
python3 --version
```

If that doesn't work, try:
```bash
where python
```

## Step 2: Navigate to the Project Folder

In your Command Prompt/PowerShell, run:
```bash
cd "C:\Users\Krista\OneDrive\Snowscope"
```

## Step 3: Install Flask

Once you're in the folder, install Flask:
```bash
python -m pip install Flask
```

Or if you need to use python3:
```bash
python3 -m pip install Flask
```

## Step 4: Start the Server

Run:
```bash
python app.py
```

Or:
```bash
python3 app.py
```

## Step 5: Open Browser

Once you see:
```
Running on http://127.0.0.1:5000
```

Open your browser and go to:
**http://localhost:5000**

---

## Alternative: Use Python IDLE

If command line doesn't work:

1. Find Python in your Start menu
2. Open "IDLE" or "Python 3.x"
3. Go to File → Open → Navigate to `app.py`
4. Click Run → Run Module (or press F5)

Then open http://localhost:5000 in your browser.

