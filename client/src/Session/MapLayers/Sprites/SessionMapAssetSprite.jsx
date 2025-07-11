import React, { useMemo, useRef, useState, useEffect } from "react";
import { Image as KonvaImage, Group, Rect, Text } from "react-konva";
import { getCachedImage } from "../../../utils/image/imageCache";
import { useAssetDrag } from "../../Pages/DM/hooks/useAssetDrag";

function SessionMapAssetSprite({
  asset,
  gridSize,
  isSelected,
  onSelect,
  onMove,
  opacity = 1,
  disableInteraction = false,
  onOpenSettings = () => {},
}) {
  const image = useMemo(() => getCachedImage(asset.image), [asset.image]);
  const groupRef = useRef();

  const width = asset.size.width * gridSize;
  const height = asset.size.height * gridSize;

  const [visualPos, setVisualPos] = useState(() => ({
    x: asset.position.x * gridSize,
    y: asset.position.y * gridSize,
  }));

  const {
    ghostPos,
    startCell,
    isDragging,
    startDrag,
    moveGhost,
    endDrag,
    setGhostPos,
    setStartCell,
    setIsDragging,
  } = useAssetDrag({ asset, gridSize, onAssetMove: onMove });

  const hasMoved =
    ghostPos &&
    startCell &&
    (ghostPos.x !== startCell.x || ghostPos.y !== startCell.y);

  const prevAssetPos = useRef({ x: asset.position.x, y: asset.position.y });

  useEffect(() => {
    const { x, y } = asset.position;
    if (x === prevAssetPos.current.x && y === prevAssetPos.current.y) return;
    prevAssetPos.current = { x, y };

    const targetX = x * gridSize;
    const targetY = y * gridSize;

    const startX = visualPos.x;
    const startY = visualPos.y;
    const duration = 120;
    const startTime = performance.now();

    let animationFrame;
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
  }, [asset.position.x, asset.position.y, gridSize]);

  const ghostAsset = useMemo(() => {
    if (!isDragging || !image || disableInteraction) return null;

    return (
      <KonvaImage
        image={image}
        x={ghostPos?.x * gridSize || 0}
        y={ghostPos?.y * gridSize || 0}
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
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

  const settingsOffset = {
    x: 5, // tweak this
    y: -height / 2 + 55, // tweak this
  };

  return (
    <>
      {image && (
        <Group
          ref={groupRef}
          x={visualPos.x + width / 2}
          y={visualPos.y + height / 2}
          offsetX={width / 2}
          offsetY={height / 2}
          opacity={opacity}
          onClick={(e) => {
            if (disableInteraction) return;
            e.cancelBubble = true;
            onSelect(asset.id);
          }}
        >
          <KonvaImage
            image={image}
            width={width}
            height={height}
            rotation={asset.rotation || 0}
            opacity={opacity}
            offsetX={width / 2}
            offsetY={height / 2}
            stroke={isSelected ? "gold" : null}
            strokeWidth={isSelected ? 6 : 0}
            shadowColor={isSelected ? "black" : null}
            shadowBlur={isSelected ? 4 : 0}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={isSelected ? 0.6 : 0}
            listening={!isDragging}
          />

          {isSelected && (
            <>
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                opacity={0.2}
                cornerRadius={4}
                offsetX={0}
                offsetY={0}
              />

              <Group>
                <Rect
                  x={width / 2 + settingsOffset.x}
                  y={settingsOffset.y}
                  width={20}
                  height={20}
                  fill="white"
                  cornerRadius={10}
                  shadowBlur={4}
                  shadowOpacity={0.4}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    onOpenSettings(asset);
                  }}
                />
                <Text
                  x={width / 2 + settingsOffset.x}
                  y={settingsOffset.y}
                  width={20}
                  height={20}
                  text="⚙️"
                  fontSize={14}
                  align="center"
                  verticalAlign="middle"
                  listening={false}
                />
              </Group>
            </>
          )}
        </Group>
      )}

      {ghostAsset}

      {!isDragging && !disableInteraction && (
        <Rect
          x={asset.position.x * gridSize}
          y={asset.position.y * gridSize}
          width={width}
          height={height}
          opacity={0.01}
          listening={true}
          onMouseDown={(e) => {
            e.cancelBubble = true;
            if (!isSelected) {
              onSelect(asset.id);
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

export default React.memo(
  SessionMapAssetSprite,
  (prev, next) =>
    prev.asset === next.asset &&
    prev.gridSize === next.gridSize &&
    prev.isSelected === next.isSelected &&
    prev.opacity === next.opacity &&
    prev.disableInteraction === next.disableInteraction
);
