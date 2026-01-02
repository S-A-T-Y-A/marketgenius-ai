
import { GoogleGenAI } from "@google/genai";
import { ContentType, Tone } from "../types";

// Helper to get the AI client safely
const getAIClient = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : (window as any).API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please set it in your environment variables.");
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
  Generate high-converting content. If search results are provided, use them to include up-to-date facts.`;

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
      text: response.text || "Failed to generate text.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate content.");
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality professional marketing photography for: ${prompt}. Clean, commercial aesthetic, 4k.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw new Error("Failed to generate image.");
  }
};
