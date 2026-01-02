
import { GoogleGenAI } from "@google/genai";
import { ContentType, Tone } from "../types";

export const generateMarketingContent = async (
  type: ContentType,
  topic: string,
  tone: Tone,
  length: string,
  useSearch: boolean = false,
  additionalNotes: string = ""
): Promise<{text: string, sources?: any[]}> => {
  // Direct initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

    // Using the required direct call pattern
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

    // Iterate to find the image part as per guidelines
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
    
    throw new Error("No image data returned.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw new Error("Failed to generate image.");
  }
};
