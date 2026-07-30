import {useNavigate} from "react-router-dom";
import "./Navbar.css";

const Navbar=()=>{
    const navigate=useNavigate();

    const isLoggedIn=!!localStorage.getItem("token");

    const logout=()=>{
        localStorage.removeItem("token");
        navigate("/login");
    };

    return(
        <nav className="navbar">

            <div
                className="navbar-logo"
                onClick={()=>navigate(isLoggedIn?"/dashboard":"/")}
            >
                🤖 AI Interviewer
            </div>

            <div className="navbar-links">

                <button onClick={()=>navigate("/")}>
                    Home
                </button>

                {isLoggedIn ? (
                    <>
                        <button onClick={()=>navigate("/dashboard")}>
                            Dashboard
                        </button>

                        <button onClick={()=>navigate("/create-interview")}>
                            Start Interview
                        </button>

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={()=>navigate("/login")}>
                            Login
                        </button>

                        <button
                            className="register-btn"
                            onClick={()=>navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                )}

            </div>

        </nav>
    );
};

export default Navbar;