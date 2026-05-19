# 🌱 Crop Recommendation Web App

A smart **Crop Recommendation System** built with **Next.js** that helps farmers and agriculture enthusiasts make better farming decisions using **soil analysis**, **weather insights**, and **AI-powered crop predictions**.

The platform provides personalized crop recommendations based on soil parameters and environmental conditions, along with historical predictions, weather updates, and an intelligent chatbot assistant.

---

## 🚀 Features

### 🌾 Crop Prediction
- Predict the most suitable crop based on:
  - Nitrogen (N)
  - Phosphorus (P)
  - Potassium (K)
  - Temperature
  - Humidity
  - pH value
  - Rainfall
- AI/ML-powered recommendation system.

### 🌤️ Weather Page
- Real-time weather information.
- Helps users understand climate conditions before crop planning.
- Displays weather data relevant to agriculture.

### 🤖 AI Chatbot
- Smart chatbot assistant for:
  - Farming-related queries
  - Crop suggestions
  - Agricultural guidance
  - Soil and farming tips

### 📊 Prediction History (Top Predicts)
- Stores user prediction history.
- Users can revisit previously predicted crops.
- Easy tracking of farming decisions.

### 🔐 Authentication
- Secure **Google Authentication** using **NextAuth.js**
- User login & session management.

### 🗄️ MongoDB Database
Stores:
- User profile details
- Soil details
- Prediction history
- Authentication data

---

## 🛠️ Tech Stack

### Frontend
- **Next.js**
- **React.js**
- **Tailwind CSS**
- ** JavaScript**

### Backend
- **Next.js API Routes**
- **NextAuth.js**

### Database
- **MongoDB**

### Authentication
- **Google OAuth**
- **NextAuth.js**

### AI / ML
- Crop recommendation model integration

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Devendra-soni0105/Crop-recommendation.git
```

### 2️⃣ Navigate to Project Folder

```bash
cd crop-recommendation-app
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# NextAuth Configuration
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# MongoDB Database Connection
MONGODB_URI="mongodb://localhost:27017/krishi_smart"

# Weather API Configuration (from https://www.weatherapi.com/)
WEATHER_API_KEY="your_weatherapi_key"

# Gemini API Configuration (Chatbot)
GEMINI_API_KEY="your_gemini_api_key"
```

## ▶️ Running the Project

Since this project uses both **Next.js** and a **Python AI model**, run the following commands:

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start the AI Backend

Run the Python AI service:

```bash
npm run ai
```

This will start:

```bash
python -u python_ai/app.py
```

### 3️⃣ Start the Next.js Frontend

Open a new terminal and run:

```bash
npm run dev
```

This will start the Next.js development server.

### 4️⃣ Train the AI Model (Optional)

If you want to retrain the crop recommendation model:

```bash
npm run ai_train
```

This executes:

```bash
python -u python_ai/model.py
```

### 5️⃣ Open the Application

Visit:

```bash
http://localhost:3000
```

