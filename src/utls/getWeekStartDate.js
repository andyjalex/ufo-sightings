export function getWeekStartDate(date) {
    const cloned = new Date(date); // clone to avoid mutation
    const day = cloned.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = cloned.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    cloned.setDate(diff);
    return cloned;
  }