
import { GoogleGenAI } from "@google/genai";
import { ContentType, Tone } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMarketingContent = async (
  type: ContentType,
  topic: string,
  tone: Tone,
  length: string,
  useSearch: boolean = false
): Promise<{text: string}> => {
  const ai = getAIClient();
  const systemInstruction = `You are a world-class marketing director. Generate high-converting ${type} content. 
  For Social Media, include relevant hashtags. For Email, include a Subject Line. 
  For Ad Copy, include a clear Call to Action (CTA). Use clean Markdown formatting.`;

  const prompt = `Topic: "${topic}"\nTone: ${tone}\nTarget Length: ${length}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction, temperature: 0.8 },
    });
    return { text: response.text || "" };
  } catch (error: any) {
    throw new Error(error?.message || "Content generation failed.");
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Commercial high-end marketing photography for: ${prompt}. Professional studio lighting, clean minimal background, 4k, photorealistic.` }]
      },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned.");
  } catch (error: any) {
    throw new Error("Image Generation failed: " + error.message);
  }
};

export const generateMarketingVideo = async (prompt: string, onProgress?: (msg: string) => void): Promise<string> => {
  const ai = getAIClient();
  
  // Check if key is selected (standard procedure for Veo)
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }

  onProgress?.("Initializing Cinematic Engine...");
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `High quality commercial marketing video: ${prompt}. Cinematic lighting, smooth camera movement, professional advertising style.`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    onProgress?.("Rendering frames...");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      onProgress?.("Applying color grading and motion effects...");
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed.");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    throw new Error("Video Generation failed: " + error.message);
  }
};
