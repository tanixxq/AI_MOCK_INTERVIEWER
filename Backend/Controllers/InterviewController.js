import { Interview } from "../Models/Interview.js";
import { generateInterviewQuestions,evaluateInterview } from "../Services/aiServices.js";

export const createInterview=async(req,res)=>{
    try{
        const{
            skills,
            experience,
            difficulty
        }=req.body;

        const questions=await generateInterviewQuestions(
            skills,
            difficulty,
            experience
        );

        const formattedQuestions=questions.map((question)=>({
            question,
            answer:"",
            feedback:"",
            score:0
        }));

        const interview=new Interview({
            userId:req.user.id,
            skills,
            experience,
            difficulty,
            questions:formattedQuestions
        });

        await interview.save();

        res.status(201).json({
            message:"Interview created successfully",
            interview
        });

    }catch(error){
        res.status(500).json({
            message:"Error creating interview",
            error:error.message
        });
    }
};

export const getInterviewById=async(req,res)=>{
    try{
        const{id}=req.params;

        console.log("Interview ID:",id);
        console.log("Logged in User:",req.user.id);

        const interview=await Interview.findOne({
            _id:id,
            userId:req.user.id
        });

        if(!interview){
            return res.status(404).json({
                message:"Interview not found"
            });
        }

        res.status(200).json({
            interview
        });

    }catch(error){
        res.status(500).json({
            message:"Error fetching interview",
            error:error.message
        });
    }
};

export const finishInterview=async(req,res)=>{
    try{
        const{id}=req.params;
        const{answers}=req.body;

        const interview=await Interview.findOne({
            _id:id,
            userId:req.user.id
        });

        if(!interview){
            return res.status(404).json({
                message:"Interview not found"
            });
        }

        answers.forEach((answer,index)=>{
            interview.questions[index].answer=answer;
        });

        const report=await evaluateInterview(interview.questions);

        report.questions.forEach((item,index)=>{
            interview.questions[index].score=item.score;
            interview.questions[index].feedback=item.feedback;
        });

        interview.overallScore=report.overallScore;
        interview.summary=report.summary;
        interview.strengths=report.strengths;
        interview.improvements=report.improvements;
        interview.status="Completed";

        await interview.save();

        res.status(200).json({
            message:"Interview completed successfully",
            interview
        });

    }catch(error){
        res.status(500).json({
            message:"Error completing interview",
            error:error.message
        });
    }
};