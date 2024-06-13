import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ChatBot from "./components/ChatBot"
import Ai from "./components/Ai"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chatbot" element={<ChatBot />}/>
          <Route path="/ai" element={<Ai />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;