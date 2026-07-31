import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./Dashboard.css";

const Dashboard=()=>{
    const navigate=useNavigate();
    const [user,setUser]=useState(null);
    const [interviews,setInterviews]=useState([]);
    const [loading,setLoading]=useState(true);
    const [showAll,setShowAll]=useState(false);

    useEffect(()=>{
        const fetchDashboard=async()=>{
            const token=localStorage.getItem("token");

            if(!token){
                navigate("/login");
                return;
            }

            try{
                const userResponse=await API.get("/auth/me");
                const interviewResponse=await API.get("/interviews/my");

                setUser(
                    userResponse.data.user||
                    userResponse.data
                );

                setInterviews(
                    interviewResponse.data.interviews||[]
                );
            }catch(error){
                if(
                    error.response?.status===401||
                    error.response?.status===403
                ){
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }finally{
                setLoading(false);
            }
        };

        fetchDashboard();
    },[navigate]);

    const totalInterviews=interviews.length;

    const averageScore=totalInterviews
        ?
        (
            interviews.reduce(
                (total,interview)=>total+(interview.overallScore||0),
                0
            )/totalInterviews
        ).toFixed(1)
        :
        "—";

    const uniqueSkills=[
        ...new Set(
            interviews.flatMap(
                interview=>interview.skills||[]
            )
        )
    ];

    const visibleInterviews=showAll
        ?interviews
        :interviews.slice(0,5);

    const formatDate=(date)=>{
        if(!date){
            return "Date unavailable";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day:"numeric",
                month:"short",
                year:"numeric"
            }
        );
    };

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
                            Welcome back, {user?.name||"Developer"} 👋
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
                        <div className="stat-icon">🎯</div>

                        <div className="stat-content">
                            <span className="stat-label">
                                Total Interviews
                            </span>

                            <p>
                                {loading?"...":totalInterviews}
                            </p>
                        </div>
                    </div>

                    <div className="stat-card stat-success">
                        <div className="stat-icon">📈</div>

                        <div className="stat-content">
                            <span className="stat-label">
                                Average Score
                            </span>

                            <p>
                                {
                                    loading
                                    ?"..."
                                    :averageScore==="—"
                                        ?"—"
                                        :`${averageScore}/10`
                                }
                            </p>
                        </div>
                    </div>

                    <div className="stat-card stat-accent">
                        <div className="stat-icon">⚡</div>

                        <div className="stat-content">
                            <span className="stat-label">
                                Skills Practiced
                            </span>

                            <p>
                                {loading?"...":uniqueSkills.length}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="recent-card">
                    <div className="recent-header">
                        <div>
                            <span className="section-eyebrow">
                                YOUR ACTIVITY
                            </span>

                            <h2>Interview History</h2>

                            <p>
                                Review your previous interview performance.
                            </p>
                        </div>

                        {interviews.length>5&&(
                            <button
                                className="view-all-btn"
                                onClick={()=>setShowAll(!showAll)}
                            >
                                {showAll
                                    ?"Show Less"
                                    :"View All"
                                }
                            </button>
                        )}
                    </div>

                    {loading?(
                        <div className="empty-state">
                            <div className="loading-spinner"></div>

                            <p>
                                Loading interview history...
                            </p>
                        </div>
                    ):interviews.length===0?(
                        <div className="empty-state">
                            <div className="empty-icon">✨</div>

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
                    ):(
                        <div className="interview-history">
                            {visibleInterviews.map((interview)=>(
                                <div
                                    className="history-item"
                                    key={interview._id}
                                >
                                    <div className="history-info">
                                        <h3>
                                            {interview.skills?.join(" + ")}
                                        </h3>

                                        <div className="history-meta">
                                            <span>
                                                {interview.difficulty}
                                            </span>

                                            <span>
                                                {interview.experience}
                                            </span>

                                            <span>
                                                {formatDate(
                                                    interview.completedAt||
                                                    interview.createdAt
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="history-score">
                                        <strong>
                                            {interview.overallScore}/10
                                        </strong>

                                        <button
                                            onClick={()=>
                                                navigate(
                                                    `/report/${interview._id}`
                                                )
                                            }
                                        >
                                            View Report →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Dashboard;