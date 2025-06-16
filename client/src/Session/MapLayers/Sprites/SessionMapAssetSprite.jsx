import React, { useMemo, useRef } from "react";
import { Image as KonvaImage, Group, Rect } from "react-konva";
import { getCachedImage } from "../../../utils/image/imageCache";

export default function SessionMapAssetSprite({
  asset,
  gridSize,
  isSelected,
  onSelect,
  onMove,
  opacity = 1,
}) {
  const image = useMemo(() => getCachedImage(asset.image), [asset.image]);
  const groupRef = useRef();

  const width = asset.size.width * gridSize;
  const height = asset.size.height * gridSize;

  return image ? (
    <Group
      ref={groupRef}
      x={asset.position.x * gridSize}
      y={asset.position.y * gridSize}
      draggable
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(asset.id);
      }}
      onDragEnd={(e) => {
        const newX = e.target.x() / gridSize;
        const newY = e.target.y() / gridSize;
        onMove(asset.id, { x: newX, y: newY });
      }}
    >
      <KonvaImage
        image={image}
        x={0}
        y={0}
        offsetX={width / 2}
        offsetY={height / 2}
        width={width}
        height={height}
        rotation={asset.rotation || 0}
        opacity={opacity}
      />
      {isSelected && (
        <Rect
          x={0}
          y={0}
          offsetX={width / 2}
          offsetY={height / 2}
          width={width}
          height={height}
          fill="yellow"
          opacity={0.2}
          cornerRadius={4}
        />
      )}
    </Group>
  ) : null;
}
