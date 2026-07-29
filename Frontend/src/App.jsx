import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interview from "./Pages/CreateInterview";
import Report from "./Pages/Report";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import CreateInterview from "./Pages/CreateInterview";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-interview" element={<CreateInterview />} />
        <Route path="/register" element={<Register />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/report/:id" element={<Report/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;