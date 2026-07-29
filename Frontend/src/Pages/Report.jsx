import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import API from "../Services/api.js";

const Report=()=>{
    const {id}=useParams();
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

    if(loading || !report){
        return <h2>Loading Report...</h2>;
    }

    return(
        <div>
            <h1>Interview Report</h1>

            <h2>Overall Score: {report.overallScore}/10</h2>

            <p>{report.summary}</p>

            <h2>Strengths</h2>

            <ul>
                {report.strengths.map((item,index)=>(
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>Improvements</h2>

            <ul>
                {report.improvements.map((item,index)=>(
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default Report;