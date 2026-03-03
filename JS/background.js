import { isItDay, handleCondition } from "./GLOBAL_FUNCTIONS.js";

function background() {

    const body = document.querySelector('body');
    
    function convert(data,day = 0,hour = null) {
        const tempCond = hour === null ? data.days[day].conditions : data.days[day].hours[hour].conditions;
        let condition = handleCondition(tempCond);

        const time = hour === null ? data.days[day].hours[0].time : data.days[day].hours[hour].time;

        if (condition != 'storm') {
            if (condition === 'partially cloudy') condition = 'partially-cloudy'; 
            if (isItDay(time)) condition += '-day';
            else condition += '-night';
        }

        return {
            condition
        }
    }

    function update(condition) { body.style.backgroundImage = `url('./assets/BGs/${condition}.png')`; }

    return {
        updateByLocation: function(data) {
            const obj = convert(data);
            update(obj.condition);
        },
        updateByDay: function(data,day) {
            const obj = convert(data,day);
            update(obj.condition);
        },
        updateByHour: function(data,day,hour) {
            const obj = convert(data,day,hour);
            update(obj.condition);
        },
        setup: function(data) {
            this.updateByLocation(data);
        }
    };
}

export default background();