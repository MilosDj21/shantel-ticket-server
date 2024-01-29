const Client = require("../../models/project/Client");
const mongoose = require("mongoose");

module.exports.findOne = async (clientId) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) throw Error("Invalid client id");
  const clients = await Client.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(clientId) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "clientlinks",
        localField: "_id",
        foreignField: "client",
        as: "links",
        pipeline: [
          {
            $lookup: {
              from: "postrequests",
              localField: "_id",
              foreignField: "clientPaidLink",
              as: "postRequests",
              pipeline: [
                {
                  $lookup: {
                    from: "websites",
                    localField: "website",
                    foreignField: "_id",
                    as: "website",
                  },
                },
                {
                  $unwind: "$website",
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "editor",
                    foreignField: "_id",
                    as: "editor",
                  },
                },
                {
                  $unwind: "$editor",
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "copywriter",
                    foreignField: "_id",
                    as: "copywriter",
                  },
                },
                {
                  $unwind: "$copywriter",
                },
              ],
            },
          },
        ],
      },
    },
    {
      $project: {
        "user.password": 0,
        "user.secret": 0,
        "links.postRequests.editor.password": 0,
        "links.postRequests.editor.secret": 0,
        "links.postRequests.copywriter.password": 0,
        "links.postRequests.copywriter.secret": 0,
      },
    },
  ]);
  if (!clients[0]) throw Error("No such client");
  return clients[0];
};

module.exports.findAll = async (searchValue) => {
  let clients = await Client.find({});
  if (!clients) throw Error("Invalid clients");
  if (searchValue) {
    clients = clients.filter((c) => {
      return c.email.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
  return clients;
};

module.exports.saveOne = async (email, user) => {
  if (!email || email.length === 0) throw Error("Invalid email");
  if (!user || user.length === 0) throw Error("Invalid user");
  const client = await Client.createClient(email, user);
  if (!client) throw Error("Creating client failed");
  return client;
};

module.exports.updateOne = async (clientId, clientObj) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) throw Error("Invalid client id");
  const client = await Client.findByIdAndUpdate(clientId, { ...clientObj }, { new: true });
  if (!client) throw Error("Updating client failed");
  return client;
};

module.exports.deleteOne = async (clientId) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) throw Error("Invalid client id");
  const client = await Client.findByIdAndDelete(clientId);
  if (!client) throw Error("Deleting client failed");
  return client;
};
