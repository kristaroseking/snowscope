"""Simple test server to verify Flask works"""
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Server is Working!</h1><p>If you see this, Flask is running correctly.</p><p><a href="/test">Test Link</a></p>'

@app.route('/test')
def test():
    return '<h1>Test Page Works!</h1><p><a href="/">Back</a></p>'

if __name__ == '__main__':
    print("="*60)
    print("Simple Test Server")
    print("="*60)
    print("\nStarting on http://localhost:5000")
    print("Press CTRL+C to stop\n")
    app.run(debug=True, port=5000, host='0.0.0.0')

