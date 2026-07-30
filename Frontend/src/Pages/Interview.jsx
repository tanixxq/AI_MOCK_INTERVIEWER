import {useNavigate,useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import API from "../Services/api.js";
import "./Interview.css";

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

            if(!id){

                console.log("Interview ID missing");
                setLoading(false);

                return;

            }

            try{

                const response=await API.get(`/interviews/${id}`);

                setInterview(response.data.interview);

                const savedAnswers=response.data.interview.questions.map(
                    question=>question.answer || ""
                );

                setAnswers(savedAnswers);

            }catch(error){

                console.log(
                    "Fetch Interview Error:",
                    error
                );

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

        if(currentQuestion < interview.questions.length-1){

            setCurrentQuestion(prev=>prev+1);

            setAnswer(
                updatedAnswers[currentQuestion+1] || ""
            );

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

            console.log(
                "Interview Completed:",
                response.data
            );

            navigate(
                `/report/${response.data.interview._id}`
            );

        }catch(error){

            console.log(
                "Finish Interview Error:",
                error
            );

            alert("Failed to finish interview");

        }finally{

            setSubmitting(false);

        }

    };


    if(loading){

        return(
            <div className="interview-loading">
                <div className="loading-spinner"></div>
                <p>Preparing your interview...</p>
            </div>
        );

    }


    if(!id){

        return(
            <div className="interview-message">
                <h2>Invalid interview link</h2>
            </div>
        );

    }


    if(!interview){

        return(
            <div className="interview-message">
                <h2>Interview not found</h2>
            </div>
        );

    }


    const question=interview.questions[currentQuestion];

    if(!question){

        return(
            <div className="interview-message">
                <h2>No question available</h2>
            </div>
        );

    }


    const totalQuestions=interview.questions.length;

    const progress=((currentQuestion+1)/totalQuestions)*100;

    const isLastQuestion=
        currentQuestion===totalQuestions-1;


    return(

        <main className="interview-container">

            <div className="interview-background-glow interview-glow-one"></div>
            <div className="interview-background-glow interview-glow-two"></div>


            <section className="interview-card">

                <div className="interview-header">

                    <div>

                        <span className="interview-badge">
                            LIVE AI INTERVIEW
                        </span>

                        <h1>
                            Technical Interview
                        </h1>

                    </div>

                    <div className="question-counter">
                        {currentQuestion+1}
                        <span>
                            /{totalQuestions}
                        </span>
                    </div>

                </div>


                <div className="progress-section">

                    <div className="progress-info">

                        <span>
                            Interview Progress
                        </span>

                        <span>
                            {Math.round(progress)}%
                        </span>

                    </div>


                    <div className="progress-track">

                        <div
                            className="progress-bar"
                            style={{
                                width:`${progress}%`
                            }}
                        ></div>

                    </div>

                </div>


                <div className="interview-meta">

                    <span className="skill-label">
                        Skills
                    </span>

                    <div className="skill-list">

                        {interview.skills.map(
                            (skill,index)=>(
                                <span
                                    className="skill-tag"
                                    key={index}
                                >
                                    {skill}
                                </span>
                            )
                        )}

                    </div>

                </div>


                <div className="question-section">

                    <span className="question-label">
                        QUESTION {currentQuestion+1}
                    </span>

                    <h2 className="question">
                        {question.question}
                    </h2>

                </div>


                <div className="answer-section">

                    <label htmlFor="answer">
                        Your Answer
                    </label>

                    <textarea
                        id="answer"
                        className="answer-box"
                        value={answer}
                        onChange={(e)=>setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows="7"
                    />

                    <div className="answer-hint">
                        Take your time and explain your reasoning clearly.
                    </div>

                </div>


                <div className="interview-footer">

                    <span className="question-tip">
                        {isLastQuestion
                            ?"This is your final question."
                            :"Answer this question to continue."
                        }
                    </span>


                    <button
                        className="submit-btn"
                        onClick={nextQuestion}
                        disabled={submitting}
                    >

                        {submitting
                            ?"Generating Report..."
                            :isLastQuestion
                                ?"Finish Interview"
                                :"Next Question"
                        }

                        {!submitting && (
                            <span className="button-arrow">
                                →
                            </span>
                        )}

                    </button>

                </div>

            </section>

        </main>

    );

};

export default Interview;