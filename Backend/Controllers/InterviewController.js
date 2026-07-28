import { Interview } from "../Models/Interview.js";

export const createInterview = async(req,res)=>{
    try{

        const {
            role,
            experience,
            difficulty
        } = req.body;


        const interview = new Interview({
            userId:req.user.id,
            role,
            experience,
            difficulty
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
}