import React from "react";
import styles from "../../styles/Characters/CharacterCard.module.css";
import defaultPortrait from "../../assets/defaultav.png";
import { useNavigate } from "react-router-dom";

const CharacterCard = ({ character, onDelete }) => {
  const {
    _id,
    name = "Unnamed",
    class: charClass = "Classless",
    level = 1,
    race = "Unknown",
    portraitImage,
  } = character;

  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <img
        src={portraitImage || defaultPortrait}
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
          onClick={() => navigate(`/characters/edit/${_id}`)}
        >
          Edit
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(_id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;
