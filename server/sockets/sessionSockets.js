module.exports = function registerSessionSockets(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a session room
    socket.on("joinSession", ({ sessionCode }) => {
      socket.join(sessionCode);
      console.log(`Socket ${socket.id} joined session ${sessionCode}`);
    });

    // DM loads map and broadcasts it
    socket.on("dmLoadMap", ({ sessionCode, map }) => {
      console.log(`Broadcasting map to session ${sessionCode}`);
      io.to(sessionCode).emit("playerReceiveMap", map);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("playerDropToken", ({ sessionCode, mapId, token }) => {
      console.log(`Player dropped token in session ${sessionCode}`);
      socket.to(sessionCode).emit("playerDropToken", { mapId, token });
    });

    // DM moves a token and broadcasts it
    socket.on("dmTokenMove", ({ sessionCode, tokenData }) => {
      console.log(
        `Broadcasting token move in session ${sessionCode}`,
        tokenData
      );
      io.to(sessionCode).emit("playerReceiveTokenMove", tokenData);
    });
  });
};
