
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateMockup(
  labelBase64: string,
  prompt: string,
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"
): Promise<string> {
  const model = ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: labelBase64.split(',')[1] || labelBase64,
          },
        },
        {
          text: `You are a professional commercial mockup generator. 
          STRICT RULE: Do NOT alter, redesign, or reinterpret the uploaded design. 
          TASK: Create an ultra-photorealistic mockup using THIS design. 
          SCENE DESCRIPTION: ${prompt}.
          
          Technical details for rendering:
          - If the finish is "High Gloss" or "ultra-gloss", emphasize sharp specular highlights, clear environmental reflections on the label surface, and a sleek, polished appearance.
          - Apply realistic perspective, curvature, shadows, and commercial studio lighting. 
          - The final result should look like a high-end product photoshoot from a luxury branding agency.`
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio
      }
    }
  });

  const response = await model;
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data returned from model");
}
