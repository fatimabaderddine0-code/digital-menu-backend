const express=require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
router.get("/", (req, res) => {
  db.query("SELECT * FROM site_sections", (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    const id = req.params.id;

    const image = req.file
      ? req.file.filename
      : null;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    db.query(
      "UPDATE site_sections SET image = ? WHERE id = ?",
      [image, id],
      (error, results) => {
        if (error) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            message: "Section not found",
          });
        }

        res.json({
          message: "Section image updated successfully",
          image: image,
        });
      }
    );
  }
);

module.exports = router;