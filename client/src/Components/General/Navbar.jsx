import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/General/Navbar.module.css";
import logo from "../../assets/ArcanaTableLogo.png"; // Update path as needed

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="ArcanaTable Logo" />
      </div>

      <div className={styles.links}>
        <button className={styles.navButton}>Play Now</button>
        <button className={styles.navButton}>Marketplace</button>
        <button className={styles.navButton}>Tools</button>
        <button className={styles.navButton}>Community</button>
        <button className={styles.navButton}>Updates</button>
        <button className={styles.navButtonAlt}>
          Admin Panel (placeholder)
        </button>
      </div>

      <div className={styles.userSection}>
        <button
          className={styles.navButtonSecondary}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Sign In ▾
        </button>

        <div
          className={`${styles.signInMenu} ${
            menuOpen ? styles.signInMenuActive : ""
          }`}
        >
          <form
            className={styles.signInForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.navButton}>
              Sign In
            </button>
          </form>

          <div className={styles.signInLinks}>
            <button className={styles.navButtonAlt}>
              New to ArcanaTable? Sign Up
            </button>
            <button className={styles.navButtonAlt} disabled>
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
