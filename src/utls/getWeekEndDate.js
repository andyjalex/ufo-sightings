export function getWeekEndDate(date) {
  const cloned = new Date(date); // clone to avoid mutation
  cloned.setDate(cloned.getDate() + 6);
  return cloned;
}
