const socketToUser = new Map();

module.exports = function registerSessionSockets(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a session room
    socket.on("joinSession", ({ sessionCode, userId }) => {
      socket.join(sessionCode);
      socketToUser.set(socket.id, userId);
      console.log(
        `[Server] Socket ${socket.id} joined session ${sessionCode} as user ${userId}`
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

    socket.on("playerDeleteToken", ({ sessionCode, tokenId, layer }) => {
      const userId = socketToUser.get(socket.id);
      console.log(`Player ${userId} requested deletion of token ${tokenId}`);

      io.to(sessionCode).emit("playerReceiveTokenDelete", { tokenId, layer });
    });

    const sanitizeHtml = require("sanitize-html");

    socket.on("chatMessageSent", ({ sessionCode, message }) => {
      console.log("[Server] chatMessageSent received:", {
        sessionCode,
        message,
      });

      if (!sessionCode || !message || typeof message.text !== "string") return;

      const sanitizedMessage = {
        sender: String(message.sender || "Unknown").substring(0, 50),
        text: sanitizeHtml(message.text, {
          allowedTags: [],
          allowedAttributes: {},
        }).substring(0, 1000),
        image: message.image ? String(message.image).substring(0, 2048) : null,
      };

      console.log("[Server] Broadcasting sanitized message:", sanitizedMessage);

      socket.to(sessionCode).emit("chatMessageReceived", {
        sessionCode,
        message: sanitizedMessage,
      });
    });

    socket.on("dmChatMessageSent", ({ sessionCode, message }) => {
      console.log("[Server] dmChatMessageSent received:", {
        sessionCode,
        message,
      });

      if (!sessionCode || !message || typeof message.text !== "string") return;

      const sanitizedMessage = {
        sender: String(message.sender || "DM").substring(0, 50),
        text: sanitizeHtml(message.text, {
          allowedTags: [],
          allowedAttributes: {},
        }).substring(0, 1000),
        image: message.image ? String(message.image).substring(0, 2048) : null,
        senderId: message.senderId || null, // ✅ preserve senderId
      };

      console.log(
        "[Server] Broadcasting sanitized DM message:",
        sanitizedMessage
      );

      io.to(sessionCode).emit("chatMessageReceived", {
        sessionCode,
        message: sanitizedMessage,
      });
    });

    socket.on("dmDeleteToken", ({ sessionCode, tokenId, layer }) => {
      console.log(`DM requested deletion of token ${tokenId}`);
      io.to(sessionCode).emit("playerReceiveTokenDelete", { tokenId, layer });
    });

    socket.on("dmDropToken", ({ sessionCode, mapId, token }) => {
      console.log(`DM dropped token in session ${sessionCode}`);
      socket.to(sessionCode).emit("playerDropToken", { mapId, token });
    });

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
