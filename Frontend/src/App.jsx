import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interview from "./Pages/Interview";
import Report from "./Pages/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/report/:id" element={<Report/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;