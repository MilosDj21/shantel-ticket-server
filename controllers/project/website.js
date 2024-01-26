const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/website");

module.exports.findOne = async (req, res) => {
  const { websiteId } = req.params;
  try {
    const website = await findOne(websiteId);
    res.status(200).json({ status: "success", data: website });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { searchValue } = req.params;
  try {
    const websites = await findAll(searchValue);
    res.status(200).json({ status: "success", data: websites });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { url, category } = req.body;
  try {
    const website = await saveOne(url, category);
    res.status(200).json({ status: "success", data: website });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { websiteId } = req.params;
  const { url, category } = req.body;
  try {
    const websiteObj = {};
    if (url) websiteObj.url = url;
    if (category) websiteObj.category = category;
    const website = await updateOne(websiteId, websiteObj);
    res.status(200).json({ status: "success", data: website });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { websiteId } = req.params;
  try {
    const website = await deleteOne(websiteId);
    res.status(200).json({ status: "success", data: website });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
