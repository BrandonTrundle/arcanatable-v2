import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Characters/CharacterDashboard.module.css";
import CharacterCard from "../../Components/Character/CharacterCard";
import Navbar from "../../Components/General/Navbar";
import { AuthContext } from "../../context/AuthContext";

const CharacterDashboard = () => {
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/characters`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch characters: ${errorText}`);
        }

        const data = await response.json();
        setCharacters(Array.isArray(data.characters) ? data.characters : []);
      } catch (err) {
        console.error("Error fetching characters:", err);
      }
    };

    if (user?.token) {
      loadCharacters();
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/characters/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete character");
      }

      setCharacters((prev) => prev.filter((char) => char._id !== id));
    } catch (err) {
      console.error("Error deleting character:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Your Characters</h1>
        <button
          className={styles.createBtn}
          onClick={() => navigate("/characters/create")}
        >
          + New Character
        </button>

        <div className={styles.grid}>
          {characters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CharacterDashboard;
