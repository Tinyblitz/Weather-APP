import background from "./background.js";
import selection from "./selection.js";
import controls from "./controls.js";


const tempMetricToggle = document.getElementById('temp-metric-toggle');

const conditionsArr = ['clear', 'storm', 'rain', 'cloudy'];     // Ordered by priority

// Location Input Stuff

const locationInput = document.getElementById('location-input');
const locationForm = document.getElementById('location-form');

const DEFAULT_LOCATION = 'new york';
let currentLocation;
const numDays = 7;

const dailyItems = ["datetime", "temp", "tempmax", "tempmin", "feelslike", "precipprob", "humidity", "windspeed", "uvindex", "conditions", "description"];
const hourlyItems = ["temp", "feelslike", "precipprob", "humidity", "windspeed", "uvindex", "conditions"]

// Set weather stats to user's current location
async function fetchCurrentLocation () {
    const response = await fetch("https://ipapi.co/json/");  // API that fetches user data
    const data = await response.json();

    // default city when user exceeds number of alotted api calls
    if (!data) {
        currentLocation = DEFAULT_LOCATION;
        return;
    }   
    currentLocation = data.city;
    sessionStorage.setItem('city', currentLocation);       // Avoid repeated API calls on page refresh
    fetchLocationData()
};

const fetchLocationData = () => {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${currentLocation}?key=BH4K26569UHSHTVJK7QYMD4LP`)
    .then((response)=> response.json())
    .then((response)=>{
        const data = response;
        const daysData = data.days;
        if (!daysData) throw new Error('Json does not have "days" data');
        if (!daysData[0].hours) throw new Error('Json does not have "hours" data');

        return data;
    })
    .then((response)=>{
        const dataObj = {
            'location': response.resolvedAddress
                .split(/\s+/)
                .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
                .join(' '),
            'description': response.description,
            'days': []
        };

        console.log(dataObj)
        const timeZone = response.timezone;
        const timeByHour = new Date().toLocaleString("en-US", {
                                        timeZone,
                                        hour: "2-digit",
                                        hour12: false
                                        });

        // Iterate to create a more a convenient shallow copy of the json
        for (let i = 0; i < numDays; i++) {
            const curDay = response.days[i];

            const dayObj = Object.fromEntries(
            dailyItems
                .filter(key => key in curDay)
                .map(key => [key, curDay[key]])
            );
            dayObj['hours'] = [];

            // Set hours obj based on current time and extend for 24 hours, possibly into next day
            const nextDayNumHours = timeByHour;
            let allHours;
            const nextDay = response.days[i+1];
            if (timeByHour === 0 || !nextDay) allHours = [...curDay.hours];
            else allHours = [...curDay.hours.slice(timeByHour), ...nextDay.hours.slice(0,nextDayNumHours)];

            for (let j = 0; j < allHours.length; j++) {
                const curHour = allHours[j];

                const hourObj = Object.fromEntries(
                hourlyItems
                    .filter(key => key in curHour)
                    .map(key => [key, curHour[key]])
                );
                hourObj['time'] = Number(curHour.datetime.split(":")[0]);

                dayObj['hours'].push(hourObj);
            }

            dataObj['days'].push(dayObj);
        }

        ///*  INPUT DATA INTO UI *///

        
        background.setup(dataObj, 0);   // Set Background Image based on weather condition
        selection.setup(dataObj);       // Set selection info
        controls.setup(dataObj);        // Set description
                
    });
}

(function setup() {
    // Set user's location
    currentLocation = sessionStorage.getItem('city');       // Reference inital call to ipapi
    if (!currentLocation) fetchCurrentLocation();
    else fetchLocationData();

})();

const handleLocationRequest = () => {

    currentLocation = locationInput.value.trim();
    locationInput.value = "";

    fetchLocationData();
}

locationForm.addEventListener('submit', handleLocationRequest);

tempMetricToggle.addEventListener('click', () => {
    tempMetricToggle.classList.toggle('active');
    controls.toggleTemp();
})