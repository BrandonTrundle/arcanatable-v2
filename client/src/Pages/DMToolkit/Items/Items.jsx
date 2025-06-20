import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Items.module.css";
import itemTemplate from "../../../Mock/Item.json";
import ItemForm from "../../../Components/DMToolkit/Items/ItemForm";
import ItemCard from "../../../Components/DMToolkit/Items/ItemCard";
import ItemDetail from "../../../Components/DMToolkit/Items/ItemDetail";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";

export default function Items() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { user } = useContext(AuthContext);
  const [campaignList, setCampaignList] = useState([]);

  const handleItemSubmit = (formData, campaign) => {
    //   console.log("Submitting Item:", formData, "for campaign:", campaign);
    setShowForm(false);
    // TODO: Hook into backend or local state store
  };

  useEffect(() => {
    if (!user?.token) return;

    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns(user);
        setCampaignList(campaigns);
      } catch (err) {
        console.error("Could not load campaigns", err);
      }
    };

    loadCampaigns();
  }, [user]);

  return (
    <div className={styles.items}>
      <h1 className={styles.title}>
        Items –{" "}
        {campaignList.find((c) => c._id === currentCampaign)?.name ||
          "Unassigned"}
      </h1>

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
