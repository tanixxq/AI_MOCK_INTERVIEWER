import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const Interview = () => {
    const { id } = useParams();
    const [interview,setInterview] = useState(null);
    const [loading,setLoading] = useState(true);
    const [answer,setAnswer] = useState("");
    const [currentQuestion,setCurrentQuestion] = useState(0);
    const [evaluation,setEvaluation] = useState(null);
    const [submitting,setSubmitting] = useState(false);

    useEffect(()=>{
        const fetchInterview = async()=>{
            try{
                const response = await API.get(`/interviews/${id}`);
                setInterview(response.data.interview);
            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }
        };
        fetchInterview();
    },[id]);

    const submitAnswer = async()=>{
        try{
            setSubmitting(true);

            const response = await API.post(
                `/interviews/${id}/answer`,
                {
                    questionIndex:currentQuestion,
                    answer
                }
            );

            const updatedQuestion = response.data.interview.questions[currentQuestion];

            setEvaluation({
                score:updatedQuestion.score,
                feedback:updatedQuestion.feedback
            });

            setInterview(response.data.interview);

        }catch(error){
            console.log(error);
        }finally{
            setSubmitting(false);
        }
    };

    if(loading || !interview){
        return <h2>Loading interview...</h2>;
    }

    const question = interview.questions[currentQuestion];

    return(
        <div>
            <h1>AI Interview</h1>

            <h3>
                Skills: {interview.skills.join(", ")}
            </h3>

            <h2>
                Question {currentQuestion + 1}/{interview.questions.length}
            </h2>

            <p>{question.question}</p>

            <textarea
                value={answer}
                onChange={(e)=>setAnswer(e.target.value)}
                placeholder="Type your answer..."
                rows="6"
                cols="50"
            />

            <br/>

            <button onClick={submitAnswer} disabled={submitting}>
                {submitting ? "Evaluating..." : "Submit Answer"}
            </button>

            {evaluation && (
                <div>
                    <h2>Score: {evaluation.score}/10</h2>
                    <p>{evaluation.feedback}</p>
                </div>
            )}
        </div>
    )
}

export default Interview;