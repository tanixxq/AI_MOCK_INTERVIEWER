import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interview from "./Pages/Interview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/interview/:id" element={<Interview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;