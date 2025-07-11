import { useEffect } from "react";
import socket from "../../../../socket";
import { debounceSave } from "../../../utils/debounceSave";
import { saveMap } from "../../../utils/saveMap";

export default function useMapAssetSocketHandlers(
  setActiveMap,
  stageRef,
  authToken
) {
  useEffect(() => {
    const handleMapAssetPlaced = ({ asset, layer }) => {
      setActiveMap((prev) => {
        if (!prev) return prev;

        const existingAssets = prev.layers[layer]?.assets || [];
        const updatedMap = {
          ...prev,
          layers: {
            ...prev.layers,
            [layer]: {
              ...prev.layers[layer],
              assets: [...existingAssets, asset],
            },
          },
        };

        debounceSave(() => saveMap(updatedMap, authToken));
        return updatedMap;
      });
    };

    const handleMapAssetMoved = ({ assetId, position }) => {
      setActiveMap((prev) => {
        const updated = { ...prev };
        for (const [layerKey, layer] of Object.entries(updated.layers || {})) {
          if (!layer.assets) continue;

          const assetIndex = layer.assets.findIndex((a) => a.id === assetId);
          if (assetIndex !== -1) {
            const newAssets = [...layer.assets];
            newAssets[assetIndex] = {
              ...newAssets[assetIndex],
              position,
              entityId:
                newAssets[assetIndex].entityId ?? newAssets[assetIndex].id,
              entityType: newAssets[assetIndex].entityType ?? "mapAsset",
            };
            updated.layers[layerKey].assets = newAssets;
            break;
          }
        }

        debounceSave(() => saveMap(updated, authToken));
        return updated;
      });
    };

    const handleMapAssetRotated = ({ assetId, rotation }) => {
      setActiveMap((prev) => {
        const updated = { ...prev };
        for (const [layerKey, layer] of Object.entries(updated.layers || {})) {
          if (!layer.assets) continue;

          const assetIndex = layer.assets.findIndex((a) => a.id === assetId);
          if (assetIndex !== -1) {
            const newAssets = [...layer.assets];
            newAssets[assetIndex] = {
              ...newAssets[assetIndex],
              rotation,
              entityId:
                newAssets[assetIndex].entityId ?? newAssets[assetIndex].id,
              entityType: newAssets[assetIndex].entityType ?? "mapAsset",
            };
            updated.layers[layerKey].assets = newAssets;
            break;
          }
        }

        debounceSave(() => saveMap(updated, authToken));
        return updated;
      });
    };

    const handleMapAssetLayerChanged = ({ assetId, fromLayer, toLayer }) => {
      setActiveMap((prev) => {
        const asset = prev.layers?.[fromLayer]?.assets?.find(
          (a) => a.id === assetId
        );
        if (!asset) return prev;

        const updated = { ...prev };
        updated.layers[fromLayer].assets = updated.layers[
          fromLayer
        ].assets.filter((a) => a.id !== assetId);

        const toAssets = updated.layers[toLayer]?.assets || [];
        updated.layers[toLayer] = {
          ...updated.layers[toLayer],
          assets: [...toAssets, asset],
        };

        debounceSave(() => saveMap(updated, authToken));
        return updated;
      });

      const stage = stageRef?.current?.getStage?.();
      if (stage) {
        const toLayerNode = stage.findOne(`#${toLayer}AssetLayer`);
        toLayerNode?.batchDraw();
      }
    };

    const handleMapAssetDeleted = ({ assetId, layer }) => {
      setActiveMap((prev) => {
        const updated = { ...prev };
        if (!updated.layers?.[layer]?.assets) return prev;

        updated.layers[layer].assets = updated.layers[layer].assets.filter(
          (a) => a.id !== assetId
        );

        debounceSave(() => saveMap(updated, authToken));
        return updated;
      });
    };

    socket.on("mapAssetPlaced", handleMapAssetPlaced);
    socket.on("mapAssetMoved", handleMapAssetMoved);
    socket.on("mapAssetRotated", handleMapAssetRotated);
    socket.on("mapAssetLayerChanged", handleMapAssetLayerChanged);
    socket.on("mapAssetDeleted", handleMapAssetDeleted);

    return () => {
      socket.off("mapAssetPlaced", handleMapAssetPlaced);
      socket.off("mapAssetMoved", handleMapAssetMoved);
      socket.off("mapAssetRotated", handleMapAssetRotated);
      socket.off("mapAssetLayerChanged", handleMapAssetLayerChanged);
      socket.off("mapAssetDeleted", handleMapAssetDeleted);
    };
  }, [setActiveMap, stageRef, authToken]);
}
