import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  // Additional details saved from the Profile page
  location: String,
  farmSize: Number,
  soilDetails: {
    nitrogen: Number,
    phosphorous: Number,
    potassium: Number,
    ph: Number,
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
