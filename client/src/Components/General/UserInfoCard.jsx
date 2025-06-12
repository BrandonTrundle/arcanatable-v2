import { useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/General/UserInfoCard.module.css";
import defaultAvatar from "../../assets/defaultav.png";
import { AuthContext } from "../../context/AuthContext";

const UserInfoCard = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    //   console.log("File selected:", file);

    if (!file || !user?.id) {
      console.warn("No file selected or user ID missing.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    //   console.log("Uploading avatar for user ID:", user.id);
    //   console.log("File being sent:", file.name, file.type, file.size);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${user.id}/avatar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      //    console.log("Upload response:", result);

      if (!response.ok) {
        console.error("Upload failed response:", result);
        throw new Error(result.message || "Upload failed");
      }

      //    console.log("Setting avatar URL to:", result.avatarUrl);
      setAvatarUrl(`${result.avatarUrl}?t=${Date.now()}`);
      updateUser({ avatar: result.avatarUrl });
      const updatedUser = { ...user, avatar: result.avatarUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      //     console.log("Avatar updated successfully:", result.avatarUrl);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      alert("Avatar upload failed");
    } finally {
      event.target.value = "";
      //      console.log("File input reset.");
    }
  };

  //  console.log("User object from context:", user);

  return (
    <div className={styles.card}>
      <img
        src={avatarUrl || defaultAvatar}
        alt="User Avatar"
        className={styles.avatar}
        onClick={handleAvatarClick}
        style={{ cursor: "pointer" }}
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className={styles.details}>
        <h3 className={styles.name}>{user?.username || "Adventurer"}</h3>
        <p className={styles.subscription}>Tier: Free</p>
        <p className={styles.date}>
          Member since:{" "}
          {user?.memberSince
            ? new Date(user.memberSince).toLocaleDateString()
            : "Unknown"}
        </p>
        <p className={styles.hours}>
          Hours Played:{" "}
          {user?.hoursPlayed !== undefined ? `${user.hoursPlayed} hrs` : "N/A"}
        </p>

        <button className={styles.button} onClick={() => navigate("/account")}>
          Manage Account
        </button>

        <div className={styles.actions}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>📬 Messages:</span>
            <span className={styles.statValue}>3</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>🔔 Notifications:</span>
            <span className={styles.statValue}>5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
