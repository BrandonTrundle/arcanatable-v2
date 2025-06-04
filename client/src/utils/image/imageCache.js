const imageCache = new Map();

export function getCachedImage(src) {
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }

  const img = new Image();
  img.crossOrigin = "anonymous"; // ✅ set this first
  img.src = src; // ✅ then set src
  imageCache.set(src, img);

  return img;
}
