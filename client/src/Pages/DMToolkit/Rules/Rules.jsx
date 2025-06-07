import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Rules.module.css";
import ruleTemplate from "../../../Mock/Rule.json";
import RuleForm from "../../../Components/DMToolkit/Rules/RuleForm";
import RuleCard from "../../../Components/DMToolkit/Rules/RuleCard";
import RuleDetail from "../../../Components/DMToolkit/Rules/RuleDetail";

export default function Rules() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRule, setSelectedRule] = useState(null);

  const handleRuleSubmit = (formData, campaign) => {
    setShowForm(false);
    // TODO: Save to state or backend
  };

  return (
    <div className={styles.rules}>
      <h1 className={styles.title}>Rules – {currentCampaign}</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Rule"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search rules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <RuleForm
          currentCampaign={currentCampaign}
          onSubmit={handleRuleSubmit}
          defaultValues={ruleTemplate.content}
        />
      )}

      <div className={styles.cardGrid}>
        {Array.from({ length: 5 }) // placeholder loop
          .map(() => ruleTemplate.content)
          .filter((rule) =>
            rule.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((rule, i) => (
            <RuleCard
              key={i}
              rule={rule}
              onClick={() => setSelectedRule(rule)}
            />
          ))}
      </div>

      {selectedRule && (
        <RuleDetail rule={selectedRule} onClose={() => setSelectedRule(null)} />
      )}
    </div>
  );
}
