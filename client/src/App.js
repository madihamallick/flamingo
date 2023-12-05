// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import Chat from "./Pages/Chat/Chat";
import { useEffect } from "react";

function App() {
  const socket = io('http://localhost:4000');

  useEffect(()=>{
    socket.on('chat-message', (msg) => {
      console.log('message: ' + msg);
    })
  },[socket])

  return (
    <div>
      <Chat socket={socket} />
    </div>
  );
}

export default App;
