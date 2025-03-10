require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          // console.log(err.message);
          throw Error("Invalid token");
        } else {
          // console.log(decodedToken);
          req.userId = decodedToken.id;
        }
      });
      const user = await User.findById(req.userId).populate("roles");
      if (!user) throw Error("Invalid User");

      req.userRoles = [];
      for (const role of user.roles) {
        req.userRoles.push(role.name);
      }
      if (req.userRoles.includes("Admin") || req.userRoles.includes("Super Admin")) req.userIsAdmin = true;
    } else {
      throw Error("Missing token");
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    console.log(error);
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
