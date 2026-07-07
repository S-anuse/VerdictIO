const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  if (!req.headers.authorization)
    return res.status(401).json({ message: "Token is undefined" });
  const parts = req.headers.authorization.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  if (parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }
  let token = parts[1];
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid" });
  }
}
module.exports = isLoggedIn;
