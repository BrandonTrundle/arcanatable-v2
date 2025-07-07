// utils/zIndexManager.js
let currentZIndex = 1000;

export function getNextZIndex() {
  return ++currentZIndex;
}
