import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import requests
import io
import os

def train_model():
    print("Downloading dataset...")
    url = "https://raw.githubusercontent.com/PAIshanMadusha/crop-recommendation-model/main/dataset/Crop_recommendation.csv"
    response = requests.get(url)
    
    if response.status_code != 200:
        print("Failed to download dataset. Using synthetic local data as fallback...")
        # Fallback synthetic data logic could go here if needed
        return

    data = pd.read_csv(io.StringIO(response.text))
    
    # Save the dataset locally for future reference
    data.to_csv('crop_recommendation.csv', index=False)
    print("Dataset saved locally.")

    # Features and Target
    X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = data['label']

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest Classifier
    print("Training model (Random Forest)...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    # Save the model
    joblib.dump(model, 'crop_model.joblib')
    print("Model saved as 'crop_model.joblib'")

if __name__ == "__main__":
    train_model()
