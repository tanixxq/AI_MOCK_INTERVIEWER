import mongoose from "mongoose";
import {Interview} from "../Models/Interview.js";
import {generateInterviewQuestions,evaluateInterview} from "../Services/aiServices.js";

export const createInterview=async(req,res)=>{
    try{
        const {type,skills,experience,difficulty}=req.body;

        if(!["Technical","Behavioural"].includes(type)){
            return res.status(400).json({
                message:"Invalid interview type"
            });
        }

        const cleanedSkills=Array.isArray(skills)
            ?[...new Set(
                skills
                    .filter(skill=>typeof skill==="string")
                    .map(skill=>skill.trim())
                    .filter(Boolean)
            )]
            :[];

        if(type==="Technical"&&cleanedSkills.length===0){
            return res.status(400).json({
                message:"At least one skill is required for a technical interview"
            });
        }

        if(cleanedSkills.length>10){
            return res.status(400).json({
                message:"You can select up to 10 skills"
            });
        }

        if(
            typeof experience!=="string"||
            !experience.trim()
        ){
            return res.status(400).json({
                message:"Experience is required"
            });
        }

        const cleanedExperience=experience.trim();

        if(cleanedExperience.length>200){
            return res.status(400).json({
                message:"Experience must be 200 characters or less"
            });
        }

        if(!["Easy","Medium","Hard"].includes(difficulty)){
            return res.status(400).json({
                message:"Invalid difficulty"
            });
        }

        let questions;

        try{
            questions=await generateInterviewQuestions(
                cleanedSkills,
                difficulty,
                cleanedExperience,
                type
            );
        }catch(error){
            return res.status(502).json({
                message:"AI service failed to generate interview questions"
            });
        }

        if(!Array.isArray(questions)||questions.length!==10){
            return res.status(502).json({
                message:"AI failed to generate valid interview questions"
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
            type,
            skills:cleanedSkills,
            experience:cleanedExperience,
            difficulty,
            questions:formattedQuestions
        });

        await interview.save();

        res.status(201).json({
            message:"Interview created successfully",
            interview
        });
    }catch(error){
        console.error("Create Interview Error:",error.message);

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
            "_id type skills experience difficulty overallScore summary status completedAt createdAt"
        );

        res.status(200).json({interviews});
    }catch(error){
        console.error("My Interviews Error:",error.message);

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
        console.error("Get Interview Error:",error.message);

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
        console.error("Save Answer Error:",error.message);

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
            typeof answer==="string"
                ?answer.trim()
                :""
        );

        if(
            cleanedAnswers.some(
                answer=>!answer||answer.length>10000
            )
        ){
            return res.status(400).json({
                message:"Each answer must be between 1 and 10000 characters"
            });
        }

        cleanedAnswers.forEach((answer,index)=>{
            interview.questions[index].answer=answer;
        });

        let report;

        try{
            report=await evaluateInterview(interview.questions);
        }catch(error){
            return res.status(502).json({
                message:"AI service failed to evaluate the interview"
            });
        }

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
        console.error("Finish Interview Error:",error.message);

        res.status(500).json({
            message:"Error completing interview"
        });
    }
};