const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/clientLink");

module.exports.findOne = async (req, res) => {
  const { linkId } = req.params;
  try {
    const link = await findOne(linkId);
    res.status(200).json({ status: "success", data: link });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { searchValue } = req.params;
  try {
    const links = await findAll(searchValue);
    res.status(200).json({ status: "success", data: links });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { url, clientWebsite } = req.body;
  try {
    const linkObj = {};
    if (url) linkObj.url = url;
    if (clientWebsite) linkObj.clientWebsite = clientWebsite;
    const link = await saveOne(linkObj);
    res.status(200).json({ status: "success", data: link });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { linkId } = req.params;
  const { url, clientWebsite } = req.body;
  try {
    const linkObj = {};
    if (url) linkObj.url = url;
    if (clientWebsite) linkObj.clientWebsite = clientWebsite;
    const link = await updateOne(linkId, linkObj);
    res.status(200).json({ status: "success", data: link });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { linkId } = req.params;
  try {
    const link = await deleteOne(linkId);
    res.status(200).json({ status: "success", data: link });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
