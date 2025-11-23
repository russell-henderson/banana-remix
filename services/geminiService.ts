
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to convert URL to base64
const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const extractBase64Data = (fullBase64: string) => {
    const matches = fullBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (matches) {
      return { mimeType: matches[1], data: matches[2] };
    }
    return { mimeType: 'image/jpeg', data: fullBase64.replace(/^data:image\/\w+;base64,/, '') };
};

const isRateLimitError = (e: any) => {
  return e.response?.status === 429 || e.status === 429 || e.code === 429 || e.message?.includes('429') || e.message?.includes('quota') || e.message?.includes('RESOURCE_EXHAUSTED');
};

/**
 * Uses Gemini Nano Banana (gemini-2.5-flash-image) to remix an image based on a prompt.
 * Supports blending two images if secondaryImage is provided.
 */
export const remixImage = async (
  imageSource: string, 
  prompt: string,
  secondaryImage?: string
): Promise<string> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  try {
    const parts: any[] = [];
    
    // 1. Process Primary Image
    let primaryBase64 = imageSource;
    if (imageSource.startsWith('http')) {
        primaryBase64 = await urlToBase64(imageSource);
    }
    const primaryData = extractBase64Data(primaryBase64);
    
    parts.push({
        inlineData: {
            data: primaryData.data,
            mimeType: primaryData.mimeType,
        }
    });

    // 2. Process Secondary Image (if exists)
    if (secondaryImage) {
        let secondaryBase64 = secondaryImage;
        if (secondaryImage.startsWith('http')) {
            secondaryBase64 = await urlToBase64(secondaryImage);
        }
        const secondaryData = extractBase64Data(secondaryBase64);
        
        parts.push({
            inlineData: {
                data: secondaryData.data,
                mimeType: secondaryData.mimeType,
            }
        });
    }

    // 3. Add Prompt
    let promptText = `Instruction: ${prompt}. `;
    if (secondaryImage) {
        promptText += " BLEND TASK: Combine the visual elements, style, or composition of BOTH provided images based on the user instruction. The first image is the base structure, the second image is the style/influence. Output a single cohesive artwork.";
    } else {
        promptText += " Maintain the main composition and structure of the provided image, but creatively alter the style, texture, or elements as described. High artistic quality.";
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error: any) {
    if (isRateLimitError(error)) {
        throw new Error("Service is currently busy (Rate Limit Reached). Please wait a minute and try again.");
    }
    console.error("Gemini Remix Error:", error);
    throw error;
  }
};

/**
 * Analyzes the image and returns creative remix suggestions focusing on objects and environment.
 */
export const getRemixSuggestions = async (imageBase64: string): Promise<string[]> => {
  const DEFAULTS = ["Add a giant robot", "Change setting to Mars", "Place a dragon in the sky", "Make it underwater"];
  
  if (!process.env.API_KEY) return DEFAULTS;

  try {
    let fullBase64 = imageBase64;

    // Handle remote URLs (e.g. from mock data) before sending to API
    if (imageBase64.startsWith('http') || imageBase64.startsWith('https')) {
       try {
         fullBase64 = await urlToBase64(imageBase64);
       } catch (e) {
         console.warn("Failed to fetch source image for suggestions, using defaults.");
         return DEFAULTS;
       }
    }

    const { mimeType, data } = extractBase64Data(fullBase64);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: data, mimeType: mimeType } },
          { text: "Analyze this image and list 4 creative remix prompts. Focus specifically on adding objects (e.g., 'add a giant robot', 'place a dragon in the sky') or changing the environment (e.g., 'change setting to Mars', 'put in an underwater city'). Avoid simple style changes like 'make it pixel art'. Keep prompts concise (under 10 words). Output strictly JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const suggestions = JSON.parse(response.text || '[]');
    return Array.isArray(suggestions) && suggestions.length > 0 
      ? suggestions 
      : DEFAULTS;
  } catch (e: any) {
    if (isRateLimitError(e)) {
        console.warn("Gemini Rate Limit for suggestions. Using defaults.");
        return DEFAULTS;
    }
    console.error("Suggestion error", e);
    return DEFAULTS;
  }
};

/**
 * Takes a rough user prompt and improves it using LLM to be more artistic and detailed.
 */
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
    if (!process.env.API_KEY) return originalPrompt + ", highly detailed, cinematic lighting, 8k";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: `You are an expert AI Art Prompter. Take the following simple user request and expand it into a detailed, artistic prompt suitable for an image generator. Add adjectives for lighting, texture, and mood. Keep the original intent clear.
                    
                    Rules:
                    1. Limit the response to a maximum of 100 words.
                    2. Provide ONLY the enhanced prompt text. Do not add introductory labels like "Enhanced Prompt:" or conversational text.
                    
                    User Request: "${originalPrompt}"` }
                ]
            }
        });
        return response.text || originalPrompt;
    } catch (e: any) {
        if (isRateLimitError(e)) {
            return originalPrompt; // Fail silently to original prompt
        }
        console.error("Prompt enhance error", e);
        return originalPrompt;
    }
};

/**
 * Generate a caption or tags for a new post to help accessibility and search.
 */
export const generateImageCaption = async (imageBase64: string, mimeType: string = 'image/jpeg'): Promise<string> => {
    const DEFAULT_CAPTION = "An interesting moment captured.";
    if (!process.env.API_KEY) return DEFAULT_CAPTION;

    try {
        const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: cleanData, mimeType } },
                    { text: "Write a short, creative, 1-sentence caption for this social media post." }
                ]
            }
        });
        return response.text || DEFAULT_CAPTION;
    } catch (e: any) {
        if (isRateLimitError(e)) {
            return DEFAULT_CAPTION;
        }
        console.error("Caption gen error", e);
        return DEFAULT_CAPTION;
    }
}
