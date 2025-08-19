//Part A: Soft Frontend logic for functional components such as buttons and design mods

// Toggle buttons in top section. This code uses the DOM to handle the logic for altering the color of the toggle button once the label is clicked.
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





//Part B: Hard backend logic for fetching weather and location data for UX. 

//Geocoding location data: Retreiving geolocation data from location input
let location_list = [];

async function gatherData(location){ 
    try{
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
        const data = await response.json();
        console.log(data);
        location_list.length = 0;
        for(let i = 0; i < data.results.length; i++){
            location_list.push({name: data.results[i].name, admin1: data.results[i].admin1, country: data.results[i].country, latitude: data.results[i].latitude, longitude: data.results[i].longitude});
        }
        console.log(location_list);
        return location_list;

    }
    catch(error){
        console.log('Error fetching location data:', error);
    };
}


//Preparing a curated selectable list of all locations returned
const location_options = document.getElementById('options');
const location_query = document.getElementById('citysearch');


async function displaySearchOptions(){
    
   try{
    const search_box = document.getElementById('city_submit');

        search_box.addEventListener('click', async () => {
            location_options.innerHTML = '';

             if(location_query.value != undefined && location_query.value != ''){
                await gatherData(location_query.value);

                for(let i = 0; i < location_list.length; i++){

                    const new_option = document.createElement('option');

                    const location_name = location_list[i].name;
                    const location_admin = location_list[i].admin1;
                    const location_country = location_list[i].country;
                    const location_latitude = location_list[i].latitude;
                    const location_longitude = location_list[i].longitude;

                    new_option.value = `${location_latitude},${location_longitude}`;
                    new_option.textContent = `${location_name}, ${location_admin}, ${location_country}`;
                    location_options.appendChild(new_option);
            }
       
                console.log(location_options.value);
                const coordinate_parts = location_options.value.split(',');
                const latitude_part = coordinate_parts[0];
                const longitude_part = coordinate_parts[1];
                console.log(Number(latitude_part));
                console.log(Number(longitude_part));

                await retrieveWeatherData(latitude_part,longitude_part);
                return location_options.value;
            }
            
        });


   }
   catch(error){
    console.log("Error displaying the search options:", error);
   }
}

displaySearchOptions();

//Altering the coordinates based on user selction + changing search box value to selected option

function changeCoordinates(){
            location_options.addEventListener('change', async () => {

                const current_selection = location_options.selectedIndex;

                if(current_selection !== -1){
                    const selected_value = location_options.value;
                    console.log(`Selected coordinates values, ${selected_value}`);
                    location_query.value = location_options.options[location_options.selectedIndex].text;
                    console.log(location_query.value);

                    const coordinate_parts_2 = selected_value.split(',');
                    const latitude_part_2 = coordinate_parts_2[0];
                    const longitude_part_2 = coordinate_parts_2[1];
                    console.log(Number(latitude_part_2));
                    console.log(Number(longitude_part_2));

                    await retrieveWeatherData(latitude_part_2,longitude_part_2);
                    return selected_value;
                }
            });
};

changeCoordinates();

// Fetching weather data from weather API (OpenMeteo) based on selected Coordinates


async function retrieveWeatherData(latitude, longitude){

    try{
        const weather_data = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=daylight_duration,sunshine_duration,sunset,sunrise,uv_index_max,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,rain_sum,temperature_2m_mean,apparent_temperature_mean,relative_humidity_2m_mean,precipitation_probability_mean,pressure_msl_mean,surface_pressure_mean,visibility_mean,winddirection_10m_dominant,wind_speed_10m_mean,weather_code&hourly=temperature_2m,rain,relative_humidity_2m,apparent_temperature,precipitation,surface_pressure,visibility,uv_index,sunshine_duration&current=relative_humidity_2m,is_day,temperature_2m,precipitation,rain,surface_pressure,wind_direction_10m,wind_speed_10m,apparent_temperature,weather_code`);
        const weather_json_data = await weather_data.json();

        //Weather metrics variables (Quantitative)
        const temperature =  weather_json_data.current.temperature_2m;
        const temperature_feels = weather_json_data.current.apparent_temperature;
        const humidity = weather_json_data.current.relative_humidity_2m;
        const date_and_time = weather_json_data.current.time;
        const wind_direction = weather_json_data.current.wind_direction_10m;
        const wind_speed_ = weather_json_data.current.wind_speed_10m;
        const precipitation = weather_json_data.current.precipitation;
        const pressure = weather_json_data.current.surface_pressure;
        
        //Weather code descriptions (Qualitative)
        const weather_code = weather_json_data.current.weather_code;
        const weather_description = weatherCodeInterpreter(weather_code);


        console.log(temperature);
        console.log(weather_json_data); 
        console.log(weather_description);
        return weather_json_data;
    }
    catch(error){
        console.log(`Error retrieving weather data:`, error);
    }


}

// Display weather data based on selected Coordinates

// Interpreting weather codes for descriptive qualitative information

function weatherCodeInterpreter(weather_code){

    let conditions;

    switch(weather_code){
        case 0:
            conditions = 'Clear sky';
            break;
        case 1:
        case 2:
        case 3:
            conditions = 'Mainly clear, partly cloudy, and overcast';
            break;
        case 45:
        case 48:
            conditions = 'Fog and depositing rime fog';
            break;
        case 51:
        case 53:
        case 55:
            conditions = 'Drizzle: Light, moderate, and dense intensity';
            break;
        case 56:
        case 57:
            conditions = 'Freezing Drizzle: Light and dense intensity';
            break;
        case 61:
        case 63:
        case 65:
            conditions = 'Rain: Slight, moderate and heavy intensity';
            break;
        case 66:
        case 67:
            conditions = 'Freezing Rain: Light and heavy intensity';
            break;
        case 71:
        case 73:
        case 75:
            conditions = 'Snow fall: Slight, moderate, and heavy intensity';
            break;
        case 77:
            conditions = 'Snow grains';
            break;
        case 80:
        case 81:
        case 82:
            conditions = 'Rain showers: Slight, moderate, and violent';
            break;
        case 85:
        case 86:
            conditions = 'Snow showers slight and heavy';
            break;
        case 95:
            conditions = 'Thunderstorm: Slight or moderate';
            break;
        case 96:
        case 99:
            conditions = 'Thunderstorm with slight and heavy hail';
            break;
        default:
            conditions = 'No weather description available at the moment.'
    }
    return conditions;
} 























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

