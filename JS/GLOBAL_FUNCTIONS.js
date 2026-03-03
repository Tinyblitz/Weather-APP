const DAY_START = 7;
const NIGHT_START = 19;

export function isItDay(hour) {
    if (hour >= DAY_START && hour < NIGHT_START) return true;
    else return false;
}

export function formatHour(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12; // converts 0 → 12
  return `${adjustedHour} ${period}`;
}

export function handleCondition(cond) {

    const conditionsArr = ['clear', 'storm', 'rain', 'partially', 'cloudy'];     // Ordered by priority

    const conditions = cond.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    let condition = conditionsArr[0];       // Default condition is clear
    for (const c of conditionsArr) {
        if (conditions.includes(c)) {
            condition = c;
            break;
        }
    }

    if (condition === "partially") condition = 'partially cloudy';

    return condition;
}