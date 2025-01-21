from flask import Flask, request, jsonify
import json
import os

from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Filepath to the JSON file
JSON_FILE = "TimeAndMotionStudy.json"

@app.route('/save-all', methods=['POST'])
def save_all_to_json():
    data = request.json  # List of tasks

    # If the file doesn't exist, create it
    if not os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'w') as file:
            json.dump([], file)

    # Read existing data
    with open(JSON_FILE, 'r') as file:
        existing_data = json.load(file)

    # Append new data to existing data
    existing_data.extend(data)

    # Write updated data back to the file
    with open(JSON_FILE, 'w') as file:
        json.dump(existing_data, file, indent=4)

    return jsonify({"message": "All tasks saved successfully to JSON!"}), 200

if __name__ == '__main__':
    app.run(debug=True)