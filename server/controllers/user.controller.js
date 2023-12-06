import axios from "axios";
import bcryptjs from "bcryptjs";

export const harperRegisterUser = (req, res) => {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  const checkExistingUserQuery = {
    operation: "search_by_value",
    schema: "flamingo",
    table: "users",
    search_attribute: "email",
    search_value: req.body.email,
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
          records: [
            { ...req.body, password: bcryptjs.hashSync(req.body.password, 10) },
          ],
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
