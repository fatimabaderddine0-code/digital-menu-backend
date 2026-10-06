const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("BODY:", req.body);

  db.query(
    "SELECT * FROM admins WHERE email = ?",
    [email],
    (error, results) => {
      console.log("Results:", results);

      if (error) {
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const admin = results[0];

      const passwordMatch = bcrypt.compareSync(
        password,
        admin.password
      );

      console.log("Admin found:", admin.email);
      console.log("Password match:", passwordMatch);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      res.json({
        message: "Login successful",
        token: token
      });
    }
  );
});

module.exports = router;