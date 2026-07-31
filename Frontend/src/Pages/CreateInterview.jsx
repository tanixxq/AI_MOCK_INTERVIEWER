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
        const cleanedSkills=[...new Set(
            skills
                .split(",")
                .map(skill=>skill.trim())
                .filter(Boolean)
        )];

        if(cleanedSkills.length===0){
            alert("Please enter at least one skill");
            return;
        }

        if(cleanedSkills.length>10){
            alert("You can enter up to 10 skills");
            return;
        }

        if(!experience.trim()){
            alert("Please enter your experience");
            return;
        }

        if(!["Easy","Medium","Hard"].includes(difficulty)){
            alert("Please select a valid difficulty");
            return;
        }

        try{
            setLoading(true);

            const response=await API.post(
                "/interviews",
                {
                    skills:cleanedSkills,
                    experience:experience.trim(),
                    difficulty
                }
            );

            const interview=response.data.interview;

            if(!interview?._id){
                throw new Error("Interview ID missing from server response");
            }

            navigate(`/interview/${interview._id}`);
        }catch(error){
            

            alert(
                error.response?.data?.message||
                error.message||
                "Failed to create interview"
            );
        }finally{
            setLoading(false);
        }
    };

    return(
        <main className="create-interview-page">
            <section className="create-interview-card">
                <div className="create-interview-header">
                    <span className="create-interview-badge">
                        AI INTERVIEW
                    </span>

                    <h1>Build Your Interview</h1>

                    <p>
                        Choose your skills, experience, and difficulty.
                        Our AI will generate a personalized technical interview.
                    </p>
                </div>

                <div className="create-interview-form">
                    <div className="form-group">
                        <label htmlFor="skills">Skills</label>

                        <input
                            id="skills"
                            type="text"
                            placeholder="React, Node.js, MongoDB"
                            value={skills}
                            onChange={(e)=>setSkills(e.target.value)}
                        />

                        <span className="field-hint">
                            Separate multiple skills with commas.
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="experience">Experience</label>

                        <input
                            id="experience"
                            type="text"
                            placeholder="Example: Fresher or 1 year"
                            value={experience}
                            onChange={(e)=>setExperience(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="difficulty">Difficulty</label>

                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e)=>setDifficulty(e.target.value)}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <button
                        className="generate-btn"
                        onClick={createInterview}
                        disabled={loading}
                    >
                        {loading
                            ?"Generating Interview..."
                            :"Generate Interview"
                        }
                    </button>
                </div>

                <div className="create-interview-footer">
                    <div>
                        <strong>10</strong>
                        <span>AI Questions</span>
                    </div>

                    <div>
                        <strong>AI</strong>
                        <span>Instant Evaluation</span>
                    </div>

                    <div>
                        <strong>1</strong>
                        <span>Detailed Report</span>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CreateInterview;