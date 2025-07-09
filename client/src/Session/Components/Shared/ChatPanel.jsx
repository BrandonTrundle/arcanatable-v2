import { useState, useEffect, useRef } from "react";
import styles from "../../styles/ChatPanel.module.css";

export default function ChatPanel({
  messages,
  onSendMessage,
  availableTokens = [],
  defaultSender = "Player",
  onSelectToken,
}) {
  const [input, setInput] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (!container) return;

      const shouldScroll = shouldScrollRef.current;
      //console.log("Auto-scroll decision:", shouldScroll);

      if (shouldScroll) {
        container.scrollTop = container.scrollHeight;
        //console.log("Auto-scrolling to bottom.");
      } else {
        //console.log("User not near bottom; no auto-scroll.");
      }
    });
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      const nearBottom = scrollTop + clientHeight >= scrollHeight - 500;

      shouldScrollRef.current = nearBottom;

      console.log("Scroll updated:", {
        scrollTop,
        clientHeight,
        scrollHeight,
        nearBottom,
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      const token = availableTokens.find((t) => t.id === selectedTokenId);
      const message = {
        sender: token ? token.name : defaultSender || "Player",
        text: input.trim(),
        image: token?.image || null,
      };
      onSendMessage(message);
      setInput("");
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messages} ref={messagesContainerRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={styles.message}>
            <div className={styles.messageContent}>
              {msg.image && (
                <img
                  src={msg.image}
                  alt={`${msg.sender}'s avatar`}
                  className={styles.tokenImage}
                />
              )}
              <strong>{msg.sender}:</strong>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {availableTokens.length > 0 && (
        <div className={styles.tokenSelector}>
          <label htmlFor="tokenSelect">Send message as:</label>
          <select
            id="tokenSelect"
            value={selectedTokenId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedTokenId(id);
              onSelectToken?.(id); // ✅ Notify parent (DMView) of selected token
            }}
          >
            <option value="">Yourself</option>
            {availableTokens.map((token) => (
              <option key={token.id} value={token.id}>
                {token.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
