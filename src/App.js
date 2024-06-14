import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ChatBot from "./components/ChatBot"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<ChatBot />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;