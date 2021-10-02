const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/post/:postId/:userId", async (req, res) => {
  try {
    const votes = await pool.query("SELECT * FROM vote WHERE post_id = $1;", [
      req.params.postId,
    ]);
    const user = await pool.query("SELECT * FROM person WHERE id = $1;", [req.params.userId]);
    let isUpvoted = false;
    let isDownvoted = false;
    // let votesSum = 0;
    votes.rows.map((vote) => {
      if (vote.value === "up") {
        if (vote.person_id == user.rows[0].id) {
          isUpvoted = true;
        }
      } else {
        if (vote.person_id == user.rows[0].id) {
          isDownvoted = true;
        }
      }
    });
    res.json({ votes, isUpvoted, isDownvoted });
  } catch (error) {
    console.log(error);
  }
});

router.post("/post/:id", async (req, res) => {
  try {
    const { value, personId, postId } = req.body;
    await pool.query(
      "INSERT INTO vote (value, person_id, post_id) VALUES ($1, $2, $3);",
      [value, personId, postId]
    );
    res.json({msg: "vote submitted"});
  } catch (error) {
    console.log(error);
  }
});

router.delete("/post/:postId/:userId", async (req, res) => {
  try {
    const vote = await pool.query("SELECT * FROM vote WHERE post_id = $1 AND person_id = $2;", [req.params.postId, req.params.userId]);
    await pool.query("DELETE FROM vote WHERE id = $1;", [vote.rows[0].id]);
    res.json({msg: "vote deleted succesfully"})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
