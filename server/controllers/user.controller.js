import axios from "axios";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const harperRegisterUser = async (req, res) => {
  try {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    const { email, password } = req.body;
    if (!dbUrl || !dbPw) throw new Error("Invalid HarperDB configuration.");

    const checkExistingUserQuery = {
      operation: "search_by_value",
      schema: "flamingo",
      table: "users",
      search_attribute: "email",
      search_value: email,
    };

    const checkExistingUserConfig = {
      method: "post",
      url: dbUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: dbPw,
      },
      data: JSON.stringify(checkExistingUserQuery),
    };

    const response = await axios(checkExistingUserConfig);
    const existingUser = response.data[0];
    if (existingUser) {
      return res.status(400).send({
        message: "User with this email already exists",
      });
    } else {
      const insertUserQuery = {
        operation: "insert",
        schema: "flamingo",
        table: "users",
        records: [{ ...req.body, password: bcryptjs.hashSync(password, 10) }],
      };

      const insertUserConfig = {
        method: "post",
        url: dbUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
        data: JSON.stringify(insertUserQuery),
      };

      const response = await axios(insertUserConfig);
      return res.status(200).send({
        message: "User registered successfully",
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

export const harperLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) throw new Error("Invalid HarperDB configuration.");

    const checkExistingUserQuery = {
      operation: "search_by_value",
      schema: "flamingo",
      table: "users",
      search_attribute: "email",
      search_value: email,
    };

    const checkExistingUserConfig = {
      method: "post",
      url: dbUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: dbPw,
      },
      data: JSON.stringify(checkExistingUserQuery),
    };

    const response = await axios(checkExistingUserConfig);
    const existingUser = response.data[0];
    if (existingUser) {
      const isPasswordValid = bcryptjs.compareSync(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return res.status(400).send({
          message: "Invalid Password",
        });
      } else {
        const token = jwt.sign(
          {
            id: existingUser.id,
            name: existingUser.username,
            email: existingUser.email,
          },
          process.env.JWT_SECRET
        );
        return res.status(200).send({
          message: "User logged in successfully",
          token: token,
          user: existingUser,
        });
      }
    } else {
      return res.status(400).send({
        message: "User with this email doesn't exist",
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

export const harperAllUsers = async (req, res) => {
  try {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) throw new Error("Invalid HarperDB configuration.");

    let data = JSON.stringify({
      operation: "sql",
      sql: `SELECT * FROM flamingo.users`,
    });

    let config = {
      method: "post",
      url: dbUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: dbPw,
      },
      data: data,
    };

    const response = await axios(config);
    return res.status(200).send({
      users: response.data,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

export const harperGetUser = async (req, res) => {
  try {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) throw new Error("Invalid HarperDB configuration.");

    const checkExistingUserQuery = {
      operation: "search_by_value",
      schema: "flamingo",
      table: "users",
      search_attribute: "id",
      search_value: req.params.id,
    };

    const checkExistingUserConfig = {
      method: "post",
      url: dbUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: dbPw,
      },
      data: JSON.stringify(checkExistingUserQuery),
    };

    const response = await axios(checkExistingUserConfig);
    const existingUser = response.data[0];
    if (existingUser) {
      return res.status(200).json({ user: { existingUser } });
    } else {
      return res
        .status(400)
        .json({ message: "No user found with this user id" });
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

export const harperSetAvatar = async (req, res) => {
  try {
    const { image, user } = req.body;
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;

    if (!dbUrl || !dbPw) throw new Error("Invalid HarperDB configuration.");

    const checkExistingUserQuery = {
      operation: "search_by_value",
      schema: "flamingo",
      table: "users",
      search_attribute: "email",
      search_value: user.email,
    };

    const checkExistingUserConfig = {
      method: "post",
      url: dbUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: dbPw,
      },
      data: JSON.stringify(checkExistingUserQuery),
    };

    const response = await axios(checkExistingUserConfig);
    const existingUser = response.data[0];

    if (existingUser) {
      const updateUserQuery = {
        operation: "update",
        schema: "flamingo",
        table: "users",
        records: [
          {
            id: existingUser.id,
            avatarImage: image,
            isAvatarImageSet: true,
          },
        ],
      };

      const updateUserConfig = {
        method: "post",
        url: dbUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: dbPw,
        },
        data: JSON.stringify(updateUserQuery),
      };

      await axios(updateUserConfig);
      return res.status(200).send({
        message: "User avatar updated successfully.",
      });
    } else {
      return res.status(400).send({
        message: "User with this email doesn't exist",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

