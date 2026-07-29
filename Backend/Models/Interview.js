import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        skills:{
            type:[String],
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

        summary:{
            type:String,
            default:""
        },

        overallScore:{
            type:Number,
            default:0
        },

        strengths:[
            {
                type:String
            }
        ],

        improvements:[
            {
                type:String
            }
        ],

        reportGenerated:{
            type:Boolean,
            default:false
        },

        questions:[
            {
                question:{
                    type:String,
                    required:true
                },
                answer:{
                    type:String,
                    default:""
                },
                feedback:{
                    type:String,
                    default:""
                },
                score:{
                    type:Number,
                    default:0
                }
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