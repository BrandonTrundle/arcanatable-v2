import React, { useRef, useState, useEffect, useMemo } from "react";
import { Image as KonvaImage, Rect, Group, Text } from "react-konva";
import { useTokenAnimation } from "../../../hooks/tokens/useTokenAnimation";
import { useTokenDrag } from "../../../hooks/tokens/useTokenDrag";
import { getHpColor } from "../../../utils/token/tokenUtils";
import { getCachedImage } from "../../../utils/image/imageCache";

function SessionTokenSprite({
  token,
  gridSize,
  onTokenMove = () => {},
  isSelected = false,
  onSelect = () => {},
  onOpenSettings = () => {}, // <--- Add this
  immediatePositionOverride = null,
  opacity = 1,
  disableInteraction = false,
}) {
  const image = useMemo(() => getCachedImage(token.image), [token.image]);

  const groupRef = useRef();
  const width = (token.size?.width || 1) * gridSize;
  const height = (token.size?.height || 1) * gridSize;

  const safeHp = typeof token.hp === "number" ? token.hp : 1;
  const safeMaxHp = token.maxHp > 0 ? token.maxHp : 1;
  const hpRatio = Math.max(0, Math.min(1, safeHp / safeMaxHp));

  const [visualPos, setVisualPos] = useState({
    x: (token.position?.x ?? 0) * gridSize,
    y: (token.position?.y ?? 0) * gridSize,
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

  const hasMoved =
    ghostPos &&
    startCell &&
    (ghostPos.x !== startCell.x || ghostPos.y !== startCell.y);

  useTokenAnimation({
    groupRef,
    tokenPosition: token.position,
    isDragging,
    gridSize,
    visualPos,
    setVisualPos,
  });

  useEffect(() => {
    if (!immediatePositionOverride) return;

    const targetX = immediatePositionOverride.x * gridSize;
    const targetY = immediatePositionOverride.y * gridSize;

    let animationFrame;
    const duration = 120;
    const startTime = performance.now();

    const startX = visualPos.x;
    const startY = visualPos.y;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setVisualPos({
        x: startX + (targetX - startX) * progress,
        y: startY + (targetY - startY) * progress,
      });
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [immediatePositionOverride, gridSize]);

  useEffect(() => {
    if (!isSelected && isDragging && !hasMoved) {
      setIsDragging(false);
    }
    //    console.log("Token", token.id, "isSelected?", isSelected);
  }, [isSelected, isDragging, hasMoved, token.id]);

  const ghostToken = useMemo(() => {
    if (!isDragging || !image || disableInteraction) return null;

    // console.log("Rendering ghostToken", { ghostPos, hasMoved });

    return (
      <KonvaImage
        image={image}
        x={ghostPos?.x * gridSize || 0}
        y={ghostPos?.y * gridSize || 0}
        width={width}
        height={height}
        opacity={hasMoved ? 0.5 : 0.01}
        stroke={hasMoved ? "gold" : null}
        strokeWidth={hasMoved ? 4 : 0}
        shadowColor="black"
        shadowBlur={hasMoved ? 4 : 0}
        shadowOffset={{ x: 0, y: 0 }}
        shadowOpacity={hasMoved ? 0.6 : 0}
        draggable
        dragBoundFunc={(pos) => pos}
        onDragMove={moveGhost}
        onDragEnd={() => {
          if (!hasMoved) {
            setIsDragging(false);
          } else {
            endDrag(groupRef);
            setTimeout(() => onSelect(null), 0);
          }
        }}
      />
    );
  }, [isDragging, image, ghostPos, width, height, hasMoved]);

  return (
    <>
      {image && (
        <Group
          ref={groupRef}
          x={visualPos.x}
          y={visualPos.y}
          scaleX={1}
          scaleY={1}
          opacity={opacity}
          onClick={(e) => {
            e.cancelBubble = true;
            onSelect(token.id);
          }}
        >
          {isSelected && (
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="yellow"
              opacity={0.2}
              cornerRadius={4}
            />
          )}
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
            y={(1 - hpRatio) * height}
            width={6}
            height={hpRatio * height}
            fill={getHpColor(safeHp, safeMaxHp)}
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

          {isSelected && (
            <Group>
              <Rect
                x={width + 4}
                y={height / 2 - 10}
                width={20}
                height={20}
                fill="white"
                cornerRadius={10}
                shadowBlur={4}
                shadowOpacity={0.4}
                onClick={(e) => {
                  e.cancelBubble = true;
                  onOpenSettings(token);
                }}
              />
              <Text
                x={width + 4}
                y={height / 2 - 10}
                width={20}
                height={20}
                text="⚙️"
                fontSize={14}
                align="center"
                verticalAlign="middle"
                listening={false}
              />
            </Group>
          )}
        </Group>
      )}

      {ghostToken}

      {!isDragging && !disableInteraction && (
        <Rect
          x={(token.position?.x ?? 0) * gridSize}
          y={(token.position?.y ?? 0) * gridSize}
          width={width}
          height={height}
          opacity={0.01}
          listening={true}
          onMouseDown={(e) => {
            e.cancelBubble = true;
            if (!isSelected) {
              onSelect(token.id);
              //          console.log("Token selected, starting drag on timeout");
              setTimeout(() => {
                //            console.log("Drag started (newly selected)");
                startDrag();
              }, 0);
            } else {
              //           console.log("Token already selected, drag starting immediately");
              startDrag();
            }
          }}
        />
      )}
    </>
  );
}

export default React.memo(
  SessionTokenSprite,
  (prev, next) =>
    prev.token === next.token &&
    prev.gridSize === next.gridSize &&
    prev.isSelected === next.isSelected &&
    prev.disableInteraction === next.disableInteraction
);
