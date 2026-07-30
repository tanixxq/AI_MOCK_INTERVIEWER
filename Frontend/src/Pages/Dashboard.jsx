import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./Dashboard.css";

const Dashboard=()=>{

    const navigate=useNavigate();
    const [user,setUser]=useState(null);

    useEffect(()=>{

        const fetchUser=async()=>{

            const token=localStorage.getItem("token");

            if(!token){
                navigate("/login");
                return;
            }

            try{

                const response=await API.get("/auth/me");

                const currentUser=
                    response.data.user || response.data;

                setUser(currentUser);

            }catch(error){

                console.log(
                    "Dashboard Auth Error:",
                    error
                );

                if(
                    error.response?.status===401 ||
                    error.response?.status===403
                ){

                    localStorage.removeItem("token");
                    navigate("/login");

                }

            }

        };

        fetchUser();

    },[navigate]);


    return(

        <main className="dashboard-container">

            <div className="dashboard-content">

                <section className="welcome-card">

                    <div className="welcome-content">

                        <div className="status-badge">
                            <span className="status-dot"></span>
                            AI Interviewer is ready
                        </div>

                        <h1>
                            Welcome back, {user?.name || "Developer"} 👋
                        </h1>

                        <p>
                            Sharpen your technical interview skills with
                            personalized AI interviews, instant evaluation,
                            and actionable feedback.
                        </p>

                        <button
                            className="start-btn"
                            onClick={()=>navigate("/create-interview")}
                        >
                            Start New Interview
                        </button>

                    </div>

                </section>


                <section className="stats-container">

                    <div className="stat-card stat-primary">

                        <div className="stat-icon">
                            🎯
                        </div>

                        <div className="stat-content">
                            <span className="stat-label">
                                Total Interviews
                            </span>

                            <p>0</p>
                        </div>

                    </div>


                    <div className="stat-card stat-success">

                        <div className="stat-icon">
                            📈
                        </div>

                        <div className="stat-content">
                            <span className="stat-label">
                                Average Score
                            </span>

                            <p>—</p>
                        </div>

                    </div>


                    <div className="stat-card stat-accent">

                        <div className="stat-icon">
                            ⚡
                        </div>

                        <div className="stat-content">
                            <span className="stat-label">
                                Skills Practiced
                            </span>

                            <p>0</p>
                        </div>

                    </div>

                </section>


                <section className="recent-card">

                    <div className="recent-header">

                        <div>

                            <span className="section-eyebrow">
                                YOUR ACTIVITY
                            </span>

                            <h2>
                                Recent Interviews
                            </h2>

                            <p>
                                Your completed interviews will appear here.
                            </p>

                        </div>

                    </div>


                    <div className="empty-state">

                        <div className="empty-icon">
                            ✨
                        </div>

                        <h3>
                            Your interview history starts here
                        </h3>

                        <p>
                            Complete your first AI interview and your
                            performance report will appear here.
                        </p>

                        <button
                            className="empty-action"
                            onClick={()=>navigate("/create-interview")}
                        >
                            Take Your First Interview
                        </button>

                    </div>

                </section>

            </div>

        </main>

    );

};

export default Dashboard;