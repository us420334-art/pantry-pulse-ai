import mongoose from 'mongoose';

const pantryScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  detectedIngredients: [{ type: String }],
  imageUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('PantryScan', pantryScanSchema);