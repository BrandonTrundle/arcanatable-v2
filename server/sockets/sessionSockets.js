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
  });
};
