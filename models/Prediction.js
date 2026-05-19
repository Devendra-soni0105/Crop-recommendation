import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  crop: {
    type: String,
    required: true,
  },
  inputs: {
    nitrogen: Number,
    phosphorous: Number,
    potassium: Number,
    temperature: Number,
    humidity: Number,
    ph: Number,
    rainfall: Number,
  },
}, { timestamps: true });

export default mongoose.models.Prediction || mongoose.model('Prediction', PredictionSchema);
