import {useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./CreateInterview.css";

const CreateInterview=()=>{

    const navigate=useNavigate();

    const [skills,setSkills]=useState("");
    const [experience,setExperience]=useState("");
    const [difficulty,setDifficulty]=useState("Easy");
    const [loading,setLoading]=useState(false);


    const createInterview=async()=>{

        if(!skills || !experience){
            alert("Please fill all fields");
            return;
        }


        try{

            setLoading(true);


            const response=await API.post(
                "/interviews",
                {
                    skills:skills
                    .split(",")
                    .map(skill=>skill.trim()),

                    experience,

                    difficulty
                }
            );


            console.log(
                "Create Interview Response:",
                response.data
            );


            const interview=response.data.interview;


            if(!interview || !interview._id){

                console.log(
                    "Interview ID missing:",
                    response.data
                );

                alert("Interview creation failed");

                return;

            }


            console.log(
                "Created Interview ID:",
                interview._id
            );


            navigate(
                `/interview/${interview._id}`
            );


        }catch(error){

            console.log(
                "Create Interview Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create interview"
            );


        }finally{

            setLoading(false);

        }

    };



    return(

        <div className="create-interview-container">

            <div className="create-interview-card">

                <h1>
                    Create AI Interview 🤖
                </h1>


                <input
                    type="text"
                    placeholder="Skills (React, Node, MongoDB)"
                    value={skills}
                    onChange={(e)=>setSkills(e.target.value)}
                />


                <input
                    type="text"
                    placeholder="Experience (Example: 1 year)"
                    value={experience}
                    onChange={(e)=>setExperience(e.target.value)}
                />


                <select
                    value={difficulty}
                    onChange={(e)=>setDifficulty(e.target.value)}
                >

                    <option value="Easy">
                        Easy
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="Hard">
                        Hard
                    </option>

                </select>


                <button
                    onClick={createInterview}
                    disabled={loading}
                >

                    {
                        loading
                        ?
                        "Generating Questions..."
                        :
                        "Start Interview"
                    }

                </button>


            </div>

        </div>

    );

};


export default CreateInterview;