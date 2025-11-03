# How to Start the Snowscope Web Application

## Step 1: Install Flask (if not already installed)

Open a terminal/command prompt and run:

```bash
pip install Flask
```

Or if you have Python 3:

```bash
pip3 install Flask
```

## Step 2: Start the Server

### Option A: Using the batch file (Windows)
Double-click `start_server.bat`

### Option B: Using command line
Open a terminal/command prompt, navigate to this folder, and run:

```bash
python app.py
```

Or if Python isn't recognized:

```bash
py app.py
```

Or if you have Python 3 specifically:

```bash
python3 app.py
```

## Step 3: Open in Browser

Once the server is running, you should see:

```
Starting Flask server...
Server will be available at: http://localhost:5000
```

Then open your web browser and go to:

**http://localhost:5000**

or

**http://127.0.0.1:5000**

## Troubleshooting

### "Python was not found"
- Make sure Python is installed
- Try using `py` instead of `python`
- Try using `python3` instead of `python`
- Check if Python is in your PATH

### "Flask module not found"
- Install Flask: `pip install Flask`
- Or: `pip3 install Flask`

### Port 5000 already in use
- Close any other applications using port 5000
- Or modify `app.py` to use a different port (change `port=5000` to `port=5001`)

### Server starts but browser shows "Connection refused"
- Make sure the server is actually running (check the terminal output)
- Try `http://127.0.0.1:5000` instead of `http://localhost:5000`
- Check Windows Firewall settings
- Make sure you're using the correct port number

## What You Should See

When it works, the web page will show:
- A "BLOWER" conditions rating (pink) with animated snow icon
- A color bar showing Morning/Noon/Night
- A 10-day forecast slider with day-by-day cards
- Detailed calculation breakdowns

The page automatically loads with BLOWER conditions data that should generate a 90-100 point rating!

