import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "semantic-ui-react";

const WordChallenge = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const [mainword, setMainword] = useState("");
  const [guessword, setGuessword] = useState("");
  const [difference, setDifference] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWord = () => {
      axios.get("https://random-word-api.herokuapp.com/word").then((res) => {
        setMainword(res.data[0]);
      });
    };
    fetchWord();
  }, []);

  const wordDistance = (str1, str2) => {
    setLoading(true);

    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    let m = [];
    let l1 = str1.length;
    let l2 = str2.length;

    for (let i = 0; i <= l1; i++) {
      m[i] = [i];
    }

    for (let j = 0; j <= l2; j++) {
      m[0][j] = j;
    }

    for (let i = 1; i <= l1; i++)
      for (let j = 1; j <= l2; j++) {
        if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
          m[i][j] = m[i - 1][j - 1];
        } else {
          let min = Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1]);
          m[i][j] = min + 1;
        }
      }

    const distance = m[l1][l2];
    console.log("distance", distance);
    const maxLength = Math.max(guessword.length, mainword.length);
    const percentageDifference = ((maxLength - distance) / maxLength) * 100;

    setDifference(percentageDifference);

    console.log(percentageDifference);
    console.log(mainword);

    setLoading(false);

    return;
  };

  return (
    <div>
      <h1 className="text-4xl text-gray-800 font-bold text-center py-10">
        Word Challenge
      </h1>
      <div className="flex w-full my-10 mx-10 rounded bg-white justify-center">
        <input
          className=" w-96 border-2 rounded-md px-4 py-1 text-gray-800 outline-none focus:outline-none "
          type="search"
          value={guessword}
          name="search"
          placeholder="Search..."
          onChange={(e) => setGuessword(e.target.value)}
        />
        <button
          type="submit"
          className="m-2 rounded bg-blue-600 px-4 py-2 text-white"
          onClick={() => wordDistance(guessword, mainword)}
        >
          <svg
            className="fill-current h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            xmlSpace="preserve"
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
      </div>
      {!loading && difference && (
        <div className="mt-4 mx-10 md:mx-48">
          <Progress percent={Math.min(difference, 100)} indicating />
        </div>
      )}
    </div>
  );
};

export default WordChallenge;
