const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");
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
router.post("/",verifyToken,upload.single("image"),(req,res)=>{
    const {name,description,price,category_id} = req.body;
    if(!name|| !price || !category_id){
        return res.status(400).json({
            message:"Name,price and category_id are required"

        });
    }
    if (isNaN(price) || Number(price) <= 0) {
       return res.status(400).json({
       message: "Price must be a positive number"
  });
}
    const image = req.file ? req.file.filename : null;
    db.query(
        "INSERT INTO menu_items(name,description,price,image,category_id) VALUES (?,?,?,?,?)",
         [name,description,price,image,category_id],(error,results)=>{
            if(error){
                return res.status(500).json({message:"Database error"})
            }
            res.status(201).json({message :" Menu item created successfully",
                id: results.insertId
            });
         }
    );
});
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    const id = req.params.id;

    console.log("PUT BODY:", req.body);
    console.log("PUT FILE:", req.file);

    const {
      name,
      description,
      price,
      category_id
    } = req.body || {};
    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: "Name, price, and category are required"
      });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number"
      });
    }

    const image = req.file
      ? req.file.filename
      : null;

    db.query(
      `UPDATE menu_items
       SET name=?,
           description=?,
           price=?,
           category_id=?,
           image=COALESCE(?, image)
       WHERE id=?`,
      [
        name,
        description,
        price,
        category_id,
        image,
        id
      ],
      (error, results) => {
        if (error) {
          return res.status(500).json({
            message: "Database error"
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            message: "Menu item not found"
          });
        }

        res.json({
          message: "Menu item updated successfully"
        });
      }
    );
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