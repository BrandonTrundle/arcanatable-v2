import useImage from "use-image";

export function useMapImage(map) {
  const [mapImage] = useImage(map?.image, "anonymous");
  const imageReady = !!mapImage;
  return { mapImage, imageReady };
}
