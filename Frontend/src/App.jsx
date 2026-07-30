import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import "./styles/Theme.css";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoutes";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import CreateInterview from "./Pages/CreateInterview";
import Interview from "./Pages/Interview";
import Report from "./Pages/Report";

const PublicRoute=({children})=>{
    const token=localStorage.getItem("token");

    if(token){
        return <Navigate to="/dashboard" replace/>;
    }

    return children;
};

function App(){
    return(
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
                <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
                <Route path="/create-interview" element={<ProtectedRoute><CreateInterview/></ProtectedRoute>}/>
                <Route path="/interview/:id" element={<ProtectedRoute><Interview/></ProtectedRoute>}/>
                <Route path="/report/:id" element={<ProtectedRoute><Report/></ProtectedRoute>}/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;