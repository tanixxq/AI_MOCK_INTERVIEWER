import {useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./Report.css";

const Report=()=>{

    const {id}=useParams();
    const navigate=useNavigate();

    const [report,setReport]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);


    useEffect(()=>{

        const fetchReport=async()=>{

            try{

                const response=await API.get(`/interviews/${id}`);

                setReport(response.data.interview);

            }catch(error){

                console.error(
                    "Fetch Report Error:",
                    error.message
                );

                setError(true);

            }finally{

                setLoading(false);

            }

        };

        fetchReport();

    },[id]);


    if(loading){

        return(
            <main className="report-loading">

                <div className="report-spinner"></div>

                <p>
                    Generating your report...
                </p>

            </main>
        );

    }


    if(error){

        return(
            <main className="report-error">

                <div className="report-error-icon">
                    !
                </div>

                <h2>
                    Unable to load report
                </h2>

                <p>
                    Something went wrong while fetching your interview analysis.
                </p>

                <button
                    onClick={()=>navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

            </main>
        );

    }


    if(!report){

        return(
            <main className="report-error">

                <div className="report-error-icon">
                    !
                </div>

                <h2>
                    Report not found
                </h2>

                <p>
                    We couldn't find the interview report you're looking for.
                </p>

                <button
                    onClick={()=>navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

            </main>
        );

    }


    const score=Number(report.overallScore)||0;

    const isTechnical=report.type==="Technical";

    const scorePercentage=
        Math.min(Math.max(score,0),10)*10;


    return(

        <main className="report-container">

            <div className="report-glow report-glow-one"></div>
            <div className="report-glow report-glow-two"></div>


            <div className="report-page">


                <header className="report-header">

                    <div>

                        <span className="report-badge">
                            INTERVIEW COMPLETED
                        </span>


                        <h1>

                            {
                                isTechnical
                                ?
                                "💻 Technical Interview Report"
                                :
                                "💬 Behavioural Interview Report"
                            }

                        </h1>


                        <p>

                            {
                                isTechnical
                                ?
                                "Your technical knowledge, problem-solving ability, and skills were evaluated."
                                :
                                "Your communication, teamwork, and workplace behaviour were evaluated."
                            }

                        </p>


                    </div>


                    <button
                        className="dashboard-btn"
                        onClick={()=>navigate("/dashboard")}
                    >
                        Dashboard
                    </button>


                </header>



                <section className="report-top">


                    <div className="interview-info-card">


                        <span className="section-eyebrow">
                            INTERVIEW DETAILS
                        </span>


                        <h2>
                            {report.type} Interview
                        </h2>



                        {
                            isTechnical && report.skills?.length>0 &&

                            <div className="skill-list">

                                {
                                    report.skills.map(
                                        (skill,index)=>(

                                            <span
                                                key={index}
                                                className="skill-tag"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )
                                }

                            </div>

                        }



                        <div className="report-meta">

                            <span>
                                Difficulty: {report.difficulty || "N/A"}
                            </span>


                            <span>
                                Experience: {report.experience || "N/A"}
                            </span>


                        </div>


                    </div>




                    <div className="score-card">


                        <div
                            className="score-ring"
                            style={{
                                "--score":scorePercentage
                            }}
                        >

                            <div className="score-ring-inner">

                                <strong>
                                    {score}
                                </strong>

                                <span>
                                    /10
                                </span>

                            </div>

                        </div>




                        <div className="score-details">


                            <span className="score-label">
                                OVERALL SCORE
                            </span>


                            <h2>

                                {
                                    score>=8
                                    ?
                                    "Excellent Performance"
                                    :
                                    score>=6
                                    ?
                                    "Good Performance"
                                    :
                                    "Keep Practicing"
                                }

                            </h2>


                            <p>
                                Your overall interview performance based on the AI evaluation.
                            </p>


                        </div>


                    </div>




                    <div className="summary-card">


                        <span className="section-eyebrow">
                            AI SUMMARY
                        </span>


                        <h2>
                            Performance Overview
                        </h2>


                        <p>
                            {report.summary || "No summary available."}
                        </p>


                    </div>


                </section>





                <section className="feedback-grid">


                    <div className="feedback-card strengths-card">


                        <div className="feedback-heading">

                            <div className="feedback-icon">
                                ✓
                            </div>


                            <div>

                                <span>
                                    WHAT YOU DID WELL
                                </span>


                                <h2>
                                    Strengths
                                </h2>

                            </div>

                        </div>



                        <ul>

                            {
                                report.strengths?.length
                                ?
                                report.strengths.map(
                                    (item,index)=>(

                                        <li key={index}>

                                            <span>
                                                ✓
                                            </span>

                                            {item}

                                        </li>

                                    )
                                )
                                :
                                <li>

                                    <span>
                                        ✓
                                    </span>

                                    No strengths available.

                                </li>

                            }

                        </ul>


                    </div>





                    <div className="feedback-card improvements-card">


                        <div className="feedback-heading">

                            <div className="feedback-icon">
                                ↑
                            </div>


                            <div>

                                <span>
                                    WHERE TO IMPROVE
                                </span>


                                <h2>
                                    Improvements
                                </h2>


                            </div>


                        </div>




                        <ul>

                            {
                                report.improvements?.length
                                ?
                                report.improvements.map(
                                    (item,index)=>(

                                        <li key={index}>

                                            <span>
                                                →
                                            </span>

                                            {item}

                                        </li>

                                    )
                                )
                                :
                                <li>

                                    <span>
                                        →
                                    </span>

                                    No improvement suggestions available.

                                </li>

                            }

                        </ul>


                    </div>


                </section>





                <section className="performance-bar-card">


                    <div className="performance-heading">


                        <div>

                            <span className="section-eyebrow">
                                PERFORMANCE
                            </span>


                            <h2>
                                Overall Score
                            </h2>


                        </div>



                        <strong>
                            {score}/10
                        </strong>


                    </div>




                    <div className="performance-track">


                        <div
                            className="performance-fill"
                            style={{
                                width:`${scorePercentage}%`
                            }}
                        ></div>


                    </div>




                    <div className="performance-labels">

                        <span>
                            Needs Improvement
                        </span>


                        <span>
                            Good
                        </span>


                        <span>
                            Excellent
                        </span>


                    </div>


                </section>





                <div className="report-actions">


                    <button
                        className="secondary-btn"
                        onClick={()=>navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>




                    <button
                        className="primary-btn"
                        onClick={()=>navigate("/create-interview")}
                    >
                        Take Another Interview

                        <span>
                            →
                        </span>

                    </button>


                </div>


            </div>


        </main>

    );

};


export default Report;
