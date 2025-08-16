// Location information (cities to be used in the program)

// Hourly focast information

// toggle buttons in top section. This code uses the DOM to handle the logic for 
// altering the color of the toggle button once the label is clicked. 
document.addEventListener('DOMContentLoaded', () => {

const switches = document.querySelectorAll('.switch');

switches.forEach(label => {
    const checkbox = label.querySelector('.switch_input');

    checkbox.addEventListener('change', () => {
        if(checkbox.checked){
            label.style.backgroundColor = 'aquamarine';
        }
        else{
            label.style.backgroundColor = 'rgb(70, 39, 15)'
            }
        });
    });
});


//Geocoding location data: Retreiving geolocation data from location input
let location_list = [];

async function gatherData(location){ 
    try{
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
        const data = await response.json();
        location_list.length = 0;
        for(let i = 0; i < data.results.length; i++){
            location_list.push(`${data.results[i].name}, ${data.results[i].admin1}, ${data.results[i].country}`);
        }
        return location_list;
    
    }
    catch(error){
        console.log('Error fetching location data:', error);
    }
}

//Preparing a curated selectable list of all locations returned

async function displaySearchOptions(){
    
   try{
    const search_box = document.getElementById('city_submit');
    const location_query = document.getElementById('citysearch');
    const location_options = document.getElementById('options');

   
        search_box.addEventListener('click', async () => {
            location_options.innerHTML = 0;
             if(location_query.value != undefined && location_query.value != ''){
                await gatherData(location_query.value);
                for(let i = 0; i < location_list.length; i++){
                const new_option = document.createElement('option');
                new_option.value = location_list[i];
                new_option.textContent = location_list[i];
                location_options.appendChild(new_option);
            }

             }
        });
   }
   catch(error){
    console.log("Error displaying the search options:", error);
   }
}
displaySearchOptions();

// Retreving longitude and latitude from selected location

function getCoordinates(location){


}

// Fetching weather data from weather API (OpenMeteo)


/*
fetch(weather_url)
    .then(response => 
        {response.json()})
    .catch(error => {
        console.error("Error fetching weather data", error);
    });
*/

// retrieves weather data from weather JSON file. 
/*function retrieveWeatherData(location){
    return new Promise((resolve, reject) => {

    });
    
};

*/

