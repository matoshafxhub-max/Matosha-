import { GoogleGenAI } from "@google/genai";

// Fix: Directly use process.env.API_KEY in the constructor as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateOpeningLine = async (bio: string): Promise<string> => {
  // Fix: Removed redundant API key check. The try/catch block will handle failures
  // if the key is not configured, which aligns with API call error handling practices.
  try {
    const prompt = `You are a charming and respectful person trying to make a connection on a Tanzanian dating app called 'Pendo la Bongo'.
    Based on this user's bio: "${bio}"
    Write a single, short, sweet, and romantic opening line in Swahili.
    The line should be creative and directly related to their bio.
    Do not add any preamble, explanation, or quotation marks. Just provide the Swahili sentence.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();
    
    if (!text) {
        return "Habari! Wasifu wako umenifurahisha sana.";
    }

    return text;
  } catch (error) {
    console.error("Error generating opening line:", error);
    return "Mambo! Nimevutiwa na wasifu wako.";
  }
};
