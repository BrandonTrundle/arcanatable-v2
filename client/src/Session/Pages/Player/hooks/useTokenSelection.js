// ./hooks/useTokenSelection.js
import usePlayerTokenSelection from "./usePlayerTokenSelection";

export default function useTokenSelection(map, user) {
  const { selectedTokenId, handleSelectToken } = usePlayerTokenSelection(
    map,
    user
  );

  return {
    selectedTokenId,
    handleSelectToken,
  };
}
