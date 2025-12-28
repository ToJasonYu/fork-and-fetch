import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { ingredients, mealType, cookingTime, dietaryRestrictions, image, mimeType } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // KEPT AS REQUESTED: gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construct the prompt parts
    // UPDATED: Added "cookingTime" to the JSON schema below
    const promptText = `
      You are an expert chef.
      
      ${image ? "1. ANALYZE THE IMAGE provided to identify available ingredients." : ""}
      2. CONSIDER these user notes: "${ingredients}".
      3. CONSTRAINTS:
         - Meal Type: ${mealType}
         - Target Cooking Time: ${cookingTime}
         - Dietary Restrictions: ${dietaryRestrictions || "None"}

      Create a SINGLE, unique recipe that uses the ingredients found in the image (if any) and the user's notes.
      
      IMPORTANT: Return ONLY valid JSON. No markdown. Use this schema:
      {
        "title": "Recipe Name",
        "description": "Brief description",
        "difficulty": "Easy/Medium/Hard",
        "calories": "Approx kcal",
        "cookingTime": "XX mins",
        "ingredients": ["Item 1", "Item 2"],
        "instructions": ["Step 1", "Step 2"]
      }
    `;

    // Build the request array for Gemini (Text + Optional Image)
    let promptParts: any[] = [promptText];

    if (image) {
      promptParts.push({
        inlineData: {
          data: image, // Base64 string from frontend
          mimeType: mimeType,
        },
      });
    }

    // Generate Content
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();
    
    // Clean markdown if present
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "");
    
    return NextResponse.json(JSON.parse(cleanedText));

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe." },
      { status: 500 }
    );
  }
}