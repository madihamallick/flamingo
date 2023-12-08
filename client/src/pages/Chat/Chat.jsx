import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import robotgif from "../../assets/robot.gif";

const Chat = ({ socket }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [sender, setSender] = useState();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState();

  const userid = sessionStorage.getItem("token");

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    } else {
      const decodedToken = atob(sessionStorage.getItem("token")?.split(".")[1]);

      const userData = JSON.parse(decodedToken);
      setUsername(userData.name);
    }
    fetch(`${process.env.REACT_APP_NODE_API}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          let filtereddata = data.users.filter(
            (data) => data.id !== sessionStorage.getItem("userid")
          );
          setUsers(filtereddata);
        });
      } else {
        res.json().then((error) => {
          console.log(error);
        });
      }
    });
  }, [navigate]);

  useEffect(() => {
    const userid = sessionStorage.getItem("userid");
    socket.emit("add-user", userid);
    socket.on("previous-message", (messages) => {
      const currentUserID = sessionStorage.getItem("userid");

      const filteredMessages = JSON.parse(messages).filter((data) => {
        const isCurrentUserSender =
          data.fromUserId === currentUserID && data.toUserId === sender?.id;

        const isSenderCurrentUser =
          data.fromUserId === sender?.id && data.toUserId === currentUserID;

        return isCurrentUserSender || isSenderCurrentUser;
      });

      const sortedMessages = filteredMessages.sort(
        (a, b) => a.__createdtime__ - b.__createdtime__
      );

      setMessagesReceived(sortedMessages);
    });
    socket.on("chat-message", (toUserId, message, fromUserId) => {
      setMessagesReceived((prevMessages) => [
        ...prevMessages,
        { toUserId, message, fromUserId },
      ]);
    });
    return () => {
      socket.off("chat-message");
      socket.off("previous-messages");
    };
  }, [socket, userid, sender]);

  const sendMessage = () => {
    if (message !== "" && sender !== "") {
      socket.emit("send-chat-message", {
        toUserId: sender.id,
        message,
        fromUserId: sessionStorage.getItem("userid"),
      });
      setMessagesReceived((prevMessages) => [
        ...prevMessages,
        {
          toUserId: sender.id,
          message,
          fromUserId: sessionStorage.getItem("userid"),
        },
      ]);
      setMessage("");
    }
  };
  return (
    <div className="flex h-screen antialiased text-gray-800">
      {messagesReceived &&
        messagesReceived.length > 0 &&
        console.log(messagesReceived)}
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-lemon bg-bluelight h-10 w-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div className="ml-2 font-bold text-2xl">QuickChat</div>
          </div>
          <div className="flex flex-col items-center bg-lemon bg-opacity-60 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            <div className="h-20 w-20 rounded-full border overflow-hidden">
              <img
                src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                alt="Avatar"
                className="h-full w-full"
              />
            </div>
            <div className="text-sm font-semibold mt-2">{username}</div>
            <div className="flex flex-row items-center mt-3">
              <div className="flex flex-col justify-center h-4 w-8 bg-bluelight rounded-full">
                <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
              </div>
              <div className="leading-none ml-1 text-xs">Active</div>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">Active Conversations</span>
              <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                4
              </span>
            </div>
            <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
              {users.map((user, index) => {
                return (
                  <button
                    key={index}
                    className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                    onClick={() => setSender(user)}
                  >
                    <div className="flex items-center justify-center h-8 w-8 text-white bg-bluelight rounded-full">
                      {user.username[0]}
                    </div>
                    <div className="ml-2 text-sm font-semibold">
                      {user.username}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-row items-center justify-between text-xs mt-6">
              <span className="font-bold">Archivied</span>
              <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                7
              </span>
            </div>
            <div className="flex flex-col space-y-1 mt-4 -mx-2">
              <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                <div className="flex items-center justify-center h-8 w-8 bg-bluelight text-white rounded-full">
                  H
                </div>
                <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          {sender ? (
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-bluegrey h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="text-sm text-white font-semibold">
                    Chatting with {sender.username}
                  </div>
                  <div className="grid grid-cols-12 gap-y-2">
                    {messagesReceived.map((message, index) => {
                      return (
                        <React.Fragment key={index}>
                          {message.fromUserId ===
                          sessionStorage.getItem("userid") ? (
                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                              <div className="flex items-center justify-start flex-row-reverse">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-bluelight flex-shrink-0">
                                  A
                                </div>
                                <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                  <div>{message.message}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                              <div className="flex flex-row items-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-bluelight flex-shrink-0">
                                  A
                                </div>
                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                  <div>{message.message}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div>
                  <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <textarea
                      type="text"
                      rows={1}
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-auto py-2"
                    />
                    <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    className="flex items-center justify-center bg-bluelight rounded-xl text-white px-4 py-2 flex-shrink-0"
                    onClick={sendMessage}
                  >
                    <span>Send</span>
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center border-gray-200 border shadow-md rounded-lg">
              <img
                src={robotgif}
                alt="robotgif"
                width={500}
                className="mx-auto"
              />
              <h3 className="text-lg italic text-gray-700 text-center">
                Hello there, click on the user you want to have chit chat with
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
