import Groq from "groq-sdk";

const groq=new Groq({
    apiKey:process.env.GROQ_API_KEY
});

const MODEL="llama-3.3-70b-versatile";

const parseJson=response=>{
    const content=response?.choices?.[0]?.message?.content;

    if(!content||typeof content!=="string"){
        throw new Error("AI returned an empty response");
    }

    try{
        return JSON.parse(content.trim());
    }catch(error){
        console.error("AI JSON Parse Error:",error.message);
        throw new Error("AI returned invalid JSON");
    }
};

const validateQuestions=data=>{
    if(!data||!Array.isArray(data.questions)){
        throw new Error("Invalid questions response");
    }

    if(data.questions.length!==10){
        throw new Error("AI did not generate exactly 10 questions");
    }

    const questions=data.questions
        .filter(question=>typeof question==="string")
        .map(question=>question.trim())
        .filter(Boolean);

    if(questions.length!==10){
        throw new Error("AI generated invalid questions");
    }

    return questions;
};

const validateEvaluation=(data,questionCount)=>{
    if(!data||typeof data!=="object"){
        throw new Error("Invalid evaluation response");
    }

    if(
        !Array.isArray(data.questions)||
        data.questions.length!==questionCount
    ){
        throw new Error("AI evaluation question count mismatch");
    }

    if(
        typeof data.overallScore!=="number"||
        data.overallScore<0||
        data.overallScore>10
    ){
        throw new Error("Invalid overall score");
    }

    if(!Array.isArray(data.strengths)||!Array.isArray(data.improvements)){
        throw new Error("Invalid strengths or improvements");
    }

    const questions=data.questions.map(item=>{
        if(
            !item||
            typeof item.score!=="number"||
            item.score<0||
            item.score>10||
            typeof item.feedback!=="string"
        ){
            throw new Error("Invalid question evaluation");
        }

        return{
            score:item.score,
            feedback:item.feedback.trim()
        };
    });

    return{
        questions,
        overallScore:data.overallScore,
        summary:typeof data.summary==="string"
            ?data.summary.trim()
            :"",
        strengths:data.strengths
            .filter(item=>typeof item==="string")
            .map(item=>item.trim())
            .filter(Boolean),
        improvements:data.improvements
            .filter(item=>typeof item==="string")
            .map(item=>item.trim())
            .filter(Boolean)
    };
};

export const generateInterviewQuestions=async(
    skills,
    difficulty,
    experience,
    type
)=>{
    try{
        if(
            !Array.isArray(skills)||
            !difficulty||
            !experience||
            !["Technical","Behavioural"].includes(type)
        ){
            throw new Error("Invalid interview generation input");
        }

        const skillText=skills.length
            ?skills.join(", ")
            :"Not applicable";

        const prompt=`
Generate exactly 10 interview questions.

Interview Type: ${type}
Skills: ${skillText}
Difficulty: ${difficulty}
Experience: ${experience}

${type==="Technical"
?`
Technical Interview Rules:
- Ask technical questions relevant to the provided skills.
- Questions may cover programming, coding, APIs, databases, frameworks, debugging, architecture, or problem solving.
- Include coding-oriented questions when appropriate.
- Match the difficulty to the candidate's experience.
- Do not ask behavioural or HR-style questions.
`
:`
Behavioural Interview Rules:
- Ask behavioural and situational interview questions.
- Focus on communication, teamwork, conflict resolution, leadership, adaptability, failure, motivation, ownership, and problem solving.
- Use realistic workplace scenarios.
- Do not ask coding, programming, database, API, or framework questions.
- Questions should encourage the candidate to explain real experiences or hypothetical workplace situations.
`}

General Rules:
- Return exactly 10 questions.
- Questions must be clear and interview-ready.
- Return JSON only.
- Return exactly this structure:
{
  "questions":[
    "Question 1",
    "Question 2"
  ]
}
`;

        const response=await groq.chat.completions.create({
            model:MODEL,
            messages:[
                {
                    role:"system",
                    content:"You are an expert technical and behavioural interviewer. Return only valid JSON."
                },
                {
                    role:"user",
                    content:prompt
                }
            ],
            temperature:0.7,
            response_format:{
                type:"json_object"
            }
        });

        const data=parseJson(response);

        return validateQuestions(data);

    }catch(error){
        console.error(
            "Groq Question Generation Error:",
            error.message
        );

        throw new Error("Failed to generate interview questions");
    }
};

export const evaluateInterview=async(questions)=>{
    try{
        if(!Array.isArray(questions)||questions.length===0){
            throw new Error("Invalid interview questions");
        }

        const prompt=`
You are an experienced technical and behavioural interviewer.

Evaluate the complete interview below.

Interview Data:
${JSON.stringify(questions)}

For every question:
- Give a score from 0 to 10.
- Give detailed constructive feedback.
- Evaluate the response based on clarity, relevance, correctness, reasoning, communication, and depth where appropriate.

Then provide:
- overallScore from 0 to 10
- summary
- strengths as an array
- improvements as an array

Return ONLY valid JSON in exactly this structure:
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
            model:MODEL,
            messages:[
                {
                    role:"system",
                    content:"You are an expert interviewer. Return only valid JSON."
                },
                {
                    role:"user",
                    content:prompt
                }
            ],
            temperature:0.3,
            response_format:{
                type:"json_object"
            }
        });

        const data=parseJson(response);

        return validateEvaluation(
            data,
            questions.length
        );

    }catch(error){
        console.error(
            "Groq Evaluation Error:",
            error.message
        );

        throw new Error("Failed to evaluate interview");
    }
};