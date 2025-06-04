import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/Tokens.module.css";
import TokenForm from "../../../Components/DMToolkit/Tokens/TokenForm";
import TokenCard from "../../../Components/DMToolkit/Tokens/TokenCard";
import TokenDetail from "../../../Components/DMToolkit/Tokens/TokenDetail";
import tokenTemplate from "../../../Mock/Token.json"; // temporary mock

export default function Tokens() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);

  const mockTokens = [
    tokenTemplate,
    {
      ...tokenTemplate,
      id: "token-002",
      name: "Goblin Brute",
      displayName: "Goblin Brute",
      image: "/images/VallaFace.jpg",
      hp: 15,
      maxHp: 15,
      initiative: 8,
      size: { width: 1, height: 1 },
      statusConditions: [],
      effects: [],
      notes: "Aggressive scout",
    },
    {
      ...tokenTemplate,
      id: "token-003",
      name: "Elven Archer",
      displayName: "Elven Archer",
      image: "/images/CoraFace.jpeg",
      hp: 18,
      maxHp: 20,
      initiative: 14,
      size: { width: 1, height: 1 },
      statusConditions: ["Hidden"],
      effects: [],
      notes: "Set up ambush in trees",
    },
    {
      ...tokenTemplate,
      id: "token-004",
      name: "Skeleton Mage",
      displayName: "Skeleton Mage",
      image: "/images/MarlaFace.jpeg",
      hp: 12,
      maxHp: 12,
      initiative: 11,
      size: { width: 1, height: 1 },
      statusConditions: [],
      effects: [
        {
          name: "Mage Armor",
          icon: "/icons/mage_armor.png",
          duration: 8,
        },
      ],
      notes: "Casts Fireball every 2 rounds",
    },
  ];

  const handleTokenSubmit = (formData) => {
    //   console.log("Token created:", formData);
    setShowForm(false);
    // TODO: add to state when backend is integrated
  };

  return (
    <div className={styles.tokens}>
      <h1 className={styles.title}>Tokens Library</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Token"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <TokenForm defaultValues={tokenTemplate} onSubmit={handleTokenSubmit} />
      )}

      <div className={styles.cardGrid}>
        {mockTokens
          .filter((token) =>
            token.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((token) => (
            <TokenCard
              key={token.id}
              token={token}
              onClick={() => setSelectedToken(token)}
            />
          ))}
      </div>

      {selectedToken && (
        <TokenDetail
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}
