# Test the Application in Your Browser

## Step 1: Make Sure Server is Running

If you don't see the server running in your terminal, start it:

### In PowerShell:
```powershell
cd "C:\Users\Krista\OneDrive\Snowscope"
& "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" app.py
```

### Or Double-Click:
`START_SERVER_FIXED.bat`

You should see:
```
Running on http://127.0.0.1:5000
Running on http://0.0.0.0:5000
```

## Step 2: Open Your Browser

Once you see "Running on..." messages, open any web browser:

- **Chrome**
- **Edge** 
- **Firefox**
- Any browser works!

## Step 3: Go to These URLs

Try these in your browser's address bar:

**Option 1:**
```
http://localhost:5000
```

**Option 2:**
```
http://127.0.0.1:5000
```

## Step 4: What You Should See

When it works, you'll see:

1. **Header**: "Snowscope - Skiing Condition Rating System"
2. **Scenario Buttons**: 
   - Average Winter Conditions
   - Excellent Powder Day  
   - Poor Conditions
   - BLOWER Conditions
3. **Rating Card** (Pink/Blower):
   - Snowflake icon ❄️
   - Rating: BLOWER
   - Points: ~90-100/100
   - Time bar: Morning/Noon/Night
4. **Calculation Breakdown**: Shows how points are calculated
5. **10-Day Forecast Slider**: Scrollable cards showing day-by-day conditions

## Troubleshooting

### "This site can't be reached"
- Make sure the server is running (see Step 1)
- Wait 5-10 seconds after starting the server
- Try `http://127.0.0.1:5000` instead of `localhost`

### Page loads but shows errors
- Check the terminal window for error messages
- Make sure all files are in the same folder

### Nothing happens
- Look at your terminal - there should be log messages when you access the page
- Try refreshing the browser (F5)

## Test Different Scenarios

Click the scenario buttons to see different ratings:
- **BLOWER** = Pink card (90-100 points)
- **PERFECT** = Purple card (80-90 points)
- **EXCELLENT** = Dark green card (60-80 points)
- **GOOD** = Green card (40-60 points)
- **FAIR** = Light green card (20-40 points)
- **POOR** = Dark orange card (10-20 points)
- **BAD** = Red card (0-10 points)

## Try the Form

You can also:
1. Change values in the form (temperature, wind, snow, etc.)
2. Click "Calculate Rating"
3. See how different conditions affect the rating!

