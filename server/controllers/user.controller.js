import axios from "axios";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const harperRegisterUser = (req, res) => {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  const { email, password } = req.body;
  if (!dbUrl || !dbPw) return Promise.reject("Invalid HarperDB configuration.");

  const checkExistingUserQuery = {
    operation: "search_by_value",
    schema: "flamingo",
    table: "users",
    search_attribute: "email",
    search_value: email,
  };

  var checkExistingUserConfig = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPw,
    },
    data: JSON.stringify(checkExistingUserQuery),
  };

  axios(checkExistingUserConfig)
    .then(function (response) {
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

        var insertUserConfig = {
          method: "post",
          url: dbUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: dbPw,
          },
          data: JSON.stringify(insertUserQuery),
        };

        axios(insertUserConfig).then(function (response) {
          return res.status(200).send({
            message: "User registered successfully",
          });
        });
      }
    })
    .catch(function (error) {
      return res.status(400).send({
        message: error,
      });
    });
};

export const harperLoginUser = (req, res) => {
  const { email, password } = req.body;
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return Promise.reject("Invalid HarperDB configuration.");

  const checkExistingUserQuery = {
    operation: "search_by_value",
    schema: "flamingo",
    table: "users",
    search_attribute: "email",
    search_value: email,
  };

  var checkExistingUserConfig = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPw,
    },
    data: JSON.stringify(checkExistingUserQuery),
  };

  axios(checkExistingUserConfig)
    .then(function (response) {
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
    })
    .catch(function (error) {
      return res.status(400).send({
        message: error,
      });
    });
};

export const harperAllUsers = (req, res) => {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return Promise.reject("Invalid HarperDB configuration.");

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

  axios(config)
    .then(function (response) {
      return res.status(200).send({
        users: response.data,
      });
    })
    .catch(function (error) {
      return res.status(400).send({
        message: error,
      });
    });
};

export const harperGetUser = async (req, res) => {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return Promise.reject("Invalid HarperDB configuration.");

  const checkExistingUserQuery = {
    operation: "search_by_value",
    schema: "flamingo",
    table: "users",
    search_attribute: "id",
    search_value: req.params.id,
  };

  var checkExistingUserConfig = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPw,
    },
    data: JSON.stringify(checkExistingUserQuery),
  };

  axios(checkExistingUserConfig).then(function (response) {
    const existingUser = response.data[0];
    if (existingUser) {
      return res.status(200).json({ user: { existingUser } });
    } else {
      return res
        .status(400)
        .json({ message: "No user found with this user id" });
    }
  });
};

export const harperSetAvatar = (req, res) => {
  const { image, user } = req.body;
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;

  if (!dbUrl || !dbPw) {
    return res.status(500).send({
      message: "Invalid HarperDB configuration.",
    });
  }

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

  axios(checkExistingUserConfig)
    .then(function (response) {
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

        axios(updateUserConfig)
          .then(function () {
            return res.status(200).send({
              message: "User avatar updated successfully.",
            });
          })
          .catch(function (error) {
            return res.status(500).send({
              message: error,
            });
          });
      } else {
        return res.status(400).send({
          message: "User with this email doesn't exist",
        });
      }
    })
    .catch(function (error) {
      return res.status(500).send({
        message: error,
      });
    });
};
