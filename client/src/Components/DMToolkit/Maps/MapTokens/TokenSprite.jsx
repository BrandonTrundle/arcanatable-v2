import React from "react";
import { Image as KonvaImage, Rect, Group } from "react-konva";
import useImage from "use-image";

export default function TokenSprite({
  token,
  gridSize,
  onTokenMove = () => {},
  isSelected = false,
  onSelect = () => {},
}) {
  const [image] = useImage(token.image);

  const width = token.size.width * gridSize;
  const height = token.size.height * gridSize;
  const x = token.position.x * gridSize;
  const y = token.position.y * gridSize;
  //console.log(`🩸 Token: ${token.name} — HP: ${token.hp} / ${token.maxHp}`);

  return (
    image && (
      <Group
        x={token.position.x * gridSize}
        y={token.position.y * gridSize}
        draggable
        onClick={() => onSelect(token.id)}
        onDragEnd={(e) => {
          const snappedX = Math.round(e.target.x() / gridSize);
          const snappedY = Math.round(e.target.y() / gridSize);

          // Reset the group immediately so Konva doesn't cache wrong pixel values
          e.target.position({
            x: snappedX * gridSize,
            y: snappedY * gridSize,
          });

          onTokenMove(token.id, { x: snappedX, y: snappedY });
        }}
      >
        {/* Token Image */}
        <KonvaImage
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          rotation={token.rotation || 0}
          opacity={token.isVisible ? 1 : 0.5}
          stroke={isSelected ? "cyan" : null}
          strokeWidth={isSelected ? 3 : 0}
        />

        {/* HP Background */}
        <Rect x={0} y={0} width={6} height={height} fill="#222" opacity={0.6} />

        {/* HP Fill */}
        <Rect
          x={0}
          y={(1 - token.hp / token.maxHp) * height}
          width={6}
          height={(token.hp / token.maxHp) * height}
          fill={
            token.hp / token.maxHp <= 0.33
              ? "red"
              : token.hp / token.maxHp <= 0.66
              ? "yellow"
              : "green"
          }
          opacity={0.75}
        />

        {/* Border Frame */}
        <Rect
          x={0}
          y={0}
          width={6}
          height={height}
          stroke="black"
          strokeWidth={1}
        />
      </Group>
    )
  );
}
