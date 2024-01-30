const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/postTaskGroup");

module.exports.findOne = async (req, res) => {
  const { taskGroupId } = req.params;
  try {
    const group = await findOne(taskGroupId);
    res.status(200).json({ status: "success", data: group });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const groups = await findAll();
    res.status(200).json({ status: "success", data: groups });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { title } = req.body;
  try {
    const group = await saveOne(title);
    res.status(200).json({ status: "success", data: group });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { taskGroupId } = req.params;
  const { title } = req.body;
  try {
    const group = await updateOne(taskGroupId, title);
    res.status(200).json({ status: "success", data: group });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { taskGroupId } = req.params;
  try {
    const group = await deleteOne(taskGroupId);
    res.status(200).json({ status: "success", data: group });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
