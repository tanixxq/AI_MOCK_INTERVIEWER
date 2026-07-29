import { Interview } from "../Models/Interview.js";
import { generateInterviewQuestions, evaluateAnswer } from "../Services/aiServices.js";


export const createInterview = async (req, res) => {
    try {
        const {
            skills,
            experience,
            difficulty
        } = req.body;

        const questions = await generateInterviewQuestions(
            skills,
            difficulty,
            experience
        );

        const formattedQuestions = questions.map((question) => ({
            question,
            answer:"",
            feedback:""
        }))

        const interview = new Interview({
            userId: req.user.id,
            skills,
            experience,
            difficulty,
            questions: formattedQuestions
        });

        await interview.save();

        res.status(201).json({
            message: "Interview created successfully",
            interview
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating interview",
            error: error.message
        });
    }
};

export const getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const interview = await Interview.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.status(200).json({
            interview
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching interview",
            error: error.message
        });
    }
};

export const SubmitAnswer = async (req,res)=>{
    try{
        const {id} = req.params;
        const {questionIndex,answer}=req.body;

        const interview = await Interview.findOne({
            _id:id,
            userId:req.user.id
        })
        if(!interview){
            return res.status(404).json({
                message:"Interview not found"
            })
        }
        if(
            questionIndex<0 ||
            questionIndex>=interview.questions.length
        ) {
            return res.status(400).json({
                message:"Invalid question index"
            })
        }
        interview.questions[questionIndex].answer = answer;

        const evaluation = await evaluateAnswer(
            interview.questions[questionIndex].question,answer);

        interview.questions[questionIndex].feedback = evaluation.feedback;
        interview.questions[questionIndex].score = evaluation.score;

        const isCompleted = interview.questions.every(
            (question) => question.answer && question.answer.trim().length > 0
        );
        if(isCompleted){
            interview.status = "Completed";
        }

        await interview.save();

        res.status(200).json({
            message:"Answer submitted successfully",
            interview
        })

    }catch(error){
        res.status(500).json({
            message:"Error submitting answer",
            error:error.message
        })
    }
}