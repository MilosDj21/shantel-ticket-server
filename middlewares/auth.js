require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err.message);
        res.status(401).json({ error: "Unauthorized" });
      } else {
        // console.log(decodedToken);
        req.userId = decodedToken.id;
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Missing token" });
  }
};

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(403).json({ error: "Unauthorized" });
  }
  const adminRoles = await Role.find().or([{ name: "Admin" }, { name: "Super Admin" }]);
  if (user.roles.includes(adminRoles[0]._id.toString()) || user.roles.includes(adminRoles[1]._id.toString())) {
    next();
  } else {
    res.status(403).json({ error: "Require Admin role" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
