import Groq from "groq-sdk";

const groq=new Groq({
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

export const evaluateInterview=async(questions)=>{
try{
const prompt=`
You are an experienced technical interviewer.

Evaluate the complete interview.

Interview Data:
${JSON.stringify(questions)}

For EACH question:
- Give a score between 0 and 10.
- Give detailed constructive feedback.

Then provide:
- overallScore (0-10)
- summary
- strengths (array)
- improvements (array)

Return ONLY valid JSON.

Format:
{
"questions":[
{
"score":8,
"feedback":"Feedback here"
}
],
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
throw new Error("Failed to evaluate interview");
}
};