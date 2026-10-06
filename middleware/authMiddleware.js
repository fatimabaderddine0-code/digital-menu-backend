const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
    return res.status(401).json({
    message: "Access denied. No token provided."
  });
}
const token = authHeader.split(" ")[1];
jwt.verify(token,process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
  return res.status(403).json({
    message: "Invalid or expired token"
  });
}
req.admin = decoded;
next();

});
}
module.exports=verifyToken;
