import { GoogleGenAI, Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants.js';

// Initialize the GenAI client. API_KEY must be provided in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

// Maintain a single chat session instance to keep conversation history
let chatSession: Chat | null = null;

/**
 * Initializes a new chat session with the predefined system instructions.
 */
export const initChatSession = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      // Low temperature to ensure the model sticks closely to the provided facts and rules
      temperature: 0.1, 
    },
  });
};

/**
 * Sends a message to the chat session and returns the response text.
 * @param message The user's input message.
 * @returns The model's response text.
 */
export const sendMessageToAgent = async (message: string): Promise<string> => {
  if (!chatSession) {
    initChatSession();
  }
  
  try {
    const response = await chatSession!.sendMessage({ message });
    return response.text || "응답을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw new Error("상담원과 연결하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};
