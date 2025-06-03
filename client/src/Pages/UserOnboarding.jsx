import React from "react";
import styles from "../styles/Pages/UserOnboarding.module.css";

const UserOnboarding = () => {
  return (
    <div className={styles.overlay}>
      {/* Background Image */}
      <div className={styles.background} />

      {/* Placeholder Form UI */}
      <div className={styles.container}>
        <h2 className={styles.title}>User Onboarding</h2>
        <p className={styles.subtitle}>
          Let ArcanaTable know what kind of gamer you are.
        </p>

        <form className={styles.form}>
          <label>
            Placeholder Field 1:
            <select className={styles.select}>
              <option>Option A</option>
              <option>Option B</option>
            </select>
          </label>

          <label>
            Placeholder Field 2:
            <select className={styles.select}>
              <option>Option X</option>
              <option>Option Y</option>
            </select>
          </label>

          <label>
            Placeholder Field 2:
            <select className={styles.select}>
              <option>Option X</option>
              <option>Option Y</option>
            </select>
          </label>

          <div className={styles.buttons}>
            <button type="submit">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserOnboarding;
