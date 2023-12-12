import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import Chat from "./pages/Chat/Chat";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import SetAvatar from "./components/setAvatar";

function App() {
  const socket = io(process.env.REACT_APP_NODE_API);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat socket={socket} />} />
        <Route path="/setavatar" element={<SetAvatar />} />
      </Routes>
    </Router>
  );
}

export default App;
