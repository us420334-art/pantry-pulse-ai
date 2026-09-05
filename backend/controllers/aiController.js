import { GoogleGenerativeAI } from "@google/generative-ai";
import PantryItem from "../models/PantryItem.js"; // Adjust path to your model

export const generateRecipe = async (req, res) => {
    try {
        // 1. Fetch current items for the logged-in user
        const items = await PantryItem.find({ user: req.user.id });

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Your pantry is empty. Please add ingredients first."
            });
        }

        // 2. Format ingredients into a string
        const ingredientList = items
            .map((item) => `${item.name}${item.quantity ? ` (${item.quantity})` : ""}`)
            .join(", ");

        // 3. Initialize Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `I have the following ingredients in my pantry: ${ingredientList}. Suggest a creative, step-by-step recipe I can make with these.`;

        const result = await model.generateContent(prompt);
        const recipeText = result.response.text();

        // 4. Return recipe object to frontend
        return res.status(200).json({ recipe: recipeText });
    } catch (error) {
        console.error("AI Recipe Generation Error:", error);
        return res.status(500).json({
            message: "Failed to generate recipe. Check server logs or Gemini API key.",
            error: error.message
        });
    }
};