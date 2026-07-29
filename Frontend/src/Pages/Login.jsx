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

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        }finally{
            setLoading(false);
        }
    };


    return(
        <div className="login-container">

            <div className="login-card">

                <h1>Welcome Back</h1>

                <p>
                    Login to continue your AI interview practice.
                </p>


                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

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
                        {
                            loading
                            ?"Logging in..."
                            :"Login"
                        }
                    </button>

                </form>


                <p className="register-text">
                    Don't have an account?

                    <span onClick={()=>navigate("/register")}>
                        Register
                    </span>

                </p>

            </div>

        </div>
    );
};

export default Login;