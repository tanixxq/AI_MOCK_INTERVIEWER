import { GoogleGenAI } from "@google/genai";

export const generateInterviewQuestions = async (
  skills,
  difficulty,
  experience
) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
Generate exactly 10 interview questions.

Skills: ${skills.join(",")}
Difficulty: ${difficulty}
Experience: ${experience}

Rules:
- Return ONLY a JSON array.
- No markdown.
- No explanation.
- No numbering.

Example:
[
  "Question 1",
  "Question 2"
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate interview questions");
  }
};