import {useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../Services/api.js";
import "./Register.css";

const Register=()=>{

    const navigate=useNavigate();

    const [formData,setFormData]=useState({
        name:"",
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
                "/auth/register",
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
                "Registration failed. Please try again."
            );

        }finally{

            setLoading(false);

        }

    };

    return(

        <main className="register-container">

            <div className="register-glow register-glow-left"></div>
            <div className="register-glow register-glow-right"></div>

            <section className="register-card">

                <div className="register-header">

                    <span className="register-badge">
                        AI INTERVIEWER
                    </span>

                    <h1>
                        Create Your Account
                    </h1>

                    <p>
                        Start practicing smarter with AI-powered interviews.
                    </p>

                </div>


                {error && (

                    <div className="register-error">

                        <span>!</span>

                        {error}

                    </div>

                )}


                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <div className="register-field">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="register-field">

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


                    <div className="register-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        className="register-btn"
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ?"Creating account..."
                            :"Create Account"
                        }

                        {!loading && <span>→</span>}

                    </button>

                </form>


                <div className="register-divider">
                    <span>or</span>
                </div>


                <p className="login-text">

                    Already have an account?

                    <span onClick={()=>navigate("/login")}>
                        Sign in
                    </span>

                </p>

            </section>

        </main>
    );

};

export default Register;