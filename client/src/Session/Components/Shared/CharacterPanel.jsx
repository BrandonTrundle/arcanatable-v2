import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import styles from "../../styles/CharacterPanel.module.css";
import characterIcon from "../../../assets/icons/pcIcon.png";
import socket from "../../../socket";
import { getNextZIndex } from "../../utils/zIndexManager";

const CharacterPanel = forwardRef(
  ({ onClose, campaign, user, onOpenCharacter }, ref) => {
    const panelRef = useRef(null);
    const pos = useRef({ x: 0, y: 0 });
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [zIndex, setZIndex] = useState(getNextZIndex());
    const bringToFront = () => setZIndex(getNextZIndex());

    const isDM = campaign?.creatorId === user._id;

    const fetchCharacters = async () => {
      if (!campaign || !user) return;

      try {
        const token = user.token;

        const url = isDM
          ? `${
              import.meta.env.VITE_API_BASE_URL
            }/api/characters/campaign?campaignId=${campaign._id}`
          : `${import.meta.env.VITE_API_BASE_URL}/api/characters?campaignId=${
              campaign._id
            }&creator=${user._id}`;

        // console.log("[CharacterPanel] Fetching characters with URL:", url);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("[CharacterPanel] Bad response:", res.status);
          return;
        }

        const data = await res.json();
        //  console.log("[CharacterPanel] Characters fetched:", data.characters);

        setCharacters(data.characters || []);
      } catch (err) {
        console.error("[CharacterPanel] Failed to fetch characters:", err);
      }
    };

    useImperativeHandle(ref, () => ({
      refreshCharacters: fetchCharacters,
    }));

    useEffect(() => {
      fetchCharacters();
    }, [campaign, user]);

    const startDrag = (e) => {
      bringToFront();
      const panel = panelRef.current;
      pos.current = {
        x: e.clientX - panel.offsetLeft,
        y: e.clientY - panel.offsetTop,
      };
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    };

    const drag = (e) => {
      const panel = panelRef.current;
      panel.style.left = `${e.clientX - pos.current.x}px`;
      panel.style.top = `${e.clientY - pos.current.y}px`;
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    };

    return (
      <div
        className={styles.panel}
        ref={panelRef}
        style={{ position: "absolute", top: 100, left: 100, zIndex }}
        onMouseDown={bringToFront}
      >
        <div
          className={styles.header}
          onMouseDown={startDrag}
          onDoubleClick={() => setIsCollapsed((prev) => !prev)}
        >
          <img
            src={characterIcon}
            alt="Characters"
            className={styles.icon}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <span>Characters</span>
          <button onClick={onClose}>×</button>
        </div>

        {!isCollapsed && (
          <div className={styles.content}>
            {characters.length === 0 ? (
              <div className={styles.emptyState}>No characters found.</div>
            ) : (
              characters.map((char) => (
                <div
                  key={char._id}
                  className={styles.characterCard}
                  draggable
                  onDragStart={(e) => {
                    const tokenPayload = {
                      acitveToken: false,
                      effects: [],
                      id: crypto.randomUUID(),
                      name: char.name,
                      image: char.portraitImage,
                      size: { width: 1, height: 1 },
                      position: { x: 0, y: 0 },
                      hp: char.hp || 1,
                      maxHp: char.maxHp || 1,
                      isVisible: true,
                      lightEmit: null,
                      rotation: 0,
                      isPC: true,
                      entityType: "PC",
                      pcId: char._id,
                      ownerId: user._id,
                      ownerIds: [user._id],
                    };
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify(tokenPayload)
                    );
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                >
                  <img
                    src={char.portraitImage}
                    alt={char.name}
                    className={styles.portrait}
                  />
                  <div className={styles.details}>
                    <div className={styles.name}>{char.name}</div>
                    <div className={styles.meta}>
                      {char.class} - Level {char.level}
                    </div>
                    <button
                      className={styles.openButton}
                      onClick={() => onOpenCharacter(char)}
                    >
                      Open Character Sheet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }
);

export default CharacterPanel;
