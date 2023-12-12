import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!sessionStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}/?apikey=UdlrGSevLPapKE`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const { data } = await axios.post(
        `${process.env.REACT_APP_NODE_API}/user/setavatar`,
        {
          image: avatars[selectedAvatar],
          user: user,
        }
      );

      if (data.message === "User avatar updated successfully.") {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        toast.success("Avatar added successfully", toastOptions);
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center flex-col h-screen bg-bgcolour text-white">
          <img src={loader} alt="loader" className="max-w-full" />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col h-screen bg-bgcolour text-white">
          <div className="title-container mb-8">
            <h1 className="text-3xl font-bold">
              Pick an Avatar as your profile picture
            </h1>
          </div>
          <div className="flex gap-10">
            {avatars.map((avatar, index) => (
              <div
                key={avatar}
                className={`border-4 border-transparent p-4 rounded-full cursor-pointer transition duration-500 ${
                  selectedAvatar === index ? "border-white" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  className="h-24"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-bluelight py-3 px-4 mt-10 text-bgcolour rounded-md shadow-lg shadow-bluegrey"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
