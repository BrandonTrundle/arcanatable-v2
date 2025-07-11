import React, { useRef, useState } from "react";
import styles from "../../styles/AoEControlPanel.module.css";
import AoEIcon from "../../../assets/icons/AoEIcon.png";
import { getNextZIndex } from "../../utils/zIndexManager";

const SHAPES = ["cone", "circle", "square", "rectangle"];

export default function AoEControlPanel({
  selectedShape,
  setSelectedShape,
  isAnchored,
  setIsAnchored,
  shapeSettings,
  setShapeSettings,
  snapMode,
  setSnapMode,
}) {
  const panelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(getNextZIndex());

  const bringToFront = () => {
    const next = getNextZIndex();
    setZIndex(next);
  };
  const startDrag = (e) => {
    bringToFront();
    const panel = panelRef.current;
    pos.current = {
      x: e.clientX - panel.offsetLeft,
      y: e.clientY - panel.offsetTop,
    };
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  };

  const drag = (e) => {
    const panel = panelRef.current;
    panel.style.left = `${e.clientX - pos.current.x}px`;
    panel.style.top = `${e.clientY - pos.current.y}px`;
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  };

  const updateShapeSetting = (field, value) => {
    setShapeSettings((prev) => ({
      ...prev,
      [selectedShape]: {
        ...prev[selectedShape],
        [field]: value,
      },
    }));
  };

  const renderShapeInputs = () => {
    const settings = shapeSettings[selectedShape] || {};

    switch (selectedShape) {
      case "cone":
        return (
          <div className={styles.shapeSettings}>
            <label>
              Radius (ft):
              <input
                type="number"
                min="5"
                step="5"
                value={settings.radius || 30}
                onChange={(e) =>
                  updateShapeSetting("radius", parseInt(e.target.value))
                }
              />
            </label>
            <label>
              Angle (°):
              <input
                type="number"
                min="1"
                max="360"
                value={settings.angle || 60}
                onChange={(e) =>
                  updateShapeSetting("angle", parseInt(e.target.value))
                }
              />
            </label>
            <label>
              Color:
              <input
                type="color"
                value={settings.color || "#ff0000"}
                onChange={(e) => updateShapeSetting("color", e.target.value)}
              />
            </label>
          </div>
        );
      case "circle":
        return (
          <div className={styles.shapeSettings}>
            <label>
              Radius (ft):
              <input
                type="number"
                min="5"
                step="5"
                value={settings.radius || 20}
                onChange={(e) =>
                  updateShapeSetting("radius", parseInt(e.target.value))
                }
              />
            </label>
            <label>
              Color:
              <input
                type="color"
                value={settings.color || "#ff0000"}
                onChange={(e) => updateShapeSetting("color", e.target.value)}
              />
            </label>
          </div>
        );
      case "square":
        return (
          <div className={styles.shapeSettings}>
            <label>
              Width (ft):
              <input
                type="number"
                min="5"
                step="5"
                value={settings.width || 30}
                onChange={(e) =>
                  updateShapeSetting("width", parseInt(e.target.value))
                }
              />
            </label>
            <label>
              Color:
              <input
                type="color"
                value={settings.color || "#ff0000"}
                onChange={(e) => updateShapeSetting("color", e.target.value)}
              />
            </label>
          </div>
        );
      case "rectangle":
        return (
          <div className={styles.shapeSettings}>
            <label>
              Width (ft):
              <input
                type="number"
                min="5"
                step="5"
                value={settings.width || 40}
                onChange={(e) =>
                  updateShapeSetting("width", parseInt(e.target.value))
                }
              />
            </label>
            <label>
              Height (ft):
              <input
                type="number"
                min="5"
                step="5"
                value={settings.height || 20}
                onChange={(e) =>
                  updateShapeSetting("height", parseInt(e.target.value))
                }
              />
            </label>
            <label>
              Color:
              <input
                type="color"
                value={settings.color || "#ff0000"}
                onChange={(e) => updateShapeSetting("color", e.target.value)}
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={styles.panel}
      ref={panelRef}
      style={{ position: "absolute", top: 100, left: 100, zIndex }}
      onMouseDown={bringToFront}
    >
      <div className={styles.header} onMouseDown={startDrag}>
        <img src={AoEIcon} alt="AoE Icon" className={styles.icon} />
        Area of Effect Settings
      </div>

      <div className={styles.shapeButtons}>
        {SHAPES.map((shape) => (
          <button
            key={shape}
            onClick={() => setSelectedShape(shape)}
            className={selectedShape === shape ? styles.selected : ""}
          >
            {shape.charAt(0).toUpperCase() + shape.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.toggleRow}>
        <label>Snap Mode:</label>
        <select value={snapMode} onChange={(e) => setSnapMode(e.target.value)}>
          <option value="center">Center</option>
          <option value="corner">Corner</option>
        </select>
      </div>

      {renderShapeInputs()}
    </div>
  );
}
