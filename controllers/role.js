const fs = require("fs");
const path = require("path");
const Role = require("../models/Role");
const mongoose = require("mongoose");

module.exports.findOne = async (req, res) => {
  const roleId = req.params.roleId;
  try {
    if (!roleId || !mongoose.Types.ObjectId.isValid(roleId)) throw Error("Invalid role id");
    const role = await Role.findById(roleId);
    if (!role) throw Error("No such role");
    res.status(200).json({ status: "success", data: role });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ status: "success", data: roles });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};
