import {useNavigate,useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import API from "../services/api";

const Interview=()=>{
    const {id}=useParams();
    const navigate=useNavigate();

    const [interview,setInterview]=useState(null);
    const [loading,setLoading]=useState(true);
    const [answer,setAnswer]=useState("");
    const [answers,setAnswers]=useState([]);
    const [currentQuestion,setCurrentQuestion]=useState(0);
    const [submitting,setSubmitting]=useState(false);

    useEffect(()=>{
        const fetchInterview=async()=>{
            try{
                const response=await API.get(`/interviews/${id}`);
                setInterview(response.data.interview);
            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }
        };

        fetchInterview();
    },[id]);

    const nextQuestion=async()=>{
        if(answer.trim()===""){
            alert("Please answer the question.");
            return;
        }

        const updatedAnswers=[...answers];
        updatedAnswers[currentQuestion]=answer;
        setAnswers(updatedAnswers);

        if(currentQuestion<interview.questions.length-1){
            setCurrentQuestion(prev=>prev+1);
            setAnswer(updatedAnswers[currentQuestion+1]||"");
        }else{
            await finishInterview(updatedAnswers);
        }
    };

    const finishInterview=async(updatedAnswers)=>{
        try{
            setSubmitting(true);

            const response=await API.post(
                `/interviews/${id}/finish`,
                {
                    answers:updatedAnswers
                }
            );

            navigate(`/report/${response.data.interview._id}`);

        }catch(error){
            console.log(error);
        }finally{
            setSubmitting(false);
        }
    };

    if(loading||!interview){
        return <h2>Loading interview...</h2>;
    }

    const question=interview.questions[currentQuestion];

    return(
        <div>
            <h1>AI Interview</h1>

            <h3>
                Skills: {interview.skills.join(", ")}
            </h3>

            <h2>
                Question {currentQuestion+1}/{interview.questions.length}
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

            <button onClick={nextQuestion} disabled={submitting}>
                {submitting?"Finishing...":currentQuestion===interview.questions.length-1?"Finish Interview":"Next Question"}
            </button>
        </div>
    );
};

export default Interview;