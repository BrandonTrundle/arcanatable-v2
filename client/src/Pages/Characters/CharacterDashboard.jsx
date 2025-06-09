import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Characters/CharacterDashboard.module.css";
import CharacterCard from "../../Components/Character/CharacterCard";
import Navbar from "../../Components/General/Navbar";

const CharacterDashboard = () => {
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const characterTemplate = {
      class: "Fighter",
      level: 7,
      race: "Human",
      imageUrl: "/images/BrennorFace.jpeg",
    };

    const mockCharacters = Array.from({ length: 10 }, (_, i) => ({
      ...characterTemplate,
      id: i + 1,
      name: `Blitzy ${i + 1}`,
    }));

    setCharacters(mockCharacters);
  }, []);

  const handleDelete = (id) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
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
