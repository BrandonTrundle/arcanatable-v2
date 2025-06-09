import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Pages/UserOnboarding.module.css";

const UserOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    experience: "",
    preferredRole: "",
    playStyle: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/users/onboarding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, onboarded: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Onboarding failed");
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.background} />
      <div className={styles.container}>
        <h2 className={styles.title}>User Onboarding</h2>
        <p className={styles.subtitle}>
          Let ArcanaTable know what kind of gamer you are.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            How experienced are you with TTRPGs?
            <select
              name="experience"
              className={styles.select}
              value={formData.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Veteran">Veteran</option>
            </select>
          </label>

          <label>
            What is your preferred role?
            <select
              name="preferredRole"
              className={styles.select}
              value={formData.preferredRole}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Player">Player</option>
              <option value="DM">DM</option>
              <option value="Both">Both</option>
            </select>
          </label>

          <label>
            Who do you like to play with?
            <select
              name="playStyle"
              className={styles.select}
              value={formData.playStyle}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Meet new people">Meet new people</option>
              <option value="Play with friends">Play with friends</option>
              <option value="Either">Either</option>
            </select>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <button type="submit">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserOnboarding;
