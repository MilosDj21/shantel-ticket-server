const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/client");

module.exports.findOne = async (req, res) => {
  const { clientId } = req.params;
  try {
    const client = await findOne(clientId);
    res.status(200).json({ status: "success", data: client });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { searchValue } = req.params;
  try {
    const clients = await findAll(searchValue);
    res.status(200).json({ status: "success", data: clients });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { email } = req.body;
  const { userId } = req;
  try {
    const client = await saveOne(email, userId);
    res.status(200).json({ status: "success", data: client });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { clientId } = req.params;
  const { email, user } = req.body;
  try {
    const clientObj = {};
    if (email) clientObj.email = email;
    if (user) clientObj.user = user;
    const client = await updateOne(clientId, clientObj);
    res.status(200).json({ status: "success", data: client });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { clientId } = req.params;
  try {
    const client = await deleteOne(clientId);
    res.status(200).json({ status: "success", data: client });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
