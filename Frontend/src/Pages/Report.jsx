import {useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./Report.css";

const Report=()=>{

    const {id}=useParams();
    const navigate=useNavigate();

    const [report,setReport]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        const fetchReport=async()=>{

            try{

                const response=await API.get(`/interviews/${id}`);

                setReport(response.data.interview);

            }catch(error){

                console.log("Fetch Report Error:",error);

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
                <p>Generating your report...</p>
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

    const scorePercentage=Math.min(
        Math.max(score,0),
        10
    )*10;


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
                            Your Interview Report
                        </h1>

                        <p>
                            Here's how you performed and where you can improve.
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

                    <div className="score-card">

                        <div className="score-ring">

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
                                {score>=8
                                    ?"Excellent Performance"
                                    :score>=6
                                        ?"Good Performance"
                                        :"Keep Practicing"
                                }
                            </h2>

                            <p>
                                Your overall interview performance based
                                on the AI evaluation.
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
                                            <span>✓</span>
                                            {item}
                                        </li>
                                    )
                                )
                                :
                                <li>
                                    <span>✓</span>
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
                                            <span>→</span>
                                            {item}
                                        </li>
                                    )
                                )
                                :
                                <li>
                                    <span>→</span>
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
                        <span>Needs Improvement</span>
                        <span>Good</span>
                        <span>Excellent</span>
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
                        <span>→</span>
                    </button>

                </div>

            </div>

        </main>

    );

};

export default Report;