import icons from './icons.js';
import background from './background.js';
import selection from './selection.js';
import { formatDayOfTheWeek, formatHour, handleIconCondition } from './GLOBAL_FUNCTIONS.js';
import { fadeOut } from './animations.js';

function summary() {

    const summaryDate = document.getElementById('summary-date');

    function convert(data, day = 0) {
        return {    // Return object with day of the week and an array of hours
            'dayOfTheWeek': day === 0 ? 'Today' : formatDayOfTheWeek(data.days[day].datetime),
            'hours': 
                data.days[day].hours.map((hour, index) => {
                    return {
                        'time': index === 0 ? 'Now' : formatHour(hour.time),
                        'icon': icons[handleIconCondition(hour.conditions, hour.time)],
                        'temp': Math.round(hour.temp).toString() + '°'
                    };
                })
        };
    }

    function update(data, hoursObj, day = 0) {
        fadeOut(summaryDate);
        summaryDate.textContent = hoursObj.dayOfTheWeek;

        const hoursArr = hoursObj.hours;

        const hourEls = document.querySelectorAll('.summary-stat');
        for (let i = 0; i < hourEls.length; i++) {
            fadeOut(hourEls[i]);
            hourEls[i].innerHTML = `
                <p>${hoursArr[i].time}</p>
                ${hoursArr[i].icon}
                <p class="stat-temp">${hoursArr[i].temp}</p>
            `;
            hourEls[i].querySelector('svg').classList.add('summary-stat-icon');
            hourEls[i].onclick = () => {     // Set background image, selection stats
                background.updateByHour(data,day,i);
                selection.updateByHour(data,day,i);
            };
        }
    }

    return {
        updateByLocation: function (data) {
            update(data, convert(data));
        },
        updateByDay: function(data,day) {
            update(data, convert(data,day), day);
        },
        setup: function(data) {
            this.updateByLocation(data);
        }
    }
}

export default summary();