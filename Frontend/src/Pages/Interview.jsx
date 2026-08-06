import {useNavigate,useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import API from "../Services/api.js";
import useSpeechRecognition from "../Hooks/SpeechRecognition";
import "./Interview.css";

const Interview=()=>{

    const {id}=useParams();
    const navigate=useNavigate();

    const [interview,setInterview]=useState(null);
    const [spokenQuestion,setSpokenQuestion]=useState(false);
    const [loading,setLoading]=useState(true);
    const [answer,setAnswer]=useState("");
    const [answers,setAnswers]=useState([]);
    const [currentQuestion,setCurrentQuestion]=useState(0);
    const [submitting,setSubmitting]=useState(false);
    const [savingAnswer,setSavingAnswer]=useState(false);
    const [answerSaved,setAnswerSaved]=useState(false);
    const [reviewing,setReviewing]=useState(false);

    const {
        text,
        listening,
        startListening,
        stopListening,
        setText
    }=useSpeechRecognition();


    useEffect(()=>{

        const fetchInterview=async()=>{

            try{

                const response=await API.get(`/interviews/${id}`);

                const currentInterview=response.data.interview;


                if(currentInterview.status==="Completed"){

                    navigate(
                        `/report/${currentInterview._id}`,
                        {replace:true}
                    );

                    return;

                }


                setInterview(currentInterview);


                const savedAnswers=currentInterview.questions.map(
                    question=>question.answer||""
                );


                setAnswers(savedAnswers);


            }catch(error){

                console.log(error);

            }finally{

                setLoading(false);

            }

        };


        fetchInterview();

    },[id,navigate]);



    const speakQuestion=(question)=>{

        console.log("Speaking:",question);
    
    
        const speech=new SpeechSynthesisUtterance(question);
    
    
        speech.rate=0.9;
        speech.pitch=1;
        speech.volume=1;
    
    
        const voices=window.speechSynthesis.getVoices();
    
        if(voices.length){
    
            speech.voice=voices.find(
                voice=>voice.lang.includes("en")
            ) || voices[0];
    
        }
    
    
        speech.onstart=()=>{
    
            console.log("AI started speaking");
    
        };
    
    
        speech.onend=()=>{
    
            console.log("AI finished speaking");
    
    
            setText("");
    
            startListening();
    
        };
    
    
        speech.onerror=(error)=>{
    
            console.log("Speech error:",error);
    
        };
    
    
        setTimeout(()=>{
    
            window.speechSynthesis.speak(speech);
    
        },500);
    
    };

    useEffect(()=>{

        if(interview && !spokenQuestion){
    
            setSpokenQuestion(true);
    
            speakQuestion(
                interview.questions[currentQuestion].question
            );
    
        }
    
    },[interview,currentQuestion,spokenQuestion]);



    useEffect(()=>{

        if(!listening && text.trim()){

            handleAnswerFinished(text);

        }

    },[listening]);



    const handleAnswerFinished=async(transcript)=>{

        stopListening();


        setAnswer(transcript);


        setReviewing(true);



        try{

            const updatedAnswers=[...answers];

            updatedAnswers[currentQuestion]=transcript;


            setAnswers(updatedAnswers);



            await API.patch(
                `/interviews/${id}/answers`,
                {
                    questionIndex:currentQuestion,
                    answer:transcript
                }
            );



            const feedback=
            "Good answer. Try adding more technical explanation and practical examples. Let's move to the next question.";



            const speech=new SpeechSynthesisUtterance(feedback);


            speech.rate=0.9;


            speech.onend=()=>{

                setReviewing(false);


                moveNext(updatedAnswers);

            };


            window.speechSynthesis.speak(speech);



        }catch(error){

            console.log(error);

        }

    };



    const moveNext=(updatedAnswers)=>{


        if(currentQuestion < interview.questions.length-1){


            const nextIndex=currentQuestion+1;


            setCurrentQuestion(nextIndex);
            setSpokenQuestion(false);


            setText("");

            setAnswerSaved(false);



        }else{

            finishInterview(updatedAnswers);

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


            navigate(
                `/report/${response.data.interview._id}`,
                {
                    replace:true
                }
            );


        }catch(error){

            console.log(error);

        }finally{

            setSubmitting(false);

        }

    };



    if(loading){

        return(

            <div className="interview-loading">

                <div className="loading-spinner"></div>

                <p>
                    Preparing your interview...
                </p>

            </div>

        );

    }



    if(!interview){

        return(

            <div className="interview-message">

                <h2>
                    Interview not found
                </h2>

            </div>

        );

    }



    const question=
    interview.questions[currentQuestion];


    const totalQuestions=
    interview.questions.length;


    const progress=
    ((currentQuestion+1)/totalQuestions)*100;



    return(

        <main className="interview-container">


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

                        />


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





                <div className="voice-status">


                    {

                        reviewing

                        ?

                        "🤖 Reviewing your answer..."

                        :

                        listening

                        ?

                        "🎤 Listening..."

                        :

                        "🔊 AI Speaking..."

                    }


                </div>




                <div className="interview-footer">


                    <span className="question-tip">

                        AI will automatically continue after your answer.

                    </span>


                </div>



            </section>


        </main>

    );

};


export default Interview;