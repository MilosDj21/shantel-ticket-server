const connectedUsers = [];

module.exports.socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(socket.id);

    //Send socket id to connected user
    io.to(socket.id).emit("recieveSocketId", socket.id);

    //Connect current user with socket user after connection
    socket.on("connectWithDb", onConnectWithDb);

    socket.on("privateMessage", (message) => {
      console.log(message);
      let recieveUserId = null;
      for (const u of connectedUsers) {
        if (u.dbUserId === message.to) {
          recieveUserId = u.socketUserId;
          break;
        }
      }
      if (recieveUserId) io.to(recieveUserId).emit("privateMessage", message.data);
    });
  });
};

const onConnectWithDb = (data) => {
  for (const u of connectedUsers) {
    if (u.dbUserId === data.dbUserId) {
      u.socketUserId = data.socketUserId;
      console.log(connectedUsers);
      return;
    }
  }
  connectedUsers.push(data);
  console.log(connectedUsers);
};
