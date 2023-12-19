require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err.message);
        res.status(401).json({ message: "Unauthorized" });
      } else {
        // console.log(decodedToken);
        req.userId = decodedToken.id;
      }
    });
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        res.status(401).json({ message: "Invalid User" });
      } else {
        next();
      }
    } catch (error) {
      res.status(401).json({ message: "Invalid User" });
      console.log(error);
    }
  } else {
    res.status(401).json({ message: "Please Login To Continue" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw Error("Invalid User");

    const adminRoles = await Role.find().or([{ name: "Admin" }, { name: "Super Admin" }]);
    if (user.roles.includes(adminRoles[0]._id.toString()) || user.roles.includes(adminRoles[1]._id.toString())) {
      next();
    } else {
      throw Error("Require Admin role");
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
