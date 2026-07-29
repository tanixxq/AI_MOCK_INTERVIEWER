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

                console.log(error);

            }finally{

                setLoading(false);

            }

        };


        fetchReport();

    },[id]);



    if(loading){

        return(
            <h2>
                Loading Report...
            </h2>
        );

    }


    if(!report){

        return(
            <h2>
                Report not found
            </h2>
        );

    }



    return(

        <div className="report-container">

            <div className="report-card">


                <h1>
                    Interview Report 📊
                </h1>



                <div className="score-card">

                    <h2>
                        Overall Score
                    </h2>


                    <span>
                        {report.overallScore || 0}/10
                    </span>

                </div>




                <div className="summary-section">

                    <h2>
                        Summary
                    </h2>


                    <p>
                        {report.summary || "No summary available"}
                    </p>

                </div>




                <div className="section">

                    <h2>
                        💪 Strengths
                    </h2>


                    <ul>

                        {
                            report.strengths?.map((item,index)=>(

                                <li key={index}>
                                    {item}
                                </li>

                            ))
                        }

                    </ul>

                </div>





                <div className="section">

                    <h2>
                        🚀 Improvements
                    </h2>


                    <ul>

                        {
                            report.improvements?.map((item,index)=>(

                                <li key={index}>
                                    {item}
                                </li>

                            ))
                        }

                    </ul>

                </div>




                <button
                    onClick={()=>navigate("/dashboard")}
                >

                    Back to Dashboard

                </button>



            </div>

        </div>

    );

};


export default Report;