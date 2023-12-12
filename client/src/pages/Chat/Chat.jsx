import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import robotgif from "../../assets/robot.gif";
import ChatConversation from "../../components/ChatConversation";
import ChatNoConversation from "../../components/ChatNoConversation";

const ADD_USER_EVENT = "add-user";
const PREVIOUS_MESSAGE_EVENT = "previous-message";
const CHAT_MESSAGE = "chat-message";
const SEND_CHAT_MESSAGE = "send-chat-message";

const Chat = ({ socket }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [message, setMessage] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [sender, setSender] = useState();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState();
  const [friends, setFriends] = useState();
  const [searchuser, setSearchuser] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = JSON.parse(sessionStorage.getItem("user"))?.id;

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
          let filtereddata = data?.users?.filter((data) => data.id !== userid);
          setUsers(filtereddata);
        });
      } else {
        res.json().then((error) => {
          console.log(error);
        });
      }
    });

    fetch(`${process.env.REACT_APP_NODE_API}/message/${userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setFriends(data?.data?.friends);
        });
      } else {
        res.json().then((error) => {
          console.log(error);
        });
      }
    });
  }, [navigate, userid]);

  useEffect(() => {
    socket.emit(ADD_USER_EVENT, userid);
    socket.on(PREVIOUS_MESSAGE_EVENT, (messages) => {
      const filteredMessages = JSON.parse(messages).filter((data) => {
        const isCurrentUserSender =
          data.fromUserId === userid && data.toUserId === sender?.id;

        const isSenderCurrentUser =
          data.fromUserId === sender?.id && data.toUserId === userid;

        return isCurrentUserSender || isSenderCurrentUser;
      });
      const sortedMessages = filteredMessages.sort(
        (a, b) => a.__createdtime__ - b.__createdtime__
      );

      setMessagesReceived(sortedMessages);
    });

    socket.on(CHAT_MESSAGE, (toUserId, message, fromUserId) => {
      setMessagesReceived((prevMessages) => [
        ...prevMessages,
        { toUserId, message, fromUserId },
      ]);
    });
    return () => {
      socket.off(CHAT_MESSAGE);
      socket.off(PREVIOUS_MESSAGE_EVENT);
    };
  }, [socket, userid, sender]);

  const sendMessage = () => {
    if (message !== "" && sender !== "") {
      socket.emit(SEND_CHAT_MESSAGE, {
        toUserId: sender?.id,
        message,
        fromUserId: user?.id,
      });

      setFriends((prevFriends) => {
        const isFriendExists =
          Array.isArray(prevFriends) &&
          prevFriends.some(
            (friend) => friend.friend.username === sender.username
          );

        // If friend does not exists in the user list
        if (!isFriendExists) {
          return [
            ...(prevFriends || []),
            {
              friend: sender,
              last_message: message,
              timestamp: Date.now(),
            },
          ];
        }

        // If friend is already there in the users friend list just update
        // we return a new object with updated data and for other friends, we return them as they are
        return (prevFriends || []).map((friend) =>
          friend.friend.username === sender.username
            ? {
                ...friend,
                last_message: message,
                timestamp: Date.now(),
              }
            : friend
        );
      });

      fetch(`${process.env.REACT_APP_NODE_API}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          friend: sender,
          message: message,
          timestamp: Date.now(),
        }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
          });
        } else {
          res.json().then((error) => {
            console.log(error);
          });
        }
      });
      setMessagesReceived((prevMessages) => [
        ...prevMessages,
        {
          toUserId: sender.id,
          message,
          fromUserId: user?.id,
        },
      ]);
      setMessage("");
    }
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
      setSearchuser(
        users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setSearchuser([]);
    }
  };

  const handleAddFriend = (friend) => {
    setSearchuser([]);
    setSender(friend);
    inputRef.current.value = "";
  };

  return (
    <div className="flex h-screen antialiased text-gray-800">
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
          {console.log(user, user.isAvatarImageSet)}
          <div className="flex flex-col items-center bg-lemon bg-opacity-60 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            <div className="h-20 w-20 rounded-full border overflow-hidden">
              {user.isAvatarImageSet === true ? (
               <img src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="avatarimage" />

              ) : (
                <img
                  src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                  alt="Avatar"
                  className="h-full w-full"
                />
              )}
            </div>
            <div className="text-sm font-semibold mt-2">{username}</div>
            <div className="flex flex-row items-center mt-3">
              <div className="flex flex-col justify-center h-4 w-8 bg-bluelight rounded-full">
                <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
              </div>
              <div className="leading-none ml-1 text-xs">Active</div>
            </div>
          </div>
          <div className="flex flex-col mt-16">
            <div className="flex items-center">
              <div className="flex border border-purple-200 rounded relative">
                <input
                  type="text"
                  ref={inputRef}
                  onChange={(e) => handleInputChange(e)}
                  className="block w-full px-4 text-sm py-2 bg-white border rounded-md focus:border-bluelight focus:ring-bluelight focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Search by name..."
                />
                <button className="px-4 absolute right-0 top-0 bottom-0 flex items-center justify-center">
                  <svg
                    className="svg-icon search-icon"
                    aria-labelledby="title desc"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 19.9 19.7"
                  >
                    <title id="title">Search Icon</title>
                    <g className="search-path" fill="none" stroke="#848F91">
                      <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
                      <circle cx="8" cy="8" r="7" />
                    </g>
                  </svg>
                </button>
                {searchuser && searchuser.length > 0 && (
                  <div className="absolute z-10 mt-10 bg-white border border-gray-300 rounded w-full">
                    {searchuser.map((user, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddFriend(user)}
                      >
                        {user.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row items-center justify-between text-xs mt-10">
              <span className="font-bold">Active Conversations</span>
              <span className="flex items-center justify-center bg-gray-300 h-5 w-5 rounded-full">
                {friends ? friends.length : 0}
              </span>
            </div>
            <div className="flex flex-col space-y-1 mt-4 -mx-2 max-h-72 overflow-y-scroll custom-scrollbar">
              {friends &&
                friends.map((user, index) => {
                  return (
                    <button
                      key={index}
                      className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                      onClick={() => setSender(user.friend)}
                    >
                      <div className="flex items-center justify-center h-8 w-8 text-white bg-bluelight rounded-full">
                        {user?.friend.username[0]}
                      </div>
                      <div className="flex flex-col justify-start items-start">
                        <div className="ml-2 text-sm font-semibold">
                          {user?.friend.username}
                        </div>
                        <div
                          className="ml-2 text-[12px] text-gray-400 overflow-hidden "
                          style={{
                            maxWidth: "10rem",
                          }}
                        >
                          {user?.last_message}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          {sender ? (
            <ChatConversation
              sender={sender}
              user={user}
              messagesReceived={messagesReceived}
              setMessage={setMessage}
              sendMessage={sendMessage}
              message={message}
            />
          ) : (
            <ChatNoConversation robotgif={robotgif} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
