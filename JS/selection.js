import icons from './icons.js';
import controls from './controls.js';
import { fadeOut } from './animations.js';
import { formatHour, handleIconCondition } from './GLOBAL_FUNCTIONS.js';

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

    function convert(data,day = 0,hour = null) {

        const timeZoneString = data.timezone;
        const time = hour === null ? data.days[day].hours[0].time : data.days[day].hours[hour].time;
        const isNextDay = hour !== null && data.days[day].hours[hour].time < data.days[day].hours[0].time;
        const date = isNextDay ? data.days[day+1].datetime : data.days[day].datetime;
        
        let condition = handleIconCondition(hour === null ? data.days[day].conditions : data.days[day].hours[hour].conditions, time);
        let temp = hour === null ? Math.round(data.days[day].feelslike).toString() : Math.round(data.days[day].hours[hour].feelslike).toString();
        if (controls.isTempCelsius()) temp = controls.fahrenheightToCelsius(temp);

        return {
            'location': data.location,
            'date': new Date(date + "T12:00:00").toLocaleDateString("en-US", {  // Buffer cause format assumes UTC time --> results in being a day behind pre-noon
                    month: "long",
                    day: "numeric",
                    timeZone: timeZoneString
                    }),
            'time': formatHour(time),
            'feelslike': Math.round(temp).toString() + '°',
            'humidity': hour === null ? Math.round(data.days[day].humidity) : Math.round(data.days[day].hours[hour].humidity),
            'precipprob': hour === null ? Math.round(data.days[day].precipprob).toString() + '%' : Math.round(data.days[day].hours[hour].precipprob).toString() + '%',
            'windspeed': hour === null ? Math.round(data.days[day].windspeed).toString() + ' km/h' : Math.round(data.days[day].hours[hour].windspeed).toString() + ' km/h',
            'uvindex': hour === null ? Math.round(data.days[day].uvindex) : Math.round(data.days[day].hours[hour].uvindex),
            'icon': icons[condition]
        }
    }
    
    return {
        updateByLocation: function (data) {
            const dataObj = convert(data);
            // Update Stats
            Object.entries(numElements).forEach(([key, el]) => {
                fadeOut(el);
                setEl(el, dataObj[key]);
            });
        },
        updateByDay: function (data,day) {
            const dayObj = convert(data,day);
            // Update Stats
            Object.entries(numElements)
                .filter(([key]) => !doNotUpdateByDay.includes(key))
                .forEach(([key, el]) => {
                    fadeOut(el);
                    setEl(el, dayObj[key]);
                });
        },
        updateByHour: function (data,day,hour) {
            const hourObj = convert(data,day,hour);
            // Update Stats
            Object.entries(numElements)
                .filter(([key]) => !doNotUpdateByHour.includes(key))
                .forEach(([key, el]) => {
                    fadeOut(el);
                    setEl(el, hourObj[key]);
                });
        },
        setup: function (data) {
            this.updateByLocation(data);
        }
    };
}

export default selection();