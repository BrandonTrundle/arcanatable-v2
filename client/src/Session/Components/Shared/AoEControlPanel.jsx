import React, { useRef, useEffect, useState } from "react";
import styles from "../../styles/AoEControlPanel.module.css";
import AoEIcon from "../../../assets/icons/AoEIcon.png";

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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      panel.style.left = `${e.clientX - dragOffset.x}px`;
      panel.style.top = `${e.clientY - dragOffset.y}px`;
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const startDrag = (e) => {
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDragging(true);
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
    <div className={styles.panel} ref={panelRef}>
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
        <input
          type="checkbox"
          checked={isAnchored}
          onChange={(e) => setIsAnchored(e.target.checked)}
        />
        <label>Anchor to token</label>
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
