import { GoogleGenAI } from "@google/genai";

console.log("Gemini Key Exists:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateInterviewQuestions = async (
    skills,
    difficulty,
    experience
) => {
    try {
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


export const evaluateAnswer = async (question, answer) => {
    try {
        const prompt = `
        You are an experienced technical interviewer.
        
        Evaluate the candidate's answer based on:
        - Technical correctness
        - Understanding of the concept
        - Relevance to the question
        - Clarity of explanation
        
        Important:
        - Do NOT judge the answer based on length.
        - Short answers can receive high scores if they demonstrate correct understanding.
        - Evaluate like a real human interviewer.
        - Do not expect every possible keyword.
        - Give lower scores only if important concepts are missing or the answer is incorrect.
        
        Question:
        ${question}
        
        Candidate Answer:
        ${answer}
        
        Return ONLY valid JSON.
        
        Format:
        {
          "score": 8,
          "feedback": "Your feedback here"
        }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/\n/g, " ")
            .trim();

        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;

        const jsonText = text.substring(jsonStart, jsonEnd);

        return JSON.parse(text);

    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        throw new Error("Failed to evaluate answer");
    }
};