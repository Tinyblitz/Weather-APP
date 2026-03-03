import { fadeOut } from './animations.js';

function controls() {

    const conditionDescription = document.getElementById('condition-description');

    let isCelsius = false;
    function toggleTempCelsius() { isCelsius = !isCelsius };

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
        convert: function(data, day = null) {
            return {
                'description': !day ? data.description : data.days[day].description
            }
        },
        updateDesc: function(data) {
            fadeOut(conditionDescription);
            conditionDescription.innerText = data['description'];
        },
        setup: function(data) {
            this.updateDesc(this.convert(data));
        }
    };
}

export default controls();