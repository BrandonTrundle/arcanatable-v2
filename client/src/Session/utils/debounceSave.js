// utils/debounceSave.js
let timeoutId = null;

export function debounceSave(saveFunction, delay = 500) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    saveFunction();
    timeoutId = null;
  }, delay);
}
