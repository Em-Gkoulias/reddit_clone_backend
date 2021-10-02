const express = require("express");
const router = express.Router();
const pool = require("../../db");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const imageName = req.body.name;
    cb(null, `${imageName}.jpg`);
  },
});
const upload = multer({ storage: storage });



router.get("/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM person;");
    res.json(users.rows);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await pool.query("SELECT * FROM person WHERE id = $1;", [id]);
    const user = data.rows[0];
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const { imageName, about } = req.body;
    await pool.query(
      "UPDATE person SET image = $1, about = $2 WHERE id = $3;",
      [imageName, about, id]
    );
    res.json({ msg: "profile updated succesfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/images", upload.single("file"), (req, res) => {
  res.json({msg: "image uploaded"})
})

module.exports = router;
