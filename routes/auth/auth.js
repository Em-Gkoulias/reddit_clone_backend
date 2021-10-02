const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../../db");
const { createTokens, validateTokens } = require("../../JWT");

// ----- routes -----
router.get("/authenticated", validateTokens, (req, res) => {
  // res.json({ auth: true, message: "user authenticated" });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username == "" || email == "" || password == "") {
      return res.json({msg: "please fill all the fields in order to register in our app"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO person (username, email, password, about, image) VALUES ($1, $2, $3, NULL, NULL);",
      [username, email, hashedPassword]
    );
    res.json("register-succesfully");
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await pool.query("SELECT * FROM person WHERE email=$1;", [
      email,
    ]);
    if (data.rows.length == 0) {
      return res.json({msg: "wrong credentials, please try again"});
    }
    const user = data.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json("wrong credentials");
    }

    const accessToken = createTokens(user);

    res.cookie("access-token", accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    res.json("logged in");
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  return res
    .clearCookie("access-token")
    .status(200)
    .json({ msg: "Successfully logged out!" });
});

module.exports = router;
