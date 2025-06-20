import { useState } from "react";
import styles from "../../../styles/TokenCreationModal.module.css";

export default function TokenCreationModal({ campaignId, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [maxHp, setMaxHp] = useState(10);
  const [initiative, setInitiative] = useState(0);
  const [sizeWidth, setSizeWidth] = useState(1);
  const [sizeHeight, setSizeHeight] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("maxHp", maxHp);
    formData.append("initiative", initiative);
    formData.append("sizeWidth", sizeWidth);
    formData.append("sizeHeight", sizeHeight);
    formData.append("rotation", rotation);
    formData.append("notes", notes);
    formData.append("campaignId", campaignId);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tokens`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Creation failed");

      onCreated(data);
      onClose();
    } catch (err) {
      console.error("Error creating token:", err);
      alert("Failed to create token.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Create New Token</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Max HP
            <input
              type="number"
              value={maxHp}
              onChange={(e) => setMaxHp(e.target.value)}
            />
          </label>

          <label>
            Initiative
            <input
              type="number"
              value={initiative}
              onChange={(e) => setInitiative(e.target.value)}
            />
          </label>

          <label>
            Width
            <input
              type="number"
              value={sizeWidth}
              onChange={(e) => setSizeWidth(e.target.value)}
            />
          </label>

          <label>
            Height
            <input
              type="number"
              value={sizeHeight}
              onChange={(e) => setSizeHeight(e.target.value)}
            />
          </label>

          <label>
            Rotation
            <input
              type="number"
              value={rotation}
              onChange={(e) => setRotation(e.target.value)}
            />
          </label>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <label>
            Token Image
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>

          <div className={styles.actions}>
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
