import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Pages/HomePage.module.css";
import Navbar from "../Components/General/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>Welcome to ArcanaTable</h1>
        <p>Your tabletop adventures await. Discover, create, and play.</p>
        <div className={styles["button-center"]}>
          <button onClick={() => navigate("/sign-up")}>
            Create Free Account
          </button>
        </div>

        <section className={styles.section}>
          <h2>Features</h2>
          <ul>
            <li>
              <div>
                <strong>Virtual Dice:</strong>
              </div>
              Roll with style and precision. Save your rolls for later.
            </li>
            <li>
              <div>
                <strong>Custom Maps:</strong>
              </div>
              Explore immersive, editable battlemaps.
            </li>
            <li className={styles.featuresbox3}>
              <div>
                <strong>Narrative Tools:</strong>
              </div>
              Build worlds and stories with ease.
            </li>
          </ul>
        </section>

        <section className={styles.section2}>
          <h2>What is ArcanaTable?</h2>
          <p>
            ArcanaTable is a next-generation virtual tabletop for TTRPG players
            and GMs. Designed for creativity, immersion, and seamless game flow.
          </p>
        </section>

        <section className={styles.section3}>
          <h2>Live Campaign Preview</h2>
          <p>[ Map Preview Placeholder ]</p>
        </section>

        <section className={styles.section4}>
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of adventurers on ArcanaTable.</p>
          <div className={styles["button-center"]}>
            <button onClick={() => navigate("/sign-up")}>
              Sign up now for free
            </button>
          </div>
        </section>

        <footer>
          <p>© 2025 ArcanaTable. All rights reserved.</p>
          <nav>
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a>
          </nav>
        </footer>
      </main>
    </>
  );
};

export default HomePage;
