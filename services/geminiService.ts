import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, MediaFile, ConditionDetails } from '../types';
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeHealthData = async (
  text: string,
  files: MediaFile[],
  audioData?: string
): Promise<AnalysisResponse> => {
  try {
    const parts: any[] = [];

    // Add Text
    if (text) {
      parts.push({ text });
    }

    // Add Files (Images/PDFs)
    files.forEach(file => {
      parts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      });
    });

    // Add Audio
    if (audioData) {
      parts.push({
        inlineData: {
          mimeType: 'audio/wav', // Assuming WAV from recorder
          data: audioData
        }
      });
    }

    if (parts.length === 0) {
      throw new Error("No input provided for analysis.");
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2048 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Critical"] },
            urgency: { type: Type.STRING, enum: ["Immediate", "Within 24 hours", "Routine"] },
            summary: { type: Type.STRING },
            labAnalysis: { type: Type.STRING },
            labPredictions: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedFollowUpTests: { type: Type.ARRAY, items: { type: Type.STRING } },
            possibleConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            doctorSummary: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
            emergencyInstructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  sideEffects: { type: Type.STRING },
                  warnings: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  alternatives: { type: Type.STRING }
                }
              }
            },
            interactions: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  status: { type: Type.STRING, enum: ["Normal", "Elevated", "High", "Critical"] }
                }
              }
            },
            glossary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING }
                }
              }
            },
            followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskLevel", "urgency", "summary", "possibleConditions", "recommendations", "doctorSummary", "disclaimer", "medications", "interactions", "riskScores", "glossary"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(resultText) as AnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const fetchConditionDetails = async (condition: string): Promise<ConditionDetails> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Provide a comprehensive medical knowledge base article for the condition: "${condition}". 
      Ensure the language is accessible to a general audience but clinically accurate. 
      If the input is not a recognized medical condition, provide the closest match or a generic explanation of why it might not be found in the 'overview' and 'name' fields.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            overview: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            diagnosis: { type: Type.STRING },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "overview", "symptoms", "causes", "diagnosis", "treatment", "prevention"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(resultText) as ConditionDetails;
  } catch (error) {
    console.error("Gemini Knowledge Base Error:", error);
    throw error;
  }
};