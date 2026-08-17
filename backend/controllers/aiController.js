import { GoogleGenAI } from '@google/genai';
import PantryItem from '../models/PantryItem.js';

export const generateRecipe = async (req, res) => {
    try {
        console.log('⏳ 1. Fetching pantry items from MongoDB...');
        const items = await PantryItem.find({ user: req.user._id });
        const itemNames = items.map((item) => item.name).join(', ');

        if (!itemNames) {
            return res.status(400).json({ message: 'No pantry items found to generate recipes.' });
        }

        console.log(`📦 2. Found items: ${itemNames}. Calling Gemini API...`);

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `Give a quick, concise recipe using: ${itemNames}`,
        });

        console.log('✅ 3. Gemini responded successfully!');

        return res.status(200).json({ recipe: response.text });
    } catch (error) {
        console.error('❌ Gemini Error:', error);
        return res.status(500).json({ message: error.message || 'Failed to generate recipe' });
    }
};