import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { SentimentData } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
const hasKey = () => !!apiKey;

export interface ComplaintScenario {
  id: string;
  label: string;
  fields: string[];
  template: string;
}

export interface BusinessResult {
  name: string;
  logo: string;
}

export const analyzeSentiment = async (text: string): Promise<SentimentData> => {
  if (!hasKey()) {
    return { score: 0, label: 'Neutral', summary: 'AI Analysis Unavailable (Missing Key)', language: 'English' };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the sentiment of the following customer complaint. Provide a score from -1 (very negative) to 1 (very positive), a label (Negative, Urgent, Neutral, Positive), a 1-sentence summary of the core issue, and detect the language of the text (e.g. "English", "Spanish", "French").\n\nComplaint: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            label: { type: Type.STRING, enum: ["Negative", "Urgent", "Neutral", "Positive"] },
            summary: { type: Type.STRING },
            language: { type: Type.STRING }
          },
          required: ["score", "label", "summary", "language"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from AI");
    return JSON.parse(jsonStr) as SentimentData;

  } catch (error) {
    console.error("Sentiment analysis failed", error);
    return { score: -0.5, label: 'Negative', summary: 'Analysis failed', language: 'Unknown' };
  }
};

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!hasKey()) return "Translation unavailable without API Key.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following text into ${targetLang}. Only return the translated text.\n\nText: "${text}"`,
    });
    return response.text || "Translation error.";
  } catch (error) {
    console.error("Translation failed", error);
    return "Translation failed.";
  }
};

export const generateProfessionalResponse = async (complaintText: string, companyName: string): Promise<string> => {
  if (!hasKey()) return "AI drafting unavailable without API Key.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a customer support agent for ${companyName}. Write a professional, empathetic, and solution-oriented response to the following complaint. Keep it under 100 words.\n\nComplaint: "${complaintText}"`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Draft generation failed", error);
    return "";
  }
};

// --- New Features for Flow Form ---

export const getCountryFromCoords = async (lat: number, lng: number): Promise<string> => {
  // Try to use a browser-based heuristic or fallback if no key, but if key exists, use Gemini with Search
  if (!hasKey()) return "United States"; 

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `What country corresponds to these coordinates: ${lat}, ${lng}? Respond with ONLY the country name.`,
      config: {
        tools: [{googleSearch: {}}],
      }
    });
    // Extract country from response text which might be chatty with tools
    // We just want the country name.
    const text = response.text || "";
    // Simple heuristic to clean up if it says "The country is X"
    const cleanText = text.replace(/The country (is|at these coordinates is) /i, '').replace(/\.$/, '').trim();
    return cleanText || "Unknown Location";
  } catch (error) {
    console.error("Geocoding failed", error);
    return "Unknown Location";
  }
};

export const searchBusinesses = async (country: string, industry: string): Promise<BusinessResult[]> => {
  if (!hasKey()) return [{ name: "Generic Business", logo: "" }];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List the top 20 most popular ${industry} businesses operating in ${country}. Return a JSON array of objects with properties: "name" (business name) and "domain" (website domain like google.com).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { 
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                domain: { type: Type.STRING }
            },
            required: ["name", "domain"]
          }
        }
      }
    });

    const jsonStr = response.text;
    const parsed = jsonStr ? JSON.parse(jsonStr) : [];
    
    if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
            name: item.name || "Unknown",
            logo: item.domain ? `https://logo.clearbit.com/${item.domain}` : ''
        }));
    }
    return [];
  } catch (error) {
    console.error("Business search failed", error);
    return [];
  }
};

export const getComplaintScenarios = async (businessName: string, industry: string): Promise<ComplaintScenario[]> => {
  if (!hasKey()) {
    // Fallback scenarios if no key
    return [
      { 
        id: 'generic', 
        label: 'General Complaint', 
        fields: ['Date of Incident', 'Reference Number'], 
        template: 'I am writing to report an issue regarding my experience on {{Date of Incident}}. My reference number is {{Reference Number}}.' 
      }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Generate 4 specific, common complaint scenarios for a ${industry} business named ${businessName}.
        For each scenario, provide:
        1. A short label (e.g., "Defective Product", "Billing Error").
        2. A list of 2-4 specific data fields needed to resolve this (e.g., "Receipt Number", "Transaction Date", "Staff Name").
        3. A professional description template that uses these fields as placeholders enclosed in double curly braces {{Field Name}}.
        
        Return a JSON array of objects.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              fields: { type: Type.ARRAY, items: { type: Type.STRING } },
              template: { type: Type.STRING }
            },
            required: ["id", "label", "fields", "template"]
          }
        }
      }
    });

    const jsonStr = response.text;
    return jsonStr ? JSON.parse(jsonStr) : [];
  } catch (error) {
    console.error("Scenario generation failed", error);
    return [];
  }
};

// Deprecated in favor of getComplaintScenarios but kept for backward compatibility if needed elsewhere
export const refineComplaint = async (businessName: string, industry: string, draftText: string): Promise<{
  professional: string;
  urgent: string;
  detailed: string;
}> => {
  if (!hasKey()) return { professional: draftText, urgent: draftText, detailed: draftText };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Rewrite the following customer complaint about ${businessName} (${industry}) into three distinct versions:
        1. Professional: Formal, polite, and fact-based.
        2. Urgent: Highlighting severe impact and requesting immediate action.
        3. Detailed: Expanding on the issue with standard industry terminology for this industry.
        
        Original Draft: "${draftText}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            professional: { type: Type.STRING },
            urgent: { type: Type.STRING },
            detailed: { type: Type.STRING }
          },
          required: ["professional", "urgent", "detailed"]
        }
      }
    });

    const jsonStr = response.text;
    return jsonStr ? JSON.parse(jsonStr) : { professional: draftText, urgent: draftText, detailed: draftText };
  } catch (error) {
    console.error("Template generation failed", error);
    return { professional: draftText, urgent: draftText, detailed: draftText };
  }
};