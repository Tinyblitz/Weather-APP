import { cloud, sun, rain } from '../icons.js';

const body = document.querySelector('body');
const tempMetricToggle = document.getElementById('temp-metric-toggle');

let isCelsius = false;

const conditionsArr = ['clear', 'storm', 'rain', 'cloudy'];     // Ordered by priority


// Selection stuff

const selectionTemp = document.getElementById('selection-temp');
const humidityStat = document.querySelector('#stat-humidity .selection-stat-text');
const precipprobStat = document.querySelector('#stat-precipprob .selection-stat-text');
const windspeedStat = document.querySelector('#stat-windspeed .selection-stat-text');
const uvindexStat = document.querySelector('#stat-uvindex .selection-stat-text');

// Location Input Stuff

const locationInput = document.getElementById('location-input');
const locationForm = document.getElementById('location-form');
const conditionDesc = document.getElementById('condition-description');

const DEFAULT_LOCATION = 'new york';
let currentLocation;
const numDays = 7;

const daysArray = [];       // Holds fetched location weather data, separated by day
const dailyItems = ["datetime", "temp", "tempmax", "tempmin", "feelslike", "precipprob", "humidity", "windspeed", "uvindex", "conditions", "description"];



function convertFahrenheightToCelsius (temp) { return ((temp - 32) * 5 / 9); }
function celsiusToFahrenheit(temp) { return (temp * 9/5) + 32; }

// Set fade animation for content change
function fadeOut(el) {
    el.classList.replace('show','fade');
    setTimeout(() => {
        el.classList.replace('fade','show');
    },500);
}

function updateStats(el, text) {
    fadeOut(el);
    el.innerText = text;
}

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
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${currentLocation}?key=BH4K26569UHSHTVJK7QYMD4LP&include=days`)
    .then((response)=>{
        return response.json();
    })
    .then((response)=>{

        //console.log(response);

        daysArray.length = 0;

        for (let i = 0; i < numDays; i++) {
            let curDay = response.days[i];
            
            const newObj = Object.fromEntries(
            dailyItems
                .filter(key => key in curDay)
                .map(key => [key, curDay[key]])
            );
            daysArray.push(newObj);
        }

        // for (const day of daysArray){
        //     console.log("Date:", day.datetime)
        //     console.log("Temperature:", Math.round(day.temp))
        //     console.log("Humidity:", Math.round(day.humidity))
        //     console.log("Wind Speed:", Math.round(day.windspeed))
        // }

        ///*  INPUT DATA INTO UI *///

        // Set Background Image based on weather condition
        const conditions = daysArray[0].conditions.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/); ;
        let condition = conditionsArr[0];       // Default condition is clear
        for (const c of conditionsArr) {
            if (conditions.includes(c)) {
                condition = c;
                break;
            }
        }

        body.style.backgroundImage = `url('./assets/BGs/${condition}-day.png')`;

        // Set selection info
        const locationText = response.resolvedAddress
            .split(/\s+/)
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(' ');
        console.log(locationText);
        updateStats(document.getElementById('selection-location-text'), locationText)
        updateStats(document.getElementById('selection-date'), `${daysArray[0].datetime}`);


        //"precipprob", "humidity", "windspeed", "uvindex"
        updateStats(conditionDesc, `'${daysArray[0].description}'`);
        updateStats(humidityStat, `${Math.round(daysArray[0].humidity)}`);
        updateStats(precipprobStat, `${Math.round(daysArray[0].precipprob)}%`);
        updateStats(windspeedStat, `${Math.round(daysArray[0].windspeed)} km/h`);
        updateStats(uvindexStat, `${Math.round(daysArray[0].uvindex)}`);
        
        

    })
    .catch(()=>{
        alert("Location is not valid");
    });
}

(function setup() {
    // Make accurately timed clock
    //let timeString;
    // (function setClock() {
    //     function updateClock() {
    //         const now = new Date();
    //         // Format: 12-hour - AM/PM
    //         timeString = now.toLocaleTimeString([], { 
    //             hour: 'numeric', 
    //             minute: '2-digit', 
    //             hour12: true 
    //         });

    //         // Display it on the screen
    //         document.querySelector('.clock').textContent = timeString;
    //     }
    //     updateClock();
    //     setInterval(updateClock,10000); // Refresh clock every 10 seconds
    // })();

    //console.log(timeString.slice(0,2));

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
    isCelsius = !isCelsius;
})