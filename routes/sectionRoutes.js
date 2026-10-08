const express=require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const imagekit = require("../config/imagekit");
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
  async (req, res) => {
    const id = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    try {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/site-sections",
      });

      const imageUrl = uploadResult.url;

      db.query(
        "UPDATE site_sections SET image = ? WHERE id = ?",
        [imageUrl, id],
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
            image: imageUrl,
          });
        }
      );
    } catch (error) {
      console.log("Section image upload error:", error);

      res.status(500).json({
        message: "Image upload failed",
      });
    }
  }
);
module.exports = router;