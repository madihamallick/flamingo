import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import Chat from "./pages/Chat/Chat";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

function App() {
  const socket = io("http://localhost:4000");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
