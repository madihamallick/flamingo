import axios from "axios";

function harperSaveMessage(message, toUserId, fromUserId, toUserSocketId) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return Promise.reject("Invalid HarperDB configuration.");

  var data = JSON.stringify({
    operation: "insert",
    schema: "flamingo",
    table: "messages",
    records: [
      {
        message,
        toUserId,
        fromUserId,
        toUserSocketId
      },
    ],
  });

  var config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPw,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export default harperSaveMessage;