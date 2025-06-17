// client/src/Session/Pages/Player/PlayerMapCanvas.jsx
import React, { useRef } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";

import styles from "../../styles/MapCanvas.module.css";

export default function PlayerMapCanvas({ map, fogVisible }) {
  const [mapImage] = useImage(map?.image, "anonymous");
  const imageReady = !!mapImage;

  const stageRef = useRef();

  if (!map) {
    return (
      <div className={styles.mapCanvas}>Waiting for DM to load map...</div>
    );
  }

  const stageWidth = map.width * map.gridSize;
  const stageHeight = map.height * map.gridSize;

  return (
    <div className={styles.mapCanvas}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        style={{ border: "2px solid #444" }}
      >
        <SessionStaticMapLayer
          mapImage={mapImage}
          imageReady={imageReady}
          gridVisible={true} // Always visible for players?
          map={map}
          notes={map.notes || []}
        />

        <SessionFogAndBlockerLayer
          width={map.width}
          height={map.height}
          gridSize={map.gridSize}
          revealedCells={map.fogOfWar?.revealedCells || []}
          blockingCells={map.fogOfWar?.blockingCells || []}
          showFog={fogVisible}
          showBlockers={false} // Maybe only DM sees blockers?
        />

        <Layer>
          <SessionMapAssetLayer
            map={map}
            gridSize={map.gridSize}
            activeLayer="player"
            selectedAssetId={null}
            onSelectAsset={() => {}}
            onMoveAsset={() => {}}
          />

          <SessionMapTokenLayer
            map={map}
            gridSize={map.gridSize}
            activeLayer="player"
            selectedTokenId={null}
            onSelectToken={() => {}}
            onTokenMove={() => {}}
          />
        </Layer>

        <Layer>{/* Reserved for future layers */}</Layer>
      </Stage>
    </div>
  );
}
