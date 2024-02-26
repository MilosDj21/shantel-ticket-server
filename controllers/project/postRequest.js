const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../services/project/postRequest");

module.exports.findOne = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await findOne(postId);
    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  const { searchValue } = req.params;
  try {
    const posts = await findAll(searchValue);
    res.status(200).json({ status: "success", data: posts });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.saveOne = async (req, res) => {
  const { website, postCategory, progressLevel, title, anchorKeyword, clientLink, urgencyLevel, wordNum, project, clientHasText } = req.body;
  try {
    const postObj = {};
    if (website) postObj.website = website;
    if (postCategory) postObj.postCategory = postCategory;
    if (title) postObj.title = title;
    if (anchorKeyword) postObj.anchorKeyword = anchorKeyword;
    if (clientLink) postObj.clientLink = clientLink;
    if (urgencyLevel) postObj.urgencyLevel = urgencyLevel;
    if (wordNum) postObj.wordNum = wordNum;
    if (project) postObj.project = project;
    postObj.clientHasText = clientHasText;
    if (progressLevel) {
      postObj.progressLevel = progressLevel;
    } else {
      postObj.progressLevel = "pendingCheck";
    }
    const post = await saveOne(postObj);
    res.status(200).json({ status: "success", data: post, message: "Post successfully added" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.updateOne = async (req, res) => {
  const { userId, userRoles } = req;
  const { postId } = req.params;
  const { website, postCategory, progressLevel, editor, copywriter, title, anchorKeyword, clientLink, textLink, postLink, urgencyLevel, wordNum, project, clientHasText } = req.body;
  try {
    const postObj = {};
    if (website) postObj.website = website;
    if (postCategory) postObj.postCategory = postCategory;
    if (progressLevel) postObj.progressLevel = progressLevel;
    if (editor) postObj.editor = editor;
    if (copywriter) postObj.copywriter = copywriter;
    if (title) postObj.title = title;
    if (anchorKeyword) postObj.anchorKeyword = anchorKeyword;
    if (clientLink) postObj.clientLink = clientLink;
    if (textLink) postObj.textLink = textLink;
    if (postLink) postObj.postLink = postLink;
    if (urgencyLevel) postObj.urgencyLevel = urgencyLevel;
    if (wordNum) postObj.wordNum = wordNum;
    if (project) postObj.project = project;
    if (clientHasText) postObj.clientHasText = clientHasText;
    const post = await updateOne(userId, userRoles, postId, postObj);
    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports.deleteOne = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await deleteOne(postId);
    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
