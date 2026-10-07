const express=require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
router.get("/",(req,res)=>{
    db.query("SELECT * FROM categories",(error,results)=>{
        if(error){
            return res.status(500).json({message: "Database error"});
        }
        res.json(results);
    });
});
router.post("/",verifyToken, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Category name is required"
    });
  }

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Database error"
        });
      }

      res.status(201).json({
        message: "Category created successfully",
        id: results.insertId
      });
    }
  );
});
router.put("/:id",verifyToken, (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Category name is required"
    });
  }

  db.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: "Category not found"
        });
      }

      res.json({
        message: "Category updated successfully"
      });
    }
  );
});
router.delete("/:id",verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM categories WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Cannot delete category"
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: "Category not found"
        });
      }

      res.json({
        message: "Category deleted successfully"
      });
    }
  );
});
module.exports = router;