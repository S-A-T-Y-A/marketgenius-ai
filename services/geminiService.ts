
import { GoogleGenAI } from "@google/genai";
import { ContentType, Tone } from "../types";

/**
 * Helper to get the AI client instance safely.
 * This ensures we always check for the API key at the moment of use.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error(
      "API Key is missing. If you're running locally, ensure your environment variables are correctly injected into the browser build."
    );
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMarketingContent = async (
  type: ContentType,
  topic: string,
  tone: Tone,
  length: string,
  useSearch: boolean = false,
  additionalNotes: string = ""
): Promise<{text: string, sources?: any[]}> => {
  const ai = getAIClient();
  
  const systemInstruction = `You are an expert marketing copywriter. 
  Generate high-converting content. If search results are provided, use them to include up-to-date facts. 
  Always use markdown formatting for clarity.`;

  const prompt = `Generate a ${type} about: "${topic}".
  Tone: ${tone}
  Length: ${length}
  Notes: ${additionalNotes}`;

  try {
    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config,
    });

    return {
      text: response.text || "No content was generated.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error?.message || "An unexpected error occurred during content generation.");
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality professional marketing photography for: ${prompt}. Professional studio lighting, clean commercial aesthetic, 4k high resolution.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    let base64Data = "";
    let mimeType = "image/png";

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          mimeType = part.inlineData.mimeType;
          break;
        }
      }
    }

    if (base64Data) {
      return `data:${mimeType};base64,${base64Data}`;
    }
    
    throw new Error("The image generation model returned no data. Try a different topic.");
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw new Error(error?.message || "Failed to generate AI visual.");
  }
};
