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

            await API.post("/auth/register",formData);

            alert("Registration successful!");

            navigate("/login");

        }catch(error){
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        }finally{
            setLoading(false);
        }
    };


    return(
        <div className="register-container">

            <div className="register-card">

                <h1>Create Account</h1>

                <p>
                    Join AI Mock Interviewer and start practicing.
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button disabled={loading}>
                        {loading?"Creating Account...":"Register"}
                    </button>

                </form>


                <p className="login-text">
                    Already have an account?
                    <span onClick={()=>navigate("/login")}>
                        Login
                    </span>
                </p>

            </div>

        </div>
    );
};

export default Register;