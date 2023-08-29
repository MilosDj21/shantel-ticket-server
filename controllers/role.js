const fs = require("fs");
const path = require("path");
const Role = require("../models/Role");

module.exports.findAll = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ status: "success", data: roles });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};
