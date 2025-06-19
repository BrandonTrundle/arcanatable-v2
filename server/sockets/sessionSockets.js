const socketToUser = new Map();

module.exports = function registerSessionSockets(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a session room
    socket.on("joinSession", ({ sessionCode, userId }) => {
      socket.join(sessionCode);
      socketToUser.set(socket.id, userId);
      console.log(
        `Socket ${socket.id} joined session ${sessionCode} as user ${userId}`
      );
    });

    // DM loads map and broadcasts it
    socket.on("dmLoadMap", ({ sessionCode, map }) => {
      console.log(`Broadcasting map to session ${sessionCode}`);
      io.to(sessionCode).emit("playerReceiveMap", map);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socketToUser.delete(socket.id);
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

    socket.on(
      "dmTokenLayerChange",
      ({ sessionCode, tokenId, fromLayer, toLayer }) => {
        socket.to(sessionCode).emit("playerReceiveTokenLayerChange", {
          tokenId,
          fromLayer,
          toLayer,
        });
      }
    );

    socket.on(
      "dmTokenOwnershipChange",
      ({ sessionCode, tokenId, newOwnerIds }) => {
        io.to(sessionCode).emit("playerReceiveTokenOwnershipChange", {
          tokenId,
          newOwnerIds,
        });
      }
    );

    socket.on(
      "playerTokenOwnershipChange",
      ({ sessionCode, tokenId, newOwnerIds }) => {
        const userId = socketToUser.get(socket.id);

        console.log(
          `Player ${userId} changed ownership of token ${tokenId} in session ${sessionCode}`
        );

        io.to(sessionCode).emit("playerReceiveTokenOwnershipChange", {
          tokenId,
          newOwnerIds,
        });
      }
    );

    // Player moves a token and broadcasts it
    socket.on("playerMoveToken", ({ sessionCode, tokenData }) => {
      const userId = socketToUser.get(socket.id);
      const { id, newPos, layer, ownerId, ownerIds } = tokenData;

      const ownsToken =
        ownerId === userId ||
        (Array.isArray(ownerIds) && ownerIds.includes(userId));

      if (!ownsToken) {
        console.warn(`Unauthorized token move by user ${userId}: token ${id}`);
        return;
      }

      console.log(
        `Player ${userId} moved token ${id} in session ${sessionCode}`
      );
      io.to(sessionCode).emit("playerReceiveTokenMove", { id, newPos, layer });
    });
  });
};
