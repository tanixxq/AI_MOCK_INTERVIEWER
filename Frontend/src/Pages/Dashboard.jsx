import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./Dashboard.css";

const Dashboard=()=>{

    const navigate=useNavigate();

    const [user,setUser]=useState(null);

    useEffect(()=>{

        const fetchUser=async()=>{

            try{
                const response=await API.get("/auth/me");
                setUser(response.data.user);

            }catch(error){
                console.log(error);

                localStorage.removeItem("token");
                navigate("/login");
            }

        };

        fetchUser();

    },[navigate]);


    const logout=()=>{

        localStorage.removeItem("token");

        navigate("/login");

    };


    return(

        <div className="dashboard-container">

            <nav className="dashboard-nav">

                <h2>
                    AI Interviewer
                </h2>

                <button onClick={logout}>
                    Logout
                </button>

            </nav>


            <main className="dashboard-content">


                <section className="welcome-card">

                    <h1>
                        Welcome back {user?.name || "User"} 👋
                    </h1>

                    <p>
                        Practice technical interviews and improve your skills with AI feedback.
                    </p>


                    <button
                        className="start-btn"
                        onClick={()=>navigate("/create-interview")}
                    >
                        Start New Interview
                    </button>

                </section>



                <section className="stats-container">

                    <div className="stat-card">

                        <h3>
                            Interviews
                        </h3>

                        <p>
                            0
                        </p>

                    </div>


                    <div className="stat-card">

                        <h3>
                            Average Score
                        </h3>

                        <p>
                            -
                        </p>

                    </div>


                    <div className="stat-card">

                        <h3>
                            Skill Growth
                        </h3>

                        <p>
                            -
                        </p>

                    </div>


                </section>



                <section className="recent-card">

                    <h2>
                        Recent Interviews
                    </h2>

                    <p>
                        Your completed interviews will appear here.
                    </p>

                </section>


            </main>


        </div>

    );

};


export default Dashboard;