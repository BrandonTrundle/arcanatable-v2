import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const EquipmentBlock = ({
  equipment,
  handleEquipmentChange,
  addEquipment,
  removeEquipment,
  currency,
  setCurrency,
}) => {
  return (
    <div className={styles.equipment_section}>
      <div className={styles.currency_column}>
        {["cp", "sp", "ep", "gp", "pp"].map((type) => (
          <div key={type} className={styles.currency_row}>
            <label>{type.toUpperCase()}</label>
            <input
              type="number"
              min="0"
              className={styles.currency_input}
              placeholder="0"
              value={currency[type] || 0}
              onChange={(e) => {
                const updatedCurrency = {
                  ...currency,
                  [type]: parseInt(e.target.value) || 0,
                };
                setCurrency(updatedCurrency);
              }}
            />
          </div>
        ))}
      </div>

      <div className={styles.equipment_column}>
        <div className={styles.equipment_list}>
          {equipment.map((item, index) => (
            <div key={index} className={styles.equipment_item}>
              <input
                type="text"
                className={styles.equipment_input}
                placeholder="Equipment Item"
                value={item}
                onChange={(e) => handleEquipmentChange(index, e.target.value)}
              />
              <button
                className={styles.delete_equipment_button}
                onClick={() => removeEquipment(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button className={styles.add_equipment_button} onClick={addEquipment}>
          + Add Equipment
        </button>
      </div>
    </div>
  );
};

export default EquipmentBlock;
