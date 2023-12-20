import React, { useContext } from "react";
import { SocketContext } from "../SocketContext";

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);
  return (
    <div className="flex justify-center gap-8 flex-col md:flex-row h-screen mt-10">
      {stream && (
        <div className="bg-white border-2 w-[22rem] h-[22rem]">
          <h2 className="text-md">{name || "Name"}</h2>
          <video muted ref={myVideo} autoPlay />
        </div>
      )}

      {callAccepted && !callEnded && (
        <div className="bg-white border-2 w-[22rem] h-[22rem]">
          <h2 className="text-md">{call?.name || "Name"}</h2>
          <video muted ref={userVideo} autoPlay />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
