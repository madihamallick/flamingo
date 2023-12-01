// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import Chat from "./Pages/Chat/Chat";

function App() {
  const socket = io.connect("http://localhost:4000", { autoConnect: false });

  return (
    <div>
      {/* <div className="w-full max-w-xs mx-auto">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
        </div>
      </div> */}
      <Chat socket={socket} />
    </div>
  );
}

export default App;
