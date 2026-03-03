import { isItDay, handleCondition } from "./GLOBAL_FUNCTIONS.js";

function background() {

    const body = document.querySelector('body');
    

    return {
        convert: function(data,day = 0,hour = null) {
            const tempCond = !hour ? data.days[day].conditions : data.days[day].hours[hour].conditions;
            let condition = handleCondition(tempCond);

            const time = !hour ? data.days[day].hours[0].time : hour;

            if (condition != 'storm') {
                if (condition === 'partially cloudy') condition = 'partially-cloudy'; 
                if (isItDay(time)) condition += '-day';
                else condition += '-night';
            }

            return {
                condition
            }
        },
        update: function(data, hour) {
            body.style.backgroundImage = `url('./assets/BGs/${data.condition}.png')`;
        },
        setup: function(data) {
            this.update(this.convert(data, 0));
        }
    };
}

export default background();