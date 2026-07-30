import {BrowserRouter,Routes,Route} from "react-router-dom";
import "./styles/theme.css";
import Report from "./Pages/Report";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Interview from "./Pages/Interview";
import CreateInterview from "./Pages/CreateInterview";
import Navbar from "./Components/Navbar";


function App(){

    return(
        <BrowserRouter>
         <Navbar/>
            <Routes>

                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/create-interview" element={<CreateInterview/>}/>
                <Route path="/interview/:id" element={<Interview/>}/>
                <Route path="/report/:id" element={<Report/>}/>

            </Routes>
        </BrowserRouter>
    );

}

export default App;