const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");
const { authenticator } = require("otplib");
const qrcode = require("qrcode");

module.exports.findOne = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    const user = await User.findById(userId, { password: 0 }).populate("roles");
    if (!user) throw Error("No such user");
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { searchValue } = req.params;
  try {
    let users = await User.find({}, { password: 0 }).populate("roles");
    if (searchValue) {
      users = users.filter((u) => {
        if (
          u.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          u.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          u.lastName.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    res.status(200).json({ status: "status", data: users });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { email, firstName, lastName, password, roles } = req.body;
  const profileImage = req.file;
  try {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, "Shantel Ticket", secret);
    let imageQr = "";
    qrcode.toDataURL(otpauth, (error, imageUrl) => {
      if (error) {
        console.log(error);
        return;
      }
      imageQr = imageUrl;
    });
    const user = await User.signup(email, password, firstName, lastName, roles, profileImage, secret);
    res.status(200).json({ status: "success", data: imageQr, message: "Added Successfully!" });
  } catch (err) {
    if (profileImage) {
      fs.unlink(path.join(__dirname, `../${profileImage.path}`), (error) => {
        if (error) console.log(error);
      });
    }
    res.status(400).json({ status: "failed", message: err.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { id, email, firstName, lastName, password, roles } = req.body;
  const profileImage = req.file;
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) throw Error("Invalid user id");
    const user = {};
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = password;
    if (roles) user.roles = roles;
    if (profileImage) user.profileImage = profileImage.path;
    const savedUser = await User.modifyOne(id, user);
    res.status(200).json({ status: "success", message: "Updated Successfully" });
  } catch (error) {
    if (profileImage) {
      fs.unlink(path.join(__dirname, `../${profileImage.path}`), (error) => {
        if (error) console.log(error);
      });
    }
    res.status(400).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) throw Error("Invalid user id");
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw Error("Deleting user failed");
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
