import { useEffect, useMemo, useState } from "react";

export default function useDMComputedValues({ activeMap, user, mapAssets }) {
  const [filteredMapAssets, setFilteredMapAssets] = useState([]);

  // Filter assets as soon as they load
  useEffect(() => {
    if (Array.isArray(mapAssets)) {
      setFilteredMapAssets(mapAssets);
    }
  }, [mapAssets]);

  const dmOwnedTokens = useMemo(() => {
    if (!activeMap?.layers) return [];

    return Object.values(activeMap.layers)
      .flatMap((layer) => layer.tokens || [])
      .filter(
        (token) =>
          Array.isArray(token.ownerIds) && token.ownerIds.includes(user?.id)
      );
  }, [activeMap, user]);

  return {
    filteredMapAssets,
    setFilteredMapAssets,
    dmOwnedTokens,
  };
}
