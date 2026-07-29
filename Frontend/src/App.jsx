import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interview from "./Pages/Interview";
import Report from "./Pages/Report";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/report/:id" element={<Report/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;