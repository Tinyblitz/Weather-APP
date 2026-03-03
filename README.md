# Weather-APP
Part of the Odin Project coursework.  Practice using APIs
A functional weather APP in a grid style.  The top left includes the date, selected time, feelsgood.  The 4 icons shown represent from left to right: humidity, precipitation probability, windspeed, and uv index. The right column is a 7-day forcast for the next 7 days with min and max temperatures for the corresponding days. The bottom container is scrollable via mouse drag and shows the hourly temperature for the selected day.

Users may show weather stats based on a selected day and hour.

Can switch location by city name or zip code.  Time and date change based on corresponding time zone.

Weather data pulled from https://www.visualcrossing.com/

## objReference.js

A surface-level map to reveal how the data was organized after fetched from API. Mirrored the JSON structure but only included relevant data.

## .gitignore notes

assets/ is a folder for the background images that rotate based on condition. Images pulled from random public asset libraries

icons.js is basically part of assets, but holds the html for the svgs used to make the various icons that represent the weather conditon. Icons used as svgs to allow more control over suchs things as size and fill.

## Thoughts on improvements

-Look to create a slide-in animation for elements in the hourly summary (horizontal) and forecast (vertical)
-Add more mico-interactions 
-Create specially designed backgrounds to better represent the weather conditions
-Organize main.js better and move some event handlers to respective files.

## Potential future issues

A bug was found in the JSON from visual crossing.  The 6th day (index 5) has an array of hours that is missing data relating to datetime: "02:00:00" or 2AM.  Issue is consistent regardless of location. So the hours array only has 23 items instead of 24.  A bypass solution was implemented by copying the preceeding hour's data (replacing datetime with the correct time).  The fix addresses any future errors involving the any "hours" array having fewer than 24 items but doesn't address if any of the arrays have more than 24 items. Outcome is uncertain if that type of error were to occur.