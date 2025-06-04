import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../../styles/DMToolkit/DMToolkitNavbar.module.css";
import Navbar from "../../General/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  "Monsters",
  "NPCs",
  "Potions",
  "Items",
  "Maps",
  "World",
  "Rules",
  "Tokens",
  "CheatSheet",
];

export default function DMToolkitNavbar({ currentCampaign, onCampaignChange }) {
  const navigate = useNavigate();

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.header}>
          <label htmlFor="campaignSelect">Campaign:</label>
          <select
            id="campaignSelect"
            className={styles.select}
            value={currentCampaign}
            onChange={(e) => onCampaignChange(e.target.value)}
          >
            {["Stormreach", "Elderglen", "Voidborn Saga"].map((campaign) => (
              <option key={campaign} value={campaign}>
                {campaign}
              </option>
            ))}
          </select>
        </div>

        <ul className={styles.navList}>
          {SECTIONS.map((section) => (
            <li key={section}>
              <NavLink
                to={`/dmtoolkit/${section.toLowerCase()}`}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
              >
                {section}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className={styles.navList}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft style={{ marginRight: "2rem" }} />
            Dashboard
          </button>
        </ul>
      </nav>
    </>
  );
}
