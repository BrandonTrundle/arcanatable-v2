export function getHpColor(hp, maxHp) {
  const ratio = hp / maxHp;
  if (ratio <= 0.33) return "red";
  if (ratio <= 0.66) return "yellow";
  return "green";
}
