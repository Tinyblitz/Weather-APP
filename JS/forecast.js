import icons from './icons.js';
import background from './background.js';
import selection from './selection.js';
import controls from './controls.js';
import summary from './summary.js';
import { formatDayOfTheWeek, handleIconCondition } from './GLOBAL_FUNCTIONS.js';
import { fadeOut } from './animations.js';

function forecast() {

    function convert(days) {
        return (    // Return array of days
            days.map((day, index) => {
                const time = day.hours[0].time;
                return {
                    'dayOfTheWeek': index === 0 ? 'Today' : formatDayOfTheWeek(day.datetime, 'short'),
                    'tempmax': Math.round(day.tempmax).toString() + '°', 
                    'tempmin': Math.round(day.tempmin).toString() + '°', 
                    'icon': icons[handleIconCondition(day.conditions, time)]
                };
            })
        );
    }

    return {
        updateByLocation: function(data) {
            const daysArr = convert(data.days);
            const dayEls = document.querySelectorAll('.forecast-stat');
            for (let i = 0; i < dayEls.length; i++) {
                fadeOut(dayEls[i]);
                dayEls[i].innerHTML = `
                    <p>${daysArr[i].dayOfTheWeek}</p>
                    ${daysArr[i].icon}
                    <p class="stat-temp">${daysArr[i].tempmin}</p>
                    <p>-</p>
                    <p class="stat-temp">${daysArr[i].tempmax}</p>
                `;
                dayEls[i].querySelector('svg').classList.add('forcast-stat-icon');
                dayEls[i].onclick = () => {     // Set background image, selection stats, hourly summary, and description
                    background.updateByDay(data,i);
                    selection.updateByDay(data,i);
                    controls.updateByDay(data,i);
                    summary.updateByDay(data,i);
                };
            }
        },
        setup: function(data) {
            this.updateByLocation(data);
        }
    };
}

export default forecast();