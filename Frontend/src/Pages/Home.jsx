import {useNavigate} from "react-router-dom";
import "./Home.css";

const Home=()=>{
    const navigate=useNavigate();
    const isLoggedIn=!!localStorage.getItem("token");

    return(
        <div className="home-container">

            <div className="hero">

                <h1>
                    {isLoggedIn
                        ?"Welcome Back to AI Mock Interviewer 👋"
                        :"AI Mock Interviewer"}
                </h1>


                <p>
                    {isLoggedIn
                        ?"Continue practicing, take a new interview, and improve your technical interview skills with AI-powered feedback."
                        :"Practice technical interviews with AI, receive instant feedback, and improve your interview skills with detailed performance reports."
                    }
                </p>


                <div className="hero-buttons">

                    {isLoggedIn ? (
                        <>
                            <button onClick={()=>navigate("/dashboard")}>
                                Dashboard
                            </button>

                            <button onClick={()=>navigate("/create-interview")}>
                                Start Interview
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={()=>navigate("/login")}>
                                Login
                            </button>

                            <button onClick={()=>navigate("/register")}>
                                Get Started
                            </button>
                        </>
                    )}

                </div>

            </div>


            <section className="features">

                <div className="feature-card">

                    <h2>
                        AI Generated Questions
                    </h2>

                    <p>
                        Generate personalized interview questions based on
                        your skills, experience, and difficulty level.
                    </p>

                </div>


                <div className="feature-card">

                    <h2>
                        Real Interview Experience
                    </h2>

                    <p>
                        Answer questions one by one just like a real
                        technical interview.
                    </p>

                </div>


                <div className="feature-card">

                    <h2>
                        Detailed Feedback
                    </h2>

                    <p>
                        Receive AI-powered scores, strengths, weaknesses,
                        and improvement suggestions after completing your interview.
                    </p>

                </div>

            </section>

        </div>
    );
};

export default Home;