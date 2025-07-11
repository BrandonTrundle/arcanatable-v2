// ./hooks/useTokenSettings.js
import { useState } from "react";
import usePlayerTokenDeletion from "./usePlayerTokenDeletion";
import usePlayerTokenSettings from "./usePlayerTokenSettings";

export default function useTokenSettings(map, setActiveMap, sessionCode) {
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);

  const handleDeleteToken = usePlayerTokenDeletion(
    map,
    setActiveMap,
    sessionCode,
    setTokenSettingsTarget
  );

  const { handleChangeOwner, handleChangeShowNameplate } =
    usePlayerTokenSettings(
      map,
      setActiveMap,
      sessionCode,
      setTokenSettingsTarget
    );

  return {
    tokenSettingsTarget,
    setTokenSettingsTarget,
    handleDeleteToken,
    handleChangeOwner,
    handleChangeShowNameplate,
  };
}
