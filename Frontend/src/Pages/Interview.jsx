import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const Interview = () => {

    const { id } = useParams();

    const [interview,setInterview] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchInterview = async()=>{

            try{
                const response = await API.get(
                    `/interviews/${id}`
                );

                setInterview(response.data.interview);

            }catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        };

        fetchInterview();

    },[id]);


    if(loading || !interview){
        return <h2>Loading interview...</h2>
    }


    return(
        <div>
            <h1>AI Interview</h1>

            <h3>
                Skills:
                {interview.skills.join(", ")}
            </h3>

            <div>
                <h2>
                    Question 1
                </h2>

                <p>
                    {interview.questions[0].question}
                </p>
            </div>

        </div>
    )
}

export default Interview;