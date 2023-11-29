import { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

function App() {
  const socket = io.connect("http://localhost:4000", { autoConnect: false });
  const username = "madiha";
  const room = "room";
  const [message, setMessage] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.on("receive_message", (data) => {
      console.log(data);
    });
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
      console.log(messagesReceived);
    });
    return () => {
      socket.disconnect();
      socket.off("receive_message");
      socket.off("last_100_messages");
    };
  }, [socket, messagesReceived]);

  const joinRoom = () => {
    socket.emit("join_room", { username, room });
  };

  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      socket.emit("send_message", { username, room, message, __createdtime__ });
    }
  };

  return (
    <div className="bg-bgcolour h-[100vh]">
      <div className="w-full max-w-xs mx-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="join_room"
            >
              Join Room
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="join_room"
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Join Room"
            />
          </div>
          <button className="btn btn-primary" onClick={sendMessage}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
