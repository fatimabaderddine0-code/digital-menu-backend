const express=require("express");
const router = express.Router();
const db = require("../config/db");
router.get("/",(req,res)=>{
    db.query("SELECT * FROM categories",(error,results)=>{
        if(error){
            return res.status(500).json({message: "Database error"});
        }
        res.json(results);
    });
});
module.exports = router;