import React, { useRef, useState } from "react";
import { Image as KonvaImage, Rect, Group } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { useTokenAnimation } from "../../../../hooks/tokens/useTokenAnimation";
import { useTokenDrag } from "../../../../hooks/tokens/useTokenDrag";
import { getHpColor } from "../../../../utils/token/tokenUtils";

export default function TokenSprite({
  token,
  gridSize,
  onTokenMove = () => {},
  isSelected = false,
  onSelect = () => {},
}) {
  const [image] = useImage(token.image);
  const groupRef = useRef();
  const width = token.size.width * gridSize;
  const height = token.size.height * gridSize;

  const [visualPos, setVisualPos] = useState({
    x: token.position.x * gridSize,
    y: token.position.y * gridSize,
  });

  const {
    ghostPos,
    startCell,
    isDragging,
    startDrag,
    moveGhost,
    endDrag,
    setStartCell,
    setGhostPos,
    setIsDragging,
  } = useTokenDrag({ token, gridSize, onTokenMove });

  useTokenAnimation({
    groupRef,
    tokenPosition: token.position,
    isDragging,
    gridSize,
    visualPos,
    setVisualPos,
  });

  return (
    <>
      {/* Base token (static position) */}
      {image && (
        <Group
          ref={groupRef}
          x={visualPos.x}
          y={visualPos.y}
          onClick={() => onSelect(token.id)}
          opacity={1}
        >
          <KonvaImage
            image={image}
            width={width}
            height={height}
            rotation={token.rotation || 0}
            opacity={token.isVisible ? 1 : 0.5}
            stroke={isSelected ? "gold" : null}
            strokeWidth={isSelected ? 6 : 0}
            shadowColor={isSelected ? "black" : null}
            shadowBlur={isSelected ? 4 : 0}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={isSelected ? 0.6 : 0}
            listening={!isDragging}
          />

          <Rect
            x={0}
            y={0}
            width={6}
            height={height}
            fill="#222"
            opacity={0.6}
          />
          <Rect
            x={0}
            y={(1 - token.hp / token.maxHp) * height}
            width={6}
            height={(token.hp / token.maxHp) * height}
            fill={getHpColor(token.hp, token.maxHp)}
            opacity={0.75}
          />
          <Rect
            x={0}
            y={0}
            width={6}
            height={height}
            stroke="black"
            strokeWidth={1}
          />
        </Group>
      )}

      {/* Ghost token during drag */}
      {isDragging && ghostPos && image && (
        <KonvaImage
          image={image}
          x={ghostPos.x * gridSize}
          y={ghostPos.y * gridSize}
          width={width}
          height={height}
          opacity={0.5}
          stroke="gold"
          strokeWidth={4}
          shadowColor="black"
          shadowBlur={4}
          shadowOffset={{ x: 0, y: 0 }}
          shadowOpacity={0.6}
          draggable
          dragBoundFunc={(pos) => pos}
          onDragMove={moveGhost}
          onDragEnd={() => endDrag(groupRef)}
        />
      )}

      {/* Transparent drag initiator */}
      {!isDragging && (
        <Rect
          x={token.position.x * gridSize}
          y={token.position.y * gridSize}
          width={width}
          height={height}
          opacity={0.01}
          listening={true}
          onMouseDown={startDrag}
        />
      )}
    </>
  );
}
