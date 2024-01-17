//only admin can access this
module.exports.findOne = async (req, res) => {
  res.status(200).json({ message: "find one admin project" });
};
module.exports.findAll = async (req, res) => {};
module.exports.saveOne = async (req, res) => {};
module.exports.updateOne = async (req, res) => {};
module.exports.deleteOne = async (req, res) => {};

//controllers for specific user projects
module.exports.findOneByUser = async (req, res) => {
  res.status(200).json({ message: "find one user project" });
};
module.exports.findAllByUser = async (req, res) => {};
module.exports.saveOneByUser = async (req, res) => {};
module.exports.updateOneByUser = async (req, res) => {};
