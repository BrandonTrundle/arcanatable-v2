// ./hooks/useTokenHandlers.js
import usePlayerTokenDropHandler from "./usePlayerTokenDropHandler";
import usePlayerTokenMovement from "./usePlayerTokenMovement";
import usePlayerTokenDeletion from "./usePlayerTokenDeletion";

export default function useTokenHandlers({
  map,
  setActiveMap,
  sessionCode,
  user,
  stageRef,
  setTokenSettingsTarget,
}) {
  const handleDrop = usePlayerTokenDropHandler(
    map,
    setActiveMap,
    sessionCode,
    user,
    stageRef
  );

  const handleTokenMove = usePlayerTokenMovement(
    map,
    setActiveMap,
    sessionCode,
    user
  );

  const handleDeleteToken = usePlayerTokenDeletion(
    map,
    setActiveMap,
    sessionCode,
    setTokenSettingsTarget
  );

  return {
    handleDrop,
    handleTokenMove,
    handleDeleteToken,
  };
}
