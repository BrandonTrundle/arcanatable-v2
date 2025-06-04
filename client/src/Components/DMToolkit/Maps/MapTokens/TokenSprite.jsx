import React, { useRef, useState, useEffect, useMemo } from "react";
import { Image as KonvaImage, Rect, Group } from "react-konva";
import { useTokenAnimation } from "../../../../hooks/tokens/useTokenAnimation";
import { useTokenDrag } from "../../../../hooks/tokens/useTokenDrag";
import { getHpColor } from "../../../../utils/token/tokenUtils";
import { getCachedImage } from "../../../../utils/image/imageCache";

function TokenSpriteComponent({
  token,
  gridSize,
  onTokenMove = () => {},
  isSelected = false,
  onSelect = () => {},
}) {
  const image = useMemo(() => getCachedImage(token.image), [token.image]);

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
    if (!isSelected && isDragging && !hasMoved) {
      setIsDragging(false);
    }
  }, [isSelected, isDragging, hasMoved, token.id]);

  const ghostToken = useMemo(() => {
    if (!isDragging || !image) return null;

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
          onClick={(e) => {
            e.cancelBubble = true;
            onSelect(token.id);
          }}
          listening={true}
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

          {/* HP Bar */}
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

      {ghostToken}

      {!isDragging && (
        <Rect
          x={token.position.x * gridSize}
          y={token.position.y * gridSize}
          width={width}
          height={height}
          opacity={0.01}
          listening={true}
          onMouseDown={(e) => {
            e.cancelBubble = true;
            if (!isSelected) {
              onSelect(token.id);
              setTimeout(() => {
                startDrag();
              }, 0);
            } else {
              startDrag();
            }
          }}
        />
      )}
    </>
  );
}

export default React.memo(TokenSpriteComponent, (prevProps, nextProps) => {
  return (
    prevProps.token === nextProps.token &&
    prevProps.gridSize === nextProps.gridSize &&
    prevProps.isSelected === nextProps.isSelected
  );
});
