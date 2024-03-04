module.exports.socketHandler = (io) => {
  const connectedUsers = [];

  io.on("connection", (socket) => {
    console.log(socket);
  });
};
