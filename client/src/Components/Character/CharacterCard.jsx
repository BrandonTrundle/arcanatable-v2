import React from "react";
import styles from "../../styles/Characters/CharacterCard.module.css";
import defaultPortrait from "../../assets/defaultav.png";
import { useNavigate } from "react-router-dom";

const CharacterCard = ({ character, onDelete }) => {
  const { name, class: charClass, level, race, imageUrl } = character;
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <img
        src={imageUrl || defaultPortrait}
        alt={`${name} portrait`}
        className={styles.portrait}
      />
      <div className={styles.info}>
        <h3>{name}</h3>
        <p>
          {race} {charClass} (Level {level})
        </p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => navigate(`/characters/edit/${character.id}`)}
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(character.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;
