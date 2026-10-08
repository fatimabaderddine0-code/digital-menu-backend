const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const imagekit = require("../config/imagekit");
router.get("/", (req, res) => {
  const category = req.query.category;
  const search = req.query.search;

  let sql = "SELECT * FROM menu_items WHERE 1=1";
  const values = [];

  if (search) {
    sql += " AND name LIKE ?";
    values.push(`%${search}%`);
  }

  if (category) {
    sql += " AND category_id = ?";
    values.push(category);
  }

  db.query(sql, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(results);
  });
});
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    const { name, description, price, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: "Name, price and category_id are required",
      });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    try {
      let imageUrl = null;

      if (req.file) {
        const uploadResult = await imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: "/digital-menu",
        });

        imageUrl = uploadResult.url;
      }

      db.query(
        `INSERT INTO menu_items
        (name, description, price, image, category_id)
        VALUES (?, ?, ?, ?, ?)`,
        [
          name,
          description,
          price,
          imageUrl,
          category_id,
        ],
        (error, results) => {
          if (error) {
            return res.status(500).json({
              message: "Database error",
            });
          }

          res.status(201).json({
            message: "Menu item created successfully",
            id: results.insertId,
          });
        }
      );
    } catch (error) {
      console.log("Image upload error:", error);

      res.status(500).json({
        message: "Image upload failed",
      });
    }
  }
);
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    const { name, description, price, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: "Name, price and category_id are required",
      });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    try {
      let imageUrl = null;

      if (req.file) {
        const uploadResult = await imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: "/digital-menu",
        });

        imageUrl = uploadResult.url;
      }

      db.query(
        `INSERT INTO menu_items
        (name, description, price, image, category_id)
        VALUES (?, ?, ?, ?, ?)`,
        [
          name,
          description,
          price,
          imageUrl,
          category_id,
        ],
        (error, results) => {
          if (error) {
            return res.status(500).json({
              message: "Database error",
            });
          }

          res.status(201).json({
            message: "Menu item created successfully",
            id: results.insertId,
          });
        }
      );
    } catch (error) {
      console.log("Image upload error:", error);

      res.status(500).json({
        message: "Image upload failed",
      });
    }
  }
);
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    const id = req.params.id;
    const { name, description, price, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: "Name, price, and category are required",
      });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    try {
      let imageUrl = null;

      if (req.file) {
        const uploadResult = await imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: "/digital-menu",
        });

        imageUrl = uploadResult.url;
      }

      db.query(
        `UPDATE menu_items
         SET name = ?,
             description = ?,
             price = ?,
             category_id = ?,
             image = COALESCE(?, image)
         WHERE id = ?`,
        [
          name,
          description,
          price,
          category_id,
          imageUrl,
          id,
        ],
        (error, results) => {
          if (error) {
            return res.status(500).json({
              message: "Database error",
            });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({
              message: "Menu item not found",
            });
          }

          res.json({
            message: "Menu item updated successfully",
          });
        }
      );
    } catch (error) {
      console.log("Image upload error:", error);

      res.status(500).json({
        message: "Image upload failed",
      });
    }
  }
);
router.delete("/:id",verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM menu_items WHERE id=?",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        message: "Menu item deleted successfully"
      });
    }
  );
});
module.exports=router;