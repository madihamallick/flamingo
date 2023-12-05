import axios from "axios";

function harperRegisterUser(
  username,
  email,
  password,
  isAvatarImageSet,
  avatarImage
) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  var data = JSON.stringify({
    operation: "insert",
    schema: "flamingo",
    table: "users",
    records: [
      {
        username,
        email,
        password,
        isAvatarImageSet,
        avatarImage,
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

export default harperRegisterUser;

// const token = jwt.sign(
//   { id: user._id, name: user.name, role: user.role },
//   process.env.JWT_SECRET
// )
// return res.json({
//   token,
// })

// const isPasswordValid = bcryptjs.compareSync(password, user.password)
// newUser.password = bcryptjs.hashSync(req.body.password, 10)
