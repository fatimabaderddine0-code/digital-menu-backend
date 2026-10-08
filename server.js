const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const app = express();
const categoryRoutes = require("./routes/categoryRoutes");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/categories",categoryRoutes);
app.use("/api/items",itemRoutes);
app.use("/api/sections", sectionRoutes);
app.use((error, req, res, next) => {
  console.log("SERVER ERROR:", error);

  res.status(500).json({
    message: error.message
  });
});
app.use("/uploads",express.static("uploads"));
app.get("/",(req,res)=>{
    res.send("Digital Menu Backend is running");
});
app.use("/api/auth",authRoutes);
const PORT = process.env.PORT || 5000;
db.connect((error) => {
  if (error) {
    console.log("Database connection failed:",error);
  } else {
    console.log("Connected to MySQL database");
  }
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});