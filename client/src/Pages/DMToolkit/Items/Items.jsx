import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Items.module.css";
import itemTemplate from "../../../Mock/Item.json";
import ItemForm from "../../../Components/DMToolkit/Items/ItemForm";
import ItemCard from "../../../Components/DMToolkit/Items/ItemCard";
import ItemDetail from "../../../Components/DMToolkit/Items/ItemDetail";

export default function Items() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSubmit = (formData, campaign) => {
    //   console.log("Submitting Item:", formData, "for campaign:", campaign);
    setShowForm(false);
    // TODO: Hook into backend or local state store
  };

  return (
    <div className={styles.items}>
      <h1 className={styles.title}>Items – {currentCampaign}</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Item"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <ItemForm
          currentCampaign={currentCampaign}
          onSubmit={handleItemSubmit}
          defaultValues={itemTemplate.content}
        />
      )}

      <div className={styles.cardGrid}>
        {Array.from({ length: 10 })
          .map(() => itemTemplate.content)
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item, i) => (
            <ItemCard
              key={i}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
      </div>

      {selectedItem && (
        <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
