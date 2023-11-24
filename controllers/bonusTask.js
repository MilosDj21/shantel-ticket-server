//only admin can access this
module.exports.findOne = async (req, res) => {};
module.exports.findAll = async (req, res) => {};
module.exports.saveOne = async (req, res) => {};
module.exports.updateOne = async (req, res) => {};
module.exports.deleteOne = async (req, res) => {};

//by user created
module.exports.findOneByCreationUser = async (req, res) => {};
module.exports.findAllByCreationUser = async (req, res) => {};
module.exports.saveOneByCreationUser = async (req, res) => {};
module.exports.updateOneByCreationUser = async (req, res) => {};

//by user completed
module.exports.findOneByCompletionUser = async (req, res) => {};
module.exports.findAllByCompletionUser = async (req, res) => {};
module.exports.saveOneByCompletionUser = async (req, res) => {};
module.exports.updateOneByCompletionUser = async (req, res) => {};
