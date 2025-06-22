import { useEffect, useState } from "react";

export function useSavedRolls(isSavedRollsView, API_BASE) {
  const [savedRolls, setSavedRolls] = useState([]);
  const [newRoll, setNewRoll] = useState({
    name: "",
    diceType: "d20",
    diceCount: 1,
    modifier: 0,
  });

  useEffect(() => {
    if (!isSavedRollsView) return;

    fetch(`${API_BASE}/api/saved-rolls`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setSavedRolls)
      .catch(console.error);
  }, [isSavedRollsView]);

  const createRoll = async () => {
    const formula = `${newRoll.diceCount}${newRoll.diceType}${
      newRoll.modifier !== 0
        ? ` ${newRoll.modifier > 0 ? "+" : "-"} ${Math.abs(newRoll.modifier)}`
        : ""
    }`;

    const res = await fetch(`${API_BASE}/api/saved-rolls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: newRoll.name, formula }),
    });

    const data = await res.json();
    if (res.ok) {
      setSavedRolls([...savedRolls, data]);
      setNewRoll({ name: "", diceType: "d20", diceCount: 1, modifier: 0 });
    }
  };

  const deleteRoll = async (id) => {
    await fetch(`${API_BASE}/api/saved-rolls/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setSavedRolls((prev) => prev.filter((r) => r._id !== id));
  };

  return {
    savedRolls,
    setSavedRolls,
    newRoll,
    setNewRoll,
    createRoll,
    deleteRoll,
  };
}
