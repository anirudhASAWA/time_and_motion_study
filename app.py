from flask import Flask, request, jsonify, make_response
import os
import csv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Filepath for the CSV file
CSV_FILE = "TimeAndMotionStudy.csv"

@app.route('/save-all', methods=['POST'])
def save_all_to_csv():
    data = request.json  # List of tasks

    # Write data to the CSV file
    with open(CSV_FILE, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        # Write headers
        csvwriter.writerow(["TaskName", "Duration", "Observations"])
        # Write rows
        for task in data:
            csvwriter.writerow([
                task.get("TaskName", ""),
                task.get("Duration", ""),
                task.get("Observations", "")
            ])

    return jsonify({"message": "Tasks saved to CSV!"}), 200

@app.route('/download-csv', methods=['GET'])
def download_csv():
    # Serve the CSV file for download
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'r') as file:
            csv_content = file.read()

        response = make_response(csv_content)
        response.headers["Content-Disposition"] = "attachment; filename=TimeAndMotionStudy.csv"
        response.headers["Content-Type"] = "text/csv"
        return response
    else:
        return jsonify({"message": "No CSV file found!"}), 404

if __name__ == '__main__':
    app.run(debug=True)
