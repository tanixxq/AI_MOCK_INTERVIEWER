import {useNavigate} from "react-router-dom";
import "./Home.css";

const Home=()=>{
    const navigate=useNavigate();

    return(
        <div className="home-container">
            <div className="hero">
                <h1>AI Mock Interviewer</h1>

                <p>
                    Practice technical interviews with AI, receive instant feedback,
                    and improve your interview skills with detailed performance reports.
                </p>

                <div className="hero-buttons">
                    <button onClick={()=>navigate("/login")}>
                        Login
                    </button>

                    <button onClick={()=>navigate("/register")}>
                        Get Started
                    </button>
                </div>
            </div>

            <section className="features">
                <div className="feature-card">
                    <h2>AI Generated Questions</h2>
                    <p>
                        Generate personalized interview questions based on your skills,
                        experience, and difficulty level.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>Real Interview Experience</h2>
                    <p>
                        Answer questions one by one just like a real technical interview.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>Detailed Feedback</h2>
                    <p>
                        Receive AI-powered scores, strengths, weaknesses, and improvement
                        suggestions after completing your interview.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;