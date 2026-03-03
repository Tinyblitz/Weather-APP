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

export function formatDayOfTheWeek(date, type) {
    return new Date(date).toLocaleDateString('en-US', { weekday: type })
}

export function handleCondition(conditions) {

    const conditionsArr = ['clear', 'storm', 'rain', 'partially', 'cloudy'];     // Ordered by priority

    const formattedConditions = conditions.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    let condition = conditionsArr[0];       // Default condition is clear
    for (const c of conditionsArr) {
        if (formattedConditions.includes(c)) {
            condition = c;
            break;
        }
    }
    if (condition === "partially") condition = 'partially cloudy';
    return condition;
}

export function handleIconCondition(conditions, time) {
    let condition = handleCondition(conditions);
    if (condition === 'clear'){
        if (isItDay(time)) condition += '-day';
        else condition += '-night';
    }
    return condition;
}