import React, { useRef, useEffect, useState } from "react";
import { Image as KonvaImage, Rect, Group } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

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

  const [isDragging, setIsDragging] = useState(false);
  const [ghostPos, setGhostPos] = useState(null);
  const [startCell, setStartCell] = useState(null);
  const [visualPos, setVisualPos] = useState({
    x: token.position.x * gridSize,
    y: token.position.y * gridSize,
  });

  // Animate real token to new position after map data updates
  useEffect(() => {
    const targetX = token.position.x * gridSize;
    const targetY = token.position.y * gridSize;

    if (
      groupRef.current &&
      !isDragging &&
      (visualPos.x !== targetX || visualPos.y !== targetY)
    ) {
      console.log("🎯 Animating token to:", token.position);

      groupRef.current.to({
        x: targetX,
        y: targetY,
        duration: 0.25,
        easing: Konva.Easings.EaseInOut,
        onFinish: () => {
          // ONLY update visualPos after animation completes
          setVisualPos({ x: targetX, y: targetY });
        },
      });
    }
  }, [token.position, isDragging, visualPos, gridSize]);

  // Handle start of drag
  const startDrag = () => {
    const x = token.position.x;
    const y = token.position.y;
    console.log("🟡 Starting ghost drag from:", x, y);
    setStartCell({ x, y });
    setGhostPos({ x, y });
    setIsDragging(true);
  };

  // Handle ghost movement
  const moveGhost = (e) => {
    const x = Math.round(e.target.x() / gridSize);
    const y = Math.round(e.target.y() / gridSize);
    console.log("🟢 Drag move:", x, y);
    setGhostPos({ x, y });
  };

  // Handle end of drag
  const endDrag = () => {
    console.log("🔴 Drag ended");

    if (
      ghostPos &&
      startCell &&
      (ghostPos.x !== startCell.x || ghostPos.y !== startCell.y)
    ) {
      console.log("🚚 Moving token from", startCell, "to", ghostPos);

      // Set the group manually to old position before position updates
      if (groupRef.current) {
        groupRef.current.setAttrs({
          x: startCell.x * gridSize,
          y: startCell.y * gridSize,
        });
      }

      // Slightly delay to allow DOM to re-render before token state updates
      requestAnimationFrame(() => {
        onTokenMove(token.id, ghostPos);
      });
    } else {
      console.log("⛔ Cancelled — no movement");
    }

    setGhostPos(null);
    setStartCell(null);
    setIsDragging(false);
  };

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
            fill={
              token.hp / token.maxHp <= 0.33
                ? "red"
                : token.hp / token.maxHp <= 0.66
                ? "yellow"
                : "green"
            }
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
          onDragEnd={endDrag}
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
          onMouseDown={(e) => {
            // Set up for ghost manually on mousedown
            const x = token.position.x;
            const y = token.position.y;
            setStartCell({ x, y });
            setGhostPos({ x, y });
            setIsDragging(true);
          }}
        />
      )}
    </>
  );
}
