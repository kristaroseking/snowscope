# 🎿 Snowscope Stowe App - Ready!

## What's New

✅ **Automatic Stowe Data** - No more manual inputs!  
✅ **Surfline-Inspired Design** - Modern, clean, visual  
✅ **Time-Based Ratings** - Morning/Midday/Night (3 segments)  
✅ **Color-Coded Ratings** - All 7 rating levels with colors  
✅ **No Visibility Input** - Removed from form  

## Features

1. **Current Conditions Card**
   - Large rating circle (color-coded)
   - Rating value and points (0-100)
   - 3 time segments showing Morning/Midday/Night ratings
   - Stats grid: New Snow, Base Depth, Temperature, Wind, Quality

2. **10-Day Forecast**
   - Sliding cards for each day
   - Color-coded by rating
   - Key stats for each day

3. **Auto-Refresh**
   - Updates every 30 minutes
   - Shows latest Stowe conditions

## Rating Colors

- **BLOWER** (90-100): Pink 🟣
- **PERFECT** (80-90): Purple 🟣
- **EXCELLENT** (60-80): Dark Green 🟢
- **GOOD** (40-60): Green 🟢
- **FAIR** (20-40): Light Green 🟢
- **POOR** (10-20): Dark Orange 🟠
- **BAD** (0-10): Red 🔴

## To Run

1. **Start the server:**
   ```bash
   START_SERVER_NOW.bat
   ```

2. **Open browser:**
   http://localhost:5000

The app automatically loads Stowe conditions!

## Current Data Source

Right now it uses simulated Stowe conditions. To add real scraping:
- Update `stowe_scraper.py` with actual Stowe website parsing
- Or integrate with Stowe's API if available

## Design Inspiration

Inspired by Surfline's clean, modern surf forecasting interface, adapted for skiing conditions!

