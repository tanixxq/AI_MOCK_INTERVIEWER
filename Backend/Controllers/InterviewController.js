import mongoose from "mongoose";
import {Interview} from "../Models/Interview.js";
import {generateInterviewQuestions,evaluateInterview} from "../Services/aiServices.js";


export const createInterview=async(req,res)=>{
    try{
        const {skills,experience,difficulty}=req.body;

        if(!Array.isArray(skills)||skills.length===0){
            return res.status(400).json({message:"At least one skill is required"});
        }

        const cleanedSkills=[...new Set(
            skills
                .filter(skill=>typeof skill==="string")
                .map(skill=>skill.trim())
                .filter(Boolean)
        )];

        if(cleanedSkills.length===0){
            return res.status(400).json({message:"Valid skills are required"});
        }

        if(cleanedSkills.length>10){
            return res.status(400).json({message:"You can select up to 10 skills"});
        }

        if(typeof experience!=="string"||!experience.trim()){
            return res.status(400).json({message:"Experience is required"});
        }

        if(!["Easy","Medium","Hard"].includes(difficulty)){
            return res.status(400).json({message:"Invalid difficulty"});
        }

        const questions=await generateInterviewQuestions(
            cleanedSkills,
            difficulty,
            experience.trim()
        );

        if(!Array.isArray(questions)||questions.length===0){
            return res.status(502).json({
                message:"AI failed to generate interview questions"
            });
        }

        const formattedQuestions=questions.map(question=>({
            question,
            answer:"",
            feedback:"",
            score:0
        }));

        const interview=new Interview({
            userId:req.user.id,
            skills:cleanedSkills,
            experience:experience.trim(),
            difficulty,
            questions:formattedQuestions
        });

        await interview.save();

        res.status(201).json({
            message:"Interview created successfully",
            interview
        });

    }catch(error){
        console.log("Create Interview Error:",error);

        res.status(500).json({
            message:"Error creating interview"
        });
    }
};

export const getMyInterviews=async(req,res)=>{
    try{
        const interviews=await Interview.find({
            userId:req.user.id,
            status:"Completed"
        })
        .sort({completedAt:-1,createdAt:-1})
        .select(
            "_id skills experience difficulty overallScore summary status completedAt createdAt"
        );

        res.status(200).json({interviews});
    }catch(error){
        console.log("My Interviews Error:",error);

        res.status(500).json({
            message:"Error fetching interview history"
        });
    }
};

export const getInterviewById=async(req,res)=>{
    try{
        const {id}=req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message:"Invalid interview ID"
            });
        }

        const interview=await Interview.findOne({
            _id:id,
            userId:req.user.id
        });

        if(!interview){
            return res.status(404).json({
                message:"Interview not found"
            });
        }

        res.status(200).json({interview});
    }catch(error){
        console.log("Get Interview Error:",error);

        res.status(500).json({
            message:"Error fetching interview"
        });
    }
};

export const saveAnswer=async(req,res)=>{
    try{
        const {id}=req.params;
        const {questionIndex,answer}=req.body;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message:"Invalid interview ID"
            });
        }

        if(!Number.isInteger(questionIndex)){
            return res.status(400).json({
                message:"Invalid question index"
            });
        }

        if(typeof answer!=="string"){
            return res.status(400).json({
                message:"Answer must be text"
            });
        }

        const cleanedAnswer=answer.trim();

        if(!cleanedAnswer){
            return res.status(400).json({
                message:"Answer cannot be empty"
            });
        }

        if(cleanedAnswer.length>10000){
            return res.status(400).json({
                message:"Answer is too long"
            });
        }

        const interview=await Interview.findOne({
            _id:id,
            userId:req.user.id
        });

        if(!interview){
            return res.status(404).json({
                message:"Interview not found"
            });
        }

        if(interview.status==="Completed"){
            return res.status(409).json({
                message:"Interview is already completed"
            });
        }

        if(!interview.questions[questionIndex]){
            return res.status(400).json({
                message:"Invalid question index"
            });
        }

        interview.questions[questionIndex].answer=cleanedAnswer;

        await interview.save();

        res.status(200).json({
            message:"Answer saved successfully"
        });
    }catch(error){
        console.log("Save Answer Error:",error);

        res.status(500).json({
            message:"Error saving answer"
        });
    }
};

export const finishInterview=async(req,res)=>{
    try{
        const {id}=req.params;
        const {answers}=req.body;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message:"Invalid interview ID"
            });
        }

        if(!Array.isArray(answers)){
            return res.status(400).json({
                message:"Answers must be an array"
            });
        }

        const interview=await Interview.findOne({
            _id:id,
            userId:req.user.id
        });

        if(!interview){
            return res.status(404).json({
                message:"Interview not found"
            });
        }

        if(interview.status==="Completed"){
            return res.status(409).json({
                message:"Interview has already been completed"
            });
        }

        if(answers.length!==interview.questions.length){
            return res.status(400).json({
                message:"All interview questions must be answered"
            });
        }

        const cleanedAnswers=answers.map(answer=>
            typeof answer==="string"?answer.trim():""
        );

        if(cleanedAnswers.some(answer=>!answer)){
            return res.status(400).json({
                message:"All questions must have an answer"
            });
        }

        cleanedAnswers.forEach((answer,index)=>{
            interview.questions[index].answer=answer;
        });

        const report=await evaluateInterview(interview.questions);

        if(
            !report||
            !Array.isArray(report.questions)||
            report.questions.length!==interview.questions.length
        ){
            return res.status(502).json({
                message:"AI evaluation returned an invalid response"
            });
        }

        report.questions.forEach((item,index)=>{
            interview.questions[index].score=item.score||0;
            interview.questions[index].feedback=item.feedback||"";
        });

        interview.overallScore=Number(report.overallScore)||0;
        interview.summary=report.summary||"";
        interview.strengths=Array.isArray(report.strengths)
            ?report.strengths
            :[];
        interview.improvements=Array.isArray(report.improvements)
            ?report.improvements
            :[];
        interview.status="Completed";
        interview.reportGenerated=true;
        interview.completedAt=new Date();

        await interview.save();

        res.status(200).json({
            message:"Interview completed successfully",
            interview
        });
    }catch(error){
        console.log("Finish Interview Error:",error);

        res.status(500).json({
            message:"Error completing interview"
        });
    }
};