from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/health')
def health():
    return jsonify({'status': 'VM Algo Pro Running', 'engine': 'active'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
