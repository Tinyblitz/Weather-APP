import background from "./background.js";
import selection from "./selection.js";
import controls from "./controls.js";
import summary from "./summary.js";
import forecast from "./forecast.js";


const tempMetricToggle = document.getElementById('temp-metric-toggle');

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
    return fetchLocationData()
};

function fetchLocationData() {
    return (fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${currentLocation}?key=BH4K26569UHSHTVJK7QYMD4LP`)
    .then((response)=> response.json())
    .then((response)=>{
        const data = response;
        const daysData = data.days;
        if (!daysData) throw new Error('Json does not have "days" data');
        if (!daysData[0].hours) throw new Error('Json does not have "hours" data');

        return data;
    })
    .then((response)=>{

        const responseObj = structuredClone(response);
        const timeZone = responseObj.timezone;
        const timeByHour = new Date().toLocaleString("en-US", {
                                        timeZone,
                                        hour: "2-digit",
                                        hour12: false
                                        });

        const dataObj = {
            'location': responseObj.resolvedAddress
                .split(/\s+/)
                .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
                .join(' '),
            'description': responseObj.description,
            'timezone': timeZone,
            'days': []
        };

        // Fix glitch in received Json where the 6th day is missing the 2AM data - max it to account for any missing hours
        for (const day of responseObj.days) {
            if (day.hours.length >= 24) continue;   // No issues if there are 24 items in hour array, assume no glitch +24 items
            let hourIterator = 0;
            let hoursArr = [...day.hours];
            while (hourIterator < 24) {
                let dateStringArr = hoursArr[hourIterator].datetime.split(":");     // Assumes "00:00:00" format
                const dTime = Number(dateStringArr[0]);
                if (dTime > hourIterator){
                    const targetItem = hourIterator !== 0 ? hoursArr[hourIterator - 1] : hoursArr[hourIterator + 1];   // Clone missing item from the item before (or after if first item)
                    const newItem = structuredClone(targetItem);
                    dateStringArr[0] = hourIterator.toString().padStart(2, "0");
                    const newDateString = dateStringArr.join(":");
                    newItem.datetime = newDateString;
                    hoursArr.splice(hourIterator, 0, newItem);  // Insert missing item
                }
                hourIterator++;
            }
            day.hours = [...hoursArr];
        }

        // Iterate to create a more convenient shallow copy of the json
        for (let i = 0; i <= numDays; i++) {
            const curDay = responseObj.days[i];

            const dayObj = Object.fromEntries(
            dailyItems
                .filter(key => key in curDay)
                .map(key => [key, curDay[key]])
            );
            dayObj['hours'] = [];

            // Set hours obj based on current time and extend for 24 hours, possibly into next day
            const nextDayNumHours = timeByHour;
            let allHours;
            const nextDay = responseObj.days[i+1];
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
        return dataObj;
    })
    .catch((e) => {
        alert('Location does not exist in database')
        console.error(e.message)
    }));
}

function updateData(dataObj) {
    ///*  INPUT DATA INTO UI *///
    background.setup(dataObj);   // Set Background Image based on weather condition
    selection.setup(dataObj);
    controls.setup(dataObj);
    summary.setup(dataObj);
    forecast.setup(dataObj);
}

(async function setup() {
    // Set user's location
    currentLocation = sessionStorage.getItem('city');       // Reference inital call to ipapi
    
    let dataObj;
    if (!currentLocation) dataObj = await fetchCurrentLocation();
    else dataObj = await fetchLocationData();

    updateData(dataObj);
})();

const handleLocationRequest = async () => {

    currentLocation = locationInput.value.trim();
    locationInput.value = "";

    const dataObj = await fetchLocationData();
    updateData(dataObj);
}

locationForm.addEventListener('submit', handleLocationRequest);

tempMetricToggle.addEventListener('click', () => {
    tempMetricToggle.classList.toggle('active');
    controls.toggleTemp();
})