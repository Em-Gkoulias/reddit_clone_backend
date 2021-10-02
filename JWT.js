const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

const createTokens = (user) => {
  const accessToken = sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );

  return accessToken;
};

const validateTokens = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(400).json({ auth: false, message: "user not authenticated" });
  }
  verify(accessToken, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      return res.status(400).json({error: err})
    } else {
      res.json(decodedToken);
      next();
    }
  })
};

module.exports = { createTokens, validateTokens };
