import React from "react";
import { Layer, Circle, Arc, Rect } from "react-konva";

const hexWithAlpha = (hex, alpha = 0.4) => {
  if (!hex?.startsWith("#") || hex.length !== 7) return hex;
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return hex + alphaHex;
};

export default function SessionAoELayer({
  aoes = [],
  isDraggingAoE = false,
  aoeDragOrigin = null,
  aoeDragTarget = null,
  selectedShape = "circle",
  shapeSettings = {},
  cellSize = 100,
  onRightClickAoE = () => {},
}) {
  const feetToPixels = (feet) => (cellSize / 5) * feet;
  const previewColor = hexWithAlpha(
    shapeSettings[selectedShape]?.color || "#ff0000",
    0.4
  );

  return (
    <Layer listening={true}>
      {/* Render placed AoEs */}
      {aoes.map((aoe) => {
        const sharedProps = {
          key: aoe.id,
          fill: aoe.color || "rgba(255,0,0,0.4)",
          opacity: aoe.opacity ?? 0.4,
          stroke: "black",
          strokeWidth: 1,
          onContextMenu: (e) => {
            e.evt.preventDefault();
            onRightClickAoE(aoe);
          },
        };

        switch (aoe.type) {
          case "circle":
            return (
              <Circle
                {...sharedProps}
                x={aoe.x}
                y={aoe.y}
                radius={aoe.radius}
              />
            );
          case "cone":
            return (
              <Arc
                {...sharedProps}
                x={aoe.x}
                y={aoe.y}
                innerRadius={0}
                outerRadius={aoe.radius}
                angle={aoe.angle}
                rotation={aoe.direction}
              />
            );
          case "square":
            return (
              <Rect
                {...sharedProps}
                x={aoe.x - aoe.width / 2}
                y={aoe.y - aoe.width / 2}
                width={aoe.width}
                height={aoe.width}
              />
            );
          case "rectangle":
            return (
              <Rect
                {...sharedProps}
                x={aoe.x}
                y={aoe.y}
                width={aoe.width}
                height={aoe.height}
                rotation={aoe.direction || 0}
                offsetX={aoe.width / 2}
                offsetY={aoe.height / 2}
              />
            );
          default:
            return null;
        }
      })}

      {/* Preview AoE during drag */}
      {isDraggingAoE &&
        aoeDragOrigin &&
        aoeDragTarget &&
        (() => {
          const dx = aoeDragTarget.x - aoeDragOrigin.x;
          const dy = aoeDragTarget.y - aoeDragOrigin.y;
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          switch (selectedShape) {
            case "cone":
              return (
                <Arc
                  x={aoeDragOrigin.x}
                  y={aoeDragOrigin.y}
                  innerRadius={0}
                  outerRadius={feetToPixels(
                    shapeSettings[selectedShape]?.radius || 30
                  )}
                  angle={shapeSettings[selectedShape]?.angle || 60}
                  rotation={angle}
                  fill={previewColor}
                  stroke="black"
                  strokeWidth={1}
                  opacity={0.6}
                  dash={[10, 5]}
                />
              );
            case "circle":
              return (
                <Circle
                  x={aoeDragTarget.x}
                  y={aoeDragTarget.y}
                  radius={feetToPixels(
                    shapeSettings[selectedShape]?.radius || 20
                  )}
                  fill={previewColor}
                  stroke="black"
                  strokeWidth={1}
                  opacity={0.6}
                />
              );
            case "square":
              const width = feetToPixels(
                shapeSettings[selectedShape]?.width || 30
              );
              return (
                <Rect
                  x={aoeDragTarget.x - width / 2}
                  y={aoeDragTarget.y - width / 2}
                  width={width}
                  height={width}
                  fill={previewColor}
                  stroke="black"
                  strokeWidth={1}
                  opacity={0.6}
                  dash={[10, 5]}
                />
              );
            case "rectangle":
              const w = feetToPixels(shapeSettings[selectedShape]?.width || 40);
              const h = feetToPixels(
                shapeSettings[selectedShape]?.height || 20
              );
              return (
                <Rect
                  x={aoeDragTarget.x - w / 2}
                  y={aoeDragTarget.y - h / 2}
                  width={w}
                  height={h}
                  fill={previewColor}
                  stroke="black"
                  strokeWidth={1}
                  opacity={0.6}
                  dash={[10, 5]}
                />
              );
            default:
              return null;
          }
        })()}
    </Layer>
  );
}
