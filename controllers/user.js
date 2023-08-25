const fs = require("fs");
const path = require("path");
const User = require("../models/User");

module.exports.saveOne = async (req, res) => {
  const { email, firstName, lastName, password, roles } = req.body;
  const profileImage = req.file;
  try {
    const user = await User.signup(email, password, firstName, lastName, roles, profileImage);
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    fs.unlink(path.join(__dirname, `../${profileImage.path}`), (error) => {
      if (error) console.log(error);
    });
    res.status(400).json({ status: "failed", message: err.message });
  }
};
