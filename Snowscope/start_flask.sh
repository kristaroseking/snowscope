#!/bin/bash
# Start Flask API server for Snowscope scoring

echo "Starting Flask API server..."
echo "Installing dependencies..."
pip3 install -r requirements.txt

echo "Starting server on http://localhost:5000"
python3 app.py
