import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, default: 'https://placehold.co/600x400?text=Food' },
  ingredients: [{ type: String, required: true }],
  instructions: [{ type: String, required: true }],
  prepTime: { type: String, default: '20 mins' },
  dietaryTags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);