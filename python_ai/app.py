from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js connection

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), 'crop_model.joblib')
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None
    print("Warning: Model file not found. Please run model.py first.")

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json
        
        # Extract features in correct order
        features = [
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        
        # Convert to numpy array and reshape for prediction
        features_array = np.array([features])
        
        # Get probability estimates for each class
        probabilities = model.predict_proba(features_array)[0]
        
        # Get class names
        classes = model.classes_
        
        # Get top 3 indices
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        
        # Prepare response
        recommendations = []
        for idx in top_3_indices:
            recommendations.append({
                "crop": classes[idx],
                "confidence": round(float(probabilities[idx]) * 100, 2)
            })
        
        return jsonify({
            "success": True,
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "Python AI Server is running", "model_loaded": model is not None})

if __name__ == '__main__':
    # Run on port 5000 by default
    app.run(host='0.0.0.0', port=5000, debug=True)
