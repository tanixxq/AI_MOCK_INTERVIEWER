import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        role:{
            type:String,
            required:true
        },

        experience:{
            type:String,
            required:true
        },

        difficulty:{
            type:String,
            required:true,
            enum:["Easy","Medium","Hard"]
        },

        status:{
            type:String,
            default:"Started"
        },

        questions:[
            {
                question:String,
                answer:String,
                feedback:String
            }
        ]

    },
    {
        timestamps:true
    }
);

export const Interview = mongoose.model(
    "Interview",
    interviewSchema
);