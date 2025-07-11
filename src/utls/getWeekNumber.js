export function getWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));

    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const diff = (tempDate - week1) / (1000 * 60 * 60 * 24);
    return 1 + Math.floor(diff / 7);
  }