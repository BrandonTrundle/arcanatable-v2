import React from "react";
import styles from "../styles/Pages/Signup.module.css";

const Signup = () => {
  return (
    <div className={styles.page}>
      <div className={styles.background} />

      <div className={styles.container}>
        <h2 className={styles.title}>Signup Placeholder</h2>

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input type="text" placeholder="Enter username" />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" placeholder="Enter email" />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" placeholder="Enter password" />
          </div>

          <div className={styles.buttons}>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
