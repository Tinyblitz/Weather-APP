import icons from './icons.js';
import controls from './controls.js';
import { fadeOut } from './animations.js';
import { isItDay, formatHour, handleCondition } from './GLOBAL_FUNCTIONS.js';

function selection() {

    const numElements = {
        'location': document.getElementById('selection-location-text'),
        'date': document.getElementById('selection-date'),
        'time': document.getElementById('selection-time'),
        'feelslike': document.getElementById('selection-temp'),
        'humidity': document.querySelector('#stat-humidity .selection-stat-text'),
        'precipprob': document.querySelector('#stat-precipprob .selection-stat-text'),
        'windspeed': document.querySelector('#stat-windspeed .selection-stat-text'),
        'uvindex': document.querySelector('#stat-uvindex .selection-stat-text'),
        'icon': document.getElementById('selection-icon')
    };

    const doNotUpdateByDay = ['location'];
    const doNotUpdateByHour = ['location', 'date'];

    const setEl = (el, stat) => el.innerHTML = stat;

    // function updateElements() {

    // }
    
    return {
        convert: function(data,day = 0,hour = null) {

            const time = !hour ? data.days[day].hours[0].time : data.days[day].hours[hour].time;
            const formattedTime = formatHour(time);
            let condition = handleCondition(!hour ? data.days[day].conditions : data.days[day].hours[hour].conditions);
            if (condition === 'clear'){
                if (isItDay(time)) condition += '-day';
                else condition += '-night';
            }
            const icon = icons[condition];
            let temp = !hour ? Math.round(data.days[day].feelslike).toString() : Math.round(data.days[day].hours[hour].feelslike).toString();
            if (controls.isTempCelsius()) temp = controls.fahrenheightToCelsius(temp);

            return {
                'location': data.location,
                'date': new Date(data.days[day].datetime).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric"
                        }),
                'time': formattedTime,
                'feelslike': Math.round(temp).toString() + '°',
                'humidity': !hour ? Math.round(data.days[day].humidity) : Math.round(data.days[day].hours[hour].humidity),
                'precipprob': !hour ? Math.round(data.days[day].precipprob).toString() + '%' : Math.round(data.days[day].hours[hour].precipprob).toString() + '%',
                'windspeed': !hour ? Math.round(data.days[day].windspeed).toString() + ' km/h' : Math.round(data.days[day].hours[hour].windspeed).toString() + ' km/h',
                'uvindex': !hour ? Math.round(data.days[day].uvindex) : Math.round(data.days[day].hours[hour].uvindex),
                icon
            }
        },
        updateByLocation: function (data) {
            // Update Stats
            Object.entries(numElements).forEach(([key, el]) => {
                fadeOut(el);
                setEl(el, data[key]);
            });
        },
        updateByDay: function (dayObj) {
            // Update Stats
            Object.entries(numElements)
                .filter(([key]) => !doNotUpdateByDay.includes(key))
                .forEach(([key, el]) => {
                    fadeOut(el);
                    setEl(el, dayObj[key]);
                });
        },
        updateByHour: function (dayObj) {
            // Update Stats
            Object.entries(numElements)
                .filter(([key]) => !doNotUpdateByHour.includes(key))
                .forEach(([key, el]) => {
                    fadeOut(el);
                    setEl(el, dayObj[key]);
                });
        },
        setup: function (data) {
            this.updateByLocation(this.convert(data));
        }
    };
}

export default selection();