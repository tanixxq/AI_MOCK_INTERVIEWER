import Groq from "groq-sdk";

const groq = new Groq({
apiKey:process.env.GROQ_API_KEY
});

export const generateInterviewQuestions=async(
skills,
difficulty,
experience
)=>{
try{
const prompt=`
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

const response=await groq.chat.completions.create({
model:"llama-3.3-70b-versatile",
messages:[
{
role:"user",
content:prompt
}
],
temperature:0.7
});

const text=response.choices[0].message.content.trim();

return JSON.parse(text);

}catch(error){
console.error("Groq Error:",error);
throw new Error("Failed to generate interview questions");
}
};

export const evaluateAnswer=async(question,answer)=>{
try{
const prompt=`
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
"score":8,
"feedback":"Your feedback here"
}
`;

const response=await groq.chat.completions.create({
model:"llama-3.3-70b-versatile",
messages:[
{
role:"user",
content:prompt
}
],
temperature:0.3
});

const text=response.choices[0].message.content
.replace(/```json/g,"")
.replace(/```/g,"")
.replace(/\n/g," ")
.trim();

const jsonStart=text.indexOf("{");
const jsonEnd=text.lastIndexOf("}")+1;
const jsonText=text.substring(jsonStart,jsonEnd);

return JSON.parse(jsonText);

}catch(error){
console.error("Groq Evaluation Error:",error);
throw new Error("Failed to evaluate answer");
}
};

export const generateInterviewSummary=async(questions)=>{
try{
const prompt=`
You are a senior technical interviewer.

Analyze the complete interview performance.

Evaluate the candidate based on:
- Technical understanding
- Accuracy of answers
- Problem solving ability
- Strengths
- Areas of improvement

Interview Data:

${JSON.stringify(questions)}

Return ONLY valid JSON.

Format:
{
"overallScore":8,
"summary":"Overall interview performance summary",
"strengths":[
"Strength 1",
"Strength 2"
],
"improvements":[
"Improvement 1",
"Improvement 2"
]
}

Rules:
- overallScore should be between 0 and 10.
- Do not judge only by answer length.
- Consider technical correctness and understanding.
`;

const response=await groq.chat.completions.create({
model:"llama-3.3-70b-versatile",
messages:[
{
role:"user",
content:prompt
}
],
temperature:0.3
});

const text=response.choices[0].message.content
.replace(/```json/g,"")
.replace(/```/g,"")
.replace(/\n/g," ")
.trim();

const jsonStart=text.indexOf("{");
const jsonEnd=text.lastIndexOf("}")+1;
const jsonText=text.substring(jsonStart,jsonEnd);

return JSON.parse(jsonText);

}catch(error){
console.error("Groq Summary Error:",error);
throw new Error("Failed to generate interview summary");
}
};