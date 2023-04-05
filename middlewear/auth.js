const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (req.user) {
    next();
    return;
  }

  const authHeader = req.header("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { auth };



