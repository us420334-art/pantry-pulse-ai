import { GoogleGenerativeAI } from '@google/generative-ai';
import PantryItem from '../models/PantryItem.js';

export const generateRecipe = async (req, res) => {
  try {
    const items = await PantryItem.find({ user: req.user.id });

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No ingredients found in your pantry." });
    }

    const ingredientList = items.map((i) => `${i.name} (${i.quantity || 'as available'})`).join(', ');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Server API key configuration missing." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `I have these ingredients: ${ingredientList}. Please write 1 simple recipe with Title, Ingredients list, and Step-by-Step Instructions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ recipe: text });
  } catch (error) {
    console.error("Gemini AI Processing Error:", error);
    return res.status(500).json({ 
      message: error.message || "Failed to generate recipe.", 
      error: error.toString() 
    });
  }
};