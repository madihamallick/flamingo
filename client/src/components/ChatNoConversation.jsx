import React from "react";

const ChatNoConversation = ({robotgif}) => {
  return (
    <div className="flex h-full flex-col justify-center border-gray-200 border shadow-md rounded-lg">
      <img src={robotgif} alt="robotgif" width={500} className="mx-auto" />
      <h3 className="text-lg italic text-gray-700 text-center">
        Hello there, search for the user you want to have chit chat with
      </h3>
    </div>
  );
};

export default ChatNoConversation;
