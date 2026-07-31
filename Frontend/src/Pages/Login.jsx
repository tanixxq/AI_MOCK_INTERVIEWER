import {useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./Login.css";

const Login=()=>{

    const navigate=useNavigate();

    const [formData,setFormData]=useState({
        email:"",
        password:""
    });

    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{

            setLoading(true);
            setError("");

            const response=await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        }catch(error){


            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );

        }finally{

            setLoading(false);

        }

    };

    return(

        <main className="login-container">

            <div className="login-glow login-glow-left"></div>
            <div className="login-glow login-glow-right"></div>

            <section className="login-card">

                <div className="login-header">

                    <span className="login-badge">
                        AI INTERVIEWER
                    </span>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to continue your interview practice.
                    </p>

                </div>


                {error && (

                    <div className="login-error">
                        <span>!</span>
                        {error}
                    </div>

                )}


                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="login-field">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="login-field">

                        <div className="password-label">

                            <label htmlFor="password">
                                Password
                            </label>

                        </div>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ?"Signing in..."
                            :"Sign In"
                        }

                        {!loading && <span>→</span>}

                    </button>

                </form>


                <div className="login-divider">
                    <span>or</span>
                </div>


                <p className="register-text">

                    Don't have an account?

                    <span onClick={()=>navigate("/register")}>
                        Create one
                    </span>

                </p>

            </section>

        </main>
    );

};

export default Login;