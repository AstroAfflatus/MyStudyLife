
import { GoogleGenAI } from "@google/genai";

export async function getStudyAdvice(userProfile: any, tasks: any[]) {
  // Always create a new instance inside the function to ensure the correct API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am a student in class ${userProfile.className} studying ${userProfile.stream}. 
                 My daily goal is ${userProfile.dailyGoal} hours. 
                 My pending tasks are: ${tasks.map(t => t.title).join(', ')}. 
                 Give me 3 short, motivational bullet points to stay productive today.`,
      config: {
        temperature: 0.7,
        // When setting maxOutputTokens for Gemini 3 models, thinkingBudget must also be set
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 50 }
      }
    });
    return response.text || "Keep pushing forward! Your hard work will pay off.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Focus on your goals and take one step at a time.";
  }
}

export async function summarizeNote(content: string) {
  // Always create a new instance inside the function to ensure the correct API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following study note in 2-3 concise sentences: ${content}`,
      config: {
        temperature: 0.5,
        // When setting maxOutputTokens for Gemini 3 models, thinkingBudget must also be set
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 50 }
      }
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Summary failed to generate.";
  }
}
