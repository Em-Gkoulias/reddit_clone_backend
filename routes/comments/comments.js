const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await pool.query(
      "SELECT * FROM comment WHERE post_id = $1;",
      [req.params.postId]
    );
    res.json(comments.rows);
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:postId/user/:userId", async (req, res) => {
  try {
    const comments = await pool.query(
      "SELECT * FROM comment WHERE post_id = $1 AND person_id = $2;",
      [req.params.postId, req.params.userId]
    );
    res.json(comments.rows);
  } catch (error) {
    console.log(error);
  }
});

router.post("/post/:postId/user/:userId", async (req, res) => {
  try {
    const { text } = req.body;
    if (text == "") {
      return res.json({msg: "you need to provide a text"})
    }
    await pool.query(
      "INSERT INTO comment (text, votes_sum, person_id, post_id) VALUES ($1, $2, $3, $4);",
      [text, 0, req.params.userId, req.params.postId]
    );
    res.json({ msg: "comment created" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const comments = await pool.query("SELECT * FROM comment WHERE person_id = $1;", [
      req.params.id,
    ]);
    res.json(comments.rows);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
