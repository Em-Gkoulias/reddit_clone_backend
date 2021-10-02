const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { createTokens, validateTokens } = require("./JWT");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const auth = require("./routes/auth/auth");
const posts = require("./routes/posts/posts")
const users = require("./routes/users/users");
const votes = require("./routes/votes/votes");
const comments = require("./routes/comments/comments");



// ----- middleware -----
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// ----- routes -----
app.use("/auth", auth);
app.use("/posts", posts);
app.use("/users", users);
app.use("/votes", votes);
app.use("/comments", comments);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`)
});
