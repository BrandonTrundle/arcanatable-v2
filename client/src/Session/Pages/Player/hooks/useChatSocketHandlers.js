import { useEffect } from "react";
import socket from "../../../../socket";

export default function useChatSocketHandlers(user, onChatMessage) {
  useEffect(() => {
    const handleChatMessageReceived = ({ sessionCode, message }) => {
      if (message.sender === user?.username) return; // Skip local echo

      onChatMessage(message);
    };

    socket.on("chatMessageReceived", handleChatMessageReceived);

    return () => {
      socket.off("chatMessageReceived", handleChatMessageReceived);
    };
  }, [user, onChatMessage]);
}
