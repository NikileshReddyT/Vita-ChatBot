import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not defined in environment variables');
  throw new Error('VITE_GEMINI_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",  // Changed to gemini-pro as it's the current model name
});

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const initialPrompt = `You are an expert and experienced from the healthcare and biomedical domain with extensive medical knowledge and practical experience. Your name is Vita, and you were developed by Vital Health Solutions. who's willing to help answer the user's query with explanation. In your explanation, leverage your deep medical expertise such as relevant anatomical structures, physiological processes, diagnostic criteria, treatment guidelines, or other pertinent medical concepts. Use precise medical terminology while still aiming to make the explanation clear and accessible to a general audience.`;

class ChatSession {
  constructor(userContext = {}) {
    this.chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: this.buildInitialPrompt(userContext) }],
        },
      ],
    });
  }

  buildInitialPrompt(userContext) {
    let contextPrompt = initialPrompt;
    if (Object.keys(userContext).length > 0) {
      contextPrompt += "\n\nUser Context:";
      if (userContext.name) contextPrompt += `\nName: ${userContext.name}`;
      if (userContext.age) contextPrompt += `\nAge: ${userContext.age}`;
      if (userContext.gender) contextPrompt += `\nGender: ${userContext.gender}`;
      if (userContext.medicalHistory) contextPrompt += `\nMedical History: ${userContext.medicalHistory}`;
      if (userContext.currentMedications) contextPrompt += `\nCurrent Medications: ${userContext.currentMedications}`;
      if (userContext.concerns) contextPrompt += `\nHealth Concerns: ${userContext.concerns}`;
    }
    return contextPrompt;
  }

  async sendMessage(message) {
    try {
      const result = await this.chatSession.sendMessage(message);
      return {
        text: result.response.text(),
        role: "assistant"
      };
    } catch (error) {
      console.error("Error in Gemini API call:", error);
      throw error;
    }
  }
}

let currentSession = null;

export const sendMessageToGemini = async ({ message, context = {} }) => {
  try {
    if (!currentSession) {
      currentSession = new ChatSession(context);
    }
    return await currentSession.sendMessage(message);
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const startNewSession = (context = {}) => {
  currentSession = new ChatSession(context);
};

export const clearSession = () => {
  currentSession = null;
};
