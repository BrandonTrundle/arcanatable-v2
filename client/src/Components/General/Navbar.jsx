import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/General/Navbar.module.css";
import logo from "../../assets/ArcanaTableLogo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      login(data.token, data.user);
      setMenuOpen(false);
      navigate("/dashboard");
    } catch (err) {
      alert("Login error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // 👈 redirect to homepage
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="ArcanaTable Logo" />
      </div>

      <div className={styles.links}>
        <button
          className={styles.navButton}
          onClick={() => navigate(user ? "/dashboard" : "/sign-up")}
        >
          {user ? "Dashboard" : "Play Now"}
        </button>
        <button className={styles.navButton}>Marketplace</button>
        <button className={styles.navButton}>Tools</button>
        <button className={styles.navButton}>Community</button>
        <button className={styles.navButton}>Updates</button>
        {user?.role === "Admin" || user?.role === "Owner" ? (
          <button className={styles.navButtonAlt}>Admin Panel</button>
        ) : null}
      </div>

      <div className={styles.userSection}>
        {user ? (
          <button className={styles.navButtonSecondary} onClick={handleLogout}>
            Sign Out
          </button>
        ) : (
          <button
            className={styles.navButtonSecondary}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Sign In ▾
          </button>
        )}

        {!user && (
          <div
            className={`${styles.signInMenu} ${
              menuOpen ? styles.signInMenuActive : ""
            }`}
          >
            <form className={styles.signInForm} onSubmit={handleSignIn}>
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
              <button
                className={styles.navButtonAlt}
                onClick={() => navigate("/sign-up")}
              >
                New to ArcanaTable? Sign Up
              </button>
              <button className={styles.navButtonAlt} disabled>
                Forgot password?
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
