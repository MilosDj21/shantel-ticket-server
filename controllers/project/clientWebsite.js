const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/clientWebsite");

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
  const { url, status, client } = req.body;
  try {
    const websiteObj = {};
    if (url) websiteObj.url = url;
    if (client) websiteObj.client = client;
    websiteObj.status = "Neproveren";
    websiteObj.lastCheckedAt = new Date();
    const website = await saveOne(websiteObj);
    res.status(200).json({ status: "success", data: website });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { websiteId } = req.params;
  const { url, status, client, lastCheckedAt } = req.body;
  try {
    const websiteObj = {};
    if (url) websiteObj.url = url;
    if (status) websiteObj.status = status;
    if (client) websiteObj.client = client;
    if (lastCheckedAt) websiteObj.lastCheckedAt = new Date();
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
