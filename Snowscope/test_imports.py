"""Test if all imports work before starting server"""
import sys

print("Testing imports...")
try:
    from flask import Flask
    print("✓ Flask")
except Exception as e:
    print(f"✗ Flask: {e}")
    sys.exit(1)

try:
    from data_parameters import WeatherData, SnowData, SkiingConditionData, RatingWeights, RatingParameters
    print("✓ data_parameters")
except Exception as e:
    print(f"✗ data_parameters: {e}")
    sys.exit(1)

try:
    from rating_model import SkiingConditionRatingModel
    print("✓ rating_model")
except Exception as e:
    print(f"✗ rating_model: {e}")
    sys.exit(1)

print("\n✓ All imports successful! Server should start.")
print("\nNow try starting the server...")

