import { Layer, Arrow, Text } from "react-konva";

export default function MeasurementLayer({
  lockedMeasurements,
  activeMeasurement,
  gridSize,
}) {
  return (
    <>
      {lockedMeasurements.map((m) =>
        renderMeasurement(m.origin, m.target, m.color, gridSize, m.id)
      )}

      {activeMeasurement &&
        activeMeasurement.origin &&
        activeMeasurement.target &&
        renderMeasurement(
          activeMeasurement.origin,
          activeMeasurement.target,
          activeMeasurement.color,
          gridSize,
          "active"
        )}
    </>
  );
}

function renderMeasurement(origin, target, color, gridSize, key) {
  const dxSquares = Math.abs(Math.floor((target.x - origin.x) / gridSize));
  const dySquares = Math.abs(Math.floor((target.y - origin.y) / gridSize));
  const distanceSquares = Math.max(dxSquares, dySquares);
  const distanceFt = distanceSquares * 5;

  const midX = origin.x + (target.x - origin.x) / 2;
  const midY = origin.y + (target.y - origin.y) / 2;

  return (
    <Layer key={key}>
      <Arrow
        points={[origin.x, origin.y, target.x, target.y]}
        stroke={color}
        fill={color}
        strokeWidth={2}
        pointerLength={10}
        pointerWidth={10}
        dash={key === "active" ? [10, 5] : []}
      />
      <Text
        text={`${distanceFt} ft`}
        x={midX + 10}
        y={midY - 10}
        fill={color}
        fontStyle="bold"
        fontSize={14}
        stroke="black"
        strokeWidth={0.5}
      />
    </Layer>
  );
}
