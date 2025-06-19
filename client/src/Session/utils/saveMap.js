export function saveMap(updatedMap, token) {
  if (!token || typeof token !== "string" || token.split(".").length !== 3) {
    console.error("❌ Invalid or missing token passed to saveMap:", token);
    return;
  }

  return fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/maps/${updatedMap._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedMap),
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to save map");
      return res.json();
    })
    .then((data) => {
      console.log("✅ Map saved successfully", data);
    })
    .catch((err) => {
      console.error("❌ Error saving map:", err);
    });
}
