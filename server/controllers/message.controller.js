import axios from "axios";

export const harperUserMessage = async (req, res) => {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;

  if (!dbUrl || !dbPw) {
    return res.status(500).send("Invalid HarperDB configuration.");
  }

  const { user, friend, message, timestamp } = req.body;

  try {
    const receiverDataResponse = await axios.post(
      dbUrl,
      {
        operation: "search_by_value",
        schema: "flamingo",
        table: "user_messages",
        search_attribute: "user_id",
        search_value: user.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
      }
    );

    const receiverData = receiverDataResponse.data[0];

    if (receiverData) {
      const existingFriend = receiverData.friends.find(
        (existingFriend) => existingFriend.friend.id === friend.id
      );

      if (existingFriend) {
        existingFriend.last_message = message;
        existingFriend.timestamp = timestamp;
      } else {
        receiverData.friends.push({
          friend: friend,
          last_message: message,
          timestamp: timestamp,
        });
      }

      const updateReceiverQuery = {
        operation: "update",
        schema: "flamingo",
        table: "user_messages",
        records: [receiverData],
      };

      await axios.post(dbUrl, updateReceiverQuery, {
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
      });
    } else {
      const newReceiverUser = {
        user_id: user.id,
        friends: [
          {
            friend: friend,
            last_message: message,
            timestamp: timestamp,
          },
        ],
      };

      const insertReceiverQuery = {
        operation: "insert",
        schema: "flamingo",
        table: "user_messages",
        records: [newReceiverUser],
      };

      await axios.post(dbUrl, insertReceiverQuery, {
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
      });
    }

    const senderDataResponse = await axios.post(
      dbUrl,
      {
        operation: "search_by_value",
        schema: "flamingo",
        table: "user_messages",
        search_attribute: "user_id",
        search_value: friend.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
      }
    );

    const senderData = senderDataResponse.data[0];

    if (senderData) {
      const existingFriend = senderData.friends.find(
        (existingFriend) => existingFriend.friend.id === user.id
      );

      if (!existingFriend) {
        senderData.friends.push({
          friend: user,
          last_message: message,
          timestamp: timestamp,
        });

        const updateSenderQuery = {
          operation: "update",
          schema: "flamingo",
          table: "user_messages",
          records: [senderData],
        };

        await axios.post(dbUrl, updateSenderQuery, {
          headers: {
            "Content-Type": "application/json",
            Authorization: dbPw,
          },
        });
      }
    } else {
      const newSenderUser = {
        user_id: friend.id,
        friends: [
          {
            friend: user,
            last_message: message,
            timestamp: timestamp,
          },
        ],
      };

      const insertSenderQuery = {
        operation: "insert",
        schema: "flamingo",
        table: "user_messages",
        records: [newSenderUser],
      };

      await axios.post(dbUrl, insertSenderQuery, {
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
      });
    }

    return res.status(200).send({
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const harperGetUserMessage = async (req, res) => {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;

  if (!dbUrl || !dbPw) {
    return res.status(500).send("Invalid HarperDB configuration.");
  }

  const { id } = req.params;
  try {
    const userDataResponse = await axios.post(
      dbUrl,
      {
        operation: "search_by_value",
        schema: "flamingo",
        table: "user_messages",
        search_attribute: "user_id",
        search_value: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
      }
    );

    const userData = userDataResponse.data[0];

    if (userData) {
      return res.status(200).send({
        message: "User messages fetched successfully",
        data: userData,
      });
    } else {
      return res.status(400).send({
        message: "Could not find user messages",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
