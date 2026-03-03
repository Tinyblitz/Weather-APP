import { fadeOut } from './animations.js';

function controls() {

    const conditionDescription = document.getElementById('condition-description');

    let isCelsius = false;
    function toggleTempCelsius() { isCelsius = !isCelsius };

    function convert(data, day = null) {
        return {
            'description': day === null ? data.description : data.days[day].description
        }
    }

    function update(desc) {
        fadeOut(conditionDescription);
        conditionDescription.innerText = desc;
    }

    return {
        isTempCelsius: function() { return isCelsius },
        celsiusToFahrenheit: function(temp) { return (temp * 9/5) + 32; },
        fahrenheightToCelsius: function(temp) { return ((temp - 32) * 5 / 9); },
        toggleTemp: function() {
            const stats = document.querySelectorAll('.stat-temp');
            for (const stat of stats) {
                const oldTemp = Number(stat.textContent.slice(0, -1));  // Remove degree symbol with slice method
                const newTemp = this.isTempCelsius() ? this.celsiusToFahrenheit(oldTemp) : this.fahrenheightToCelsius(oldTemp);
                stat.textContent = `${Math.round(newTemp).toString()}°`;   
            }
            toggleTempCelsius();
        },
        updateByLocation: function(data) {
            const obj = convert(data);
            update(obj['description']);
        },
        updateByDay: function(data,day) {
            const dayObj = convert(data,day);
            update(dayObj['description']);
        },
        setup: function(data) {
            this.updateByLocation(data);
        }
    };
}

export default controls();