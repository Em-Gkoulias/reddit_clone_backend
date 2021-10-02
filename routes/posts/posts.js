const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/:filter", async (req, res) => {
  try {
    if (req.params.filter == "best") {
      const posts = await pool.query(
        "SELECT * FROM post ORDER BY votes_sum DESC;"
      );
      res.status(200).json(posts);
    } else if (req.params.filter == "hot") {
      const posts = await pool.query("SELECT * FROM post ORDER BY comments_sum DESC;");
      res.status(200).json(posts);
    } else if (req.params.filter == "fresh") {
      const posts = await pool.query("SELECT * FROM post ORDER BY id DESC;");
      res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", (req, res) => {
  try {
    const { title, text, person_id } = req.body;
    if (title === "") {
      return res.json({ msg: "you have to provide a title" });
    }
    pool.query(
      "INSERT INTO post (title, text, votes_sum, comments_sum, person_id) VALUES ($1, $2, $3, $4, $5);",
      [title, text, 0, 0, person_id]
    );
    res.json("post created successfully");
  } catch {
    (err) => console.log(err);
  }
});

router.get("/comments/:id", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM post WHERE id = $1", [
      req.params.id,
    ]);
    const post = data.rows[0];
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id/votes", async (req, res) => {
  try {
    await pool.query("UPDATE post SET votes_sum = $1 WHERE id = $2;", [
      req.body.votesSum,
      req.params.id,
    ]);
    res.json({ msg: "votesSum updated" });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id/comments", async (req, res) => {
  try {
    await pool.query("UPDATE post SET comments_sum = $1 WHERE id = $2;", [
      req.body.commentsSum,
      req.params.id,
    ]);
    res.json({ msg: "commentsSum updated" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:postId/votes", (req, res) => {
  const postId = req.params.postId;
  const votes = pool.query("SELECT * FROM vote WHERE post_id = $1", [postId]);
  res.json(votes);
});

router.get("/user/:id", async (req, res) => {
  try {
    const posts = await pool.query("SELECT * FROM post WHERE person_id = $1", [req.params.id])
    res.json(posts.rows);
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

module.exports = router;
