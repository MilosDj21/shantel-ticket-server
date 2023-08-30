const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Role = require("../models/Role");

module.exports.saveOne = async (req, res) => {
  const { email, firstName, lastName, password, roles } = req.body;
  const profileImage = req.file;
  // console.log(profileImage);
  try {
    const user = await User.signup(email, password, firstName, lastName, roles, profileImage);
    res.status(200).json({ status: "success", data: user, message: "Added Successfully!" });
  } catch (err) {
    if (profileImage) {
      fs.unlink(path.join(__dirname, `../${profileImage.path}`), (error) => {
        if (error) console.log(error);
      });
    }
    res.status(400).json({ status: "failed", message: err.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    const roles = await Role.find();
    const filteredUsers = users.map((u) => {
      const userRoles = [];
      for (ur of u.roles) {
        for (r of roles) {
          if (r._id.toString() === ur) {
            userRoles.push(r.name);
          }
        }
      }
      return {
        _id: u._id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        roles: userRoles,
        profileImage: u.profileImage,
      };
    });
    res.status(200).json({ status: "status", data: filteredUsers });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
