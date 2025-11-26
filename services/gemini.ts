import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, GenerationRequest } from "../types";

// Define the expected JSON schema for the response
const recipeSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
      calories: { type: Type.STRING },
      time: { type: Type.STRING },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            unit: { type: Type.STRING },
          },
          required: ["item", "amount", "unit"],
        },
      },
      steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: ["title", "description", "difficulty", "ingredients", "steps", "time", "calories"],
  },
};

export const generateRecipes = async ({ mode, input, isVegetarian }: GenerationRequest): Promise<Recipe[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are Chef Whiskers, a helpful and witty cat chef assistant.
    Your goal is to generate 3 distinct recipes based on the user's input.
    
    Constraints:
    1. At least one recipe MUST be "No-Oven" (stovetop, raw, microwave, etc.) and very easy.
    2. ${isVegetarian ? "ALL recipes must be VEGETARIAN." : "Suggest a mix, but prioritize the input ingredients."}
    3. Return valid JSON only.
  `;

  const promptText = mode === 'photo' 
    ? "Identify the food or ingredients in this image and generate recipes using them." 
    : `The user has these ingredients: ${input}. Generate recipes using these ingredients.`;

  try {
    const contents = [];
    
    if (mode === 'photo') {
      // Input is a data URL (e.g., "data:image/jpeg;base64,...")
      // We need to strip the header for the API
      const base64Data = input.split(',')[1];
      if (!base64Data) throw new Error("Invalid image data");

      contents.push({
        parts: [
          { text: promptText },
          { 
            inlineData: { 
              mimeType: "image/jpeg", 
              data: base64Data 
            } 
          }
        ]
      });
    } else {
      contents.push({
        parts: [{ text: promptText }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7, // Slightly creative but grounded
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Chef Whiskers is taking a nap (No response data).");
    }

    // The SDK with responseSchema guarantees the structure, but we parse it to be safe
    return JSON.parse(jsonText) as Recipe[];

  } catch (error) {
    console.error("Chef Whiskers API Error:", error);
    throw new Error("Meow! I couldn't cook up a response. Please check your connection or ingredients.");
  }
};