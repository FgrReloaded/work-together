import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateCanvasContent(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are an AI assistant for a collaborative whiteboard application.
    The application allows users to create rectangles, ellipses, text elements, and notes.
    Based on the user's prompt, generate content that can be rendered on the canvas.
    Return a JSON object with the following structure:
    {
      "elements": [
        {
          "type": "rectangle"|"ellipse"|"text"|"note",
          "content": "text content if applicable",
          "x": number,
          "y": number,
          "width": number,
          "height": number,
          "color": { "r": number, "g": number, "b": number }
        }
      ]
    }`;

    const result = await model.generateContent({
      contents: [
        { role: "model", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }

    throw new Error("Failed to parse response from AI");
  } catch (error) {
    console.error("Error generating canvas content:", error);
    throw error;
  }
}
