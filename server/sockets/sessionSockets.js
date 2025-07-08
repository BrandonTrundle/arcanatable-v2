const socketToUser = new Map();

module.exports = function registerSessionSockets(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a session room
    socket.on("joinSession", ({ sessionCode, userId }) => {
      socket.join(sessionCode);
      if (!socketToUser.has(socket.id)) {
        socketToUser.set(socket.id, userId);
      }
      console.log(
        `[Server] Socket ${socket.id} joined session ${sessionCode} as user ${userId}`
      );
    });

    // DM loads map and broadcasts it
    socket.on("dmLoadMap", ({ sessionCode, map }) => {
      console.log(`Broadcasting map to session ${sessionCode}`);
      io.to(sessionCode).emit("playerReceiveMap", map);
    });

    socket.on(
      "updateTokenStatus",
      ({ sessionCode, tokenId, statusConditions }) => {
        io.to(sessionCode).emit("updateTokenStatus", {
          tokenId,
          statusConditions,
        });
      }
    );

    socket.on("aoePlaced", ({ sessionCode, aoe }) => {
      console.log(
        `[Server] Received AoE placement for session ${sessionCode}:`,
        aoe
      );
      io.to(sessionCode).emit("aoePlaced", { aoe });
    });

    socket.on("aoeDeleted", ({ sessionCode, aoeId }) => {
      io.to(sessionCode).emit("aoeDeleted", { aoeId });
    });

    socket.on("activeTurnChanged", ({ sessionCode, tokenId }) => {
      io.to(sessionCode).emit("activeTurnChanged", { tokenId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socketToUser.delete(socket.id);
    });

    socket.on("playerDropToken", ({ sessionCode, mapId, token }) => {
      console.log(`Player dropped token in session ${sessionCode}`);
      socket.to(sessionCode).emit("playerDropToken", { mapId, token });
    });

    socket.on("updateTokenHP", ({ sessionCode, tokenId, hp, maxHp }) => {
      io.to(sessionCode).emit("tokenHPUpdated", { tokenId, hp, maxHp });
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

    socket.on("dm:pingCell", ({ sessionCode, cell }) => {
      if (!sessionCode || !cell) return;

      socket.to(sessionCode).emit("dm:pingCell", { cell });

      console.log(
        `[Server] DM pinged map cell (${cell.x}, ${cell.y}) for session ${sessionCode}`
      );
    });

    socket.on("player_ping", ({ sessionCode, cellX, cellY }) => {
      socket.to(sessionCode).emit("broadcast_ping", {
        cellX,
        cellY,
        from: "player",
      });
    });

    socket.on(
      "updateTokenStatus",
      ({ sessionCode, tokenId, statusConditions }) => {
        console.log(
          `[Socket] Status update for token ${tokenId} in session ${sessionCode}`
        );

        // Broadcast to all in session room, except sender
        socket
          .to(sessionCode)
          .emit("updateTokenStatus", { tokenId, statusConditions });
      }
    );

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

    socket.on("dm:teleportPlayerView", ({ sessionCode, cell }) => {
      if (!sessionCode || !cell) return;

      socket.to(sessionCode).emit("dm:teleportPlayerView", { cell });

      console.log(
        `[Server] DM pinged player view to (${cell.x}, ${cell.y}) for session ${sessionCode}`
      );
    });

    // Broadcast placed measurement to other players
    socket.on("measurement:placed", ({ sessionCode, measurement }) => {
      console.log(
        `[Server] Measurement placed in session ${sessionCode}:`,
        measurement
      );
      socket.to(sessionCode).emit("measurement:placed", measurement);
    });

    // Clear locked measurements for a specific user
    socket.on("measurement:clearLocked", ({ sessionCode, userId }) => {
      console.log(
        `[Server] Clearing locked measurements for user ${userId} in session ${sessionCode}`
      );
      io.to(sessionCode).emit("measurement:clearLocked", { userId });
    });

    // Clear all measurements for a session
    socket.on("measurement:clearAll", ({ sessionCode }) => {
      console.log(
        `[Server] Clearing all measurements in session ${sessionCode}`
      );
      io.to(sessionCode).emit("measurement:clearAll");
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
