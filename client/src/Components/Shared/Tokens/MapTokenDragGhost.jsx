export default function MapTokenDragGhost({ token, positionRef }) {
  const position = positionRef.current;
  if (!token || !position) return null;

  return (
    <img
      src={token.image}
      alt={token.name}
      style={{
        position: "fixed",
        transform: `translate(${position.x + 10}px, ${position.y + 10}px)`,
        pointerEvents: "none",
        width: 48,
        height: 48,
        opacity: 0.75,
        zIndex: 10000,
      }}
    />
  );
}
