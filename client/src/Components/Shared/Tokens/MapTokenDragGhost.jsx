import React from "react";

export default function DragPreview({ token, position }) {
  if (!token || !position) return null;

  return (
    <img
      src={token.image}
      alt={token.name}
      style={{
        position: "fixed",
        top: position.y + 10,
        left: position.x + 10,
        pointerEvents: "none",
        width: 48,
        height: 48,
        opacity: 0.75,
        zIndex: 10000,
      }}
    />
  );
}
