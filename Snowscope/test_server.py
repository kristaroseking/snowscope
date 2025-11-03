"""
Quick test to see if Flask can start and what errors occur
"""
import sys

print("Testing imports...")
try:
    from flask import Flask
    print("✓ Flask imported successfully")
except ImportError as e:
    print(f"✗ Flask import failed: {e}")
    print("Please run: pip install Flask")
    sys.exit(1)

try:
    from data_parameters import WeatherData, SnowData, SkiingConditionData, RatingWeights, RatingParameters
    print("✓ data_parameters imported successfully")
except ImportError as e:
    print(f"✗ data_parameters import failed: {e}")
    sys.exit(1)

try:
    from rating_model import SkiingConditionRatingModel
    print("✓ rating_model imported successfully")
except ImportError as e:
    print(f"✗ rating_model import failed: {e}")
    sys.exit(1)

print("\nAll imports successful!")
print("\nTrying to create Flask app...")

try:
    app = Flask(__name__)
    
    @app.route('/')
    def test():
        return "Server is working! Go to http://localhost:5000"
    
    print("✓ Flask app created successfully")
    print("\n" + "="*60)
    print("Starting server on http://localhost:5000")
    print("="*60)
    print("\nPress CTRL+C to stop the server")
    print("\nOpen your browser to: http://localhost:5000\n")
    
    app.run(debug=True, port=5000, host='127.0.0.1')
    
except Exception as e:
    print(f"✗ Error starting server: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

