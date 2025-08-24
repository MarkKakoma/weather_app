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
        const weather_data = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&daily=daylight_duration,sunshine_duration,sunset,sunrise,uv_index_max,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,rain_sum,temperature_2m_mean,apparent_temperature_mean,relative_humidity_2m_mean,precipitation_probability_mean,pressure_msl_mean,surface_pressure_mean,visibility_mean,winddirection_10m_dominant,wind_speed_10m_mean,weather_code&hourly=temperature_2m,rain,relative_humidity_2m,apparent_temperature,precipitation,surface_pressure,visibility,uv_index,sunshine_duration&current=relative_humidity_2m,is_day,temperature_2m,precipitation,rain,surface_pressure,wind_direction_10m,wind_speed_10m,apparent_temperature,weather_code`);
        const weather_json_data = await weather_data.json();

        //Weather metrics variables (Quantitative)
        const temperature =  weather_json_data.current.temperature_2m;
        const temperature_feels = weather_json_data.current.apparent_temperature;
        const humidity = weather_json_data.current.relative_humidity_2m;
        const wind_direction = weather_json_data.current.wind_direction_10m;
        const wind_speed = weather_json_data.current.wind_speed_10m;
        const precipitation = weather_json_data.current.precipitation;
        const pressure = weather_json_data.current.surface_pressure;

        // Next Days Arrays
        const next_days_temps = weather_json_data.daily.temperature_2m_mean;
        const next_days_temp_feels = weather_json_data.daily.apparent_temperature_mean;
        const next_days_precip = weather_json_data.daily.precipitation_sum;

        async function displayNextDaysWeather(){
    
                const dayElements = [
    
                    document.getElementById('day1'),
                    document.getElementById('day2'),
                    document.getElementById('day3'),
                    document.getElementById('day4'),
                    document.getElementById('day5'),
                    document.getElementById('day6'),

                    ];

                const temp = [
                    document.getElementById('temp1'),
                    document.getElementById('temp2'),
                    document.getElementById('temp3'),
                    document.getElementById('temp4'),
                    document.getElementById('temp5'),
                    document.getElementById('temp6'),

                    ];

                const temp_feels = [
                    document.getElementById('temp1_feels'),
                    document.getElementById('temp2_feels'),
                    document.getElementById('temp3_feels'),
                    document.getElementById('temp4_feels'),
                    document.getElementById('temp5_feels'),
                    document.getElementById('temp6_feels'),

                    ];

                const precip = [
                    document.getElementById('precip1'),
                    document.getElementById('precip2'),
                    document.getElementById('precip3'),
                    document.getElementById('precip4'),
                    document.getElementById('precip5'),
                    document.getElementById('precip6'),

                    ];


                    for(let i = 0; i < dayElements.length; i++){
                        dayElements[i].textContent = proceeding_days_array[i];

                    };
                    for(let i = 0; i < temp.length; i++){
                        temp[i].textContent =  next_days_temps[i] + " °";

                    };
                    for(let i = 0; i < temp_feels.length; i++){
                        temp_feels[i].textContent = 'Feels like: ' + next_days_temp_feels[i] + " °";

                    };
                    for(let i = 0; i < precip.length; i++){
                        precip[i].textContent = next_days_precip[i] + ' mm';

                    };

}

        //date and time metrics
        const date_and_time = weather_json_data.current.time.split('T');
        const date = date_and_time[0];
        const time = date_and_time[1];
        

        //UV_Index and Visibility Metrics
        const uv_index = weather_json_data.hourly.uv_index;
        const uv_index_sum = uv_index.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
        const average_uv_index = parseFloat((uv_index_sum / 168).toFixed(2));

        const visibility = weather_json_data.daily.visibility_mean[0];
        
        const average_visibilty = Math.floor((visibility / 1000), 2);
        
        //Weather code descriptions (Qualitative)
        const weather_code = weather_json_data.current.weather_code;
        const weather_description = weatherCodeInterpreter(weather_code);

        //Sunrise, Sunset and dayligh_hours data (current)
        const daylight_data = weather_json_data.daily.daylight_duration[0];
        const sunrise_data = weather_json_data.daily.sunrise[0];
        const sunset_data = weather_json_data.daily.sunset[0];
        const sunrise_day = sunrise_data.split('T');
        const sunset_day = sunset_data.split('T');

        const daylight = convertS_to_H(daylight_data);
        const sunrise = sunrise_day[1];
        const sunset = sunset_day[1];

        //location 
        //await locationStuff();
        
       
        //Displaying to the DOM
        await displayWeather(temperature,temperature_feels,humidity,date,time,wind_direction,wind_speed,precipitation,pressure,average_uv_index,weather_description, daylight,sunset,sunrise,average_visibilty);


        // 

        await displayNextDaysWeather();
        //Tests

        console.log(temperature);
        console.log(weather_json_data); 
        console.log(weather_description);
        return temperature,temperature_feels,humidity,wind_direction,wind_speed,precipitation,pressure,average_uv_index,average_visibilty,date,time,sunrise,sunset,daylight;
    }
    catch(error){
        console.log(`Error retrieving weather data:`, error);
    }


}

// Display weather data based on selected Coordinates


async function displayWeather(temp, temp_feels, humidity, date_info, time_info, wind_direct, wind_speed, precipitation, pressure, uv, weather_descrition, daylight_hours, sunset_time,sunrise_time, visibility){
    //date and time information
    const date = document.getElementById('date');
    const time = document.getElementById('time');
    date.textContent = 'Date: ' + date_info.toString();
    time.textContent = 'Time: ' + time_info.toString();

    //temperature information
    const temperature = document.getElementById('temperature');
    const temperature_feels = document.getElementById('temperature_feels');
    temperature.textContent = 'Temperature: ' + temp.toString() ;
    temperature_feels.textContent = 'Feels like: ' + temp_feels.toString();

    //wind inforamtion
    const wind_direction = document.getElementById('wind_speed');
    const wind_speeds = document.getElementById('wind_direction'); 
    wind_direction.textContent = 'Wind Direction: ' + wind_direct.toString() + ' °';
    wind_speeds.textContent = 'Wind Speed: ' + wind_speed.toString() + ' km/h';

    //humidity and precipitation
    const humidity_info = document.getElementById('humidity');
    const precip = document.getElementById('precipitation');
    humidity_info.textContent = 'Humidity: ' + humidity.toString() + ' %';
    precip.textContent = 'Precipitation: ' + precipitation.toString() + ' mm';

    //pressure and uv_index 
    const pressure_info = document.getElementById('pressure');
    const uv_index_info = document.getElementById('uv_index');
    pressure_info.textContent = 'Pressure: ' + pressure.toString() + ' hPa';
    uv_index_info.textContent = 'UV-Index: ' + uv.toString();

    //location,visibility and weather_description
    const location_info = document.getElementById('city_name');
    const visibility_info = document.getElementById('visibility');
    const qualitative_weather = document.getElementById('weather_description');
    location_info.textContent = location.toString();
    qualitative_weather.textContent = weather_descrition.toString();
    visibility_info.textContent = 'Visibility: ' + visibility.toString() + ' km;  Model clear-air visibility (may exceed practical ground conditions).';
    
    //Sunrise, Sunset and daylight_hours
    const sunshine = document.getElementById('daylight_hours');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    sunshine.textContent = 'Daylight Hours: ' + daylight_hours.toString();
    sunrise.textContent = 'Sunrise Time: ' + sunrise_time.toString() + ' am';
    sunset.textContent = 'Sunset Time: ' + sunset_time.toString() + ' pm';

    

}


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

//Converting seconds into hours for daylight hours

function convertS_to_H(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours + ' hrs ' + minutes.toString().padStart(2, '0') + ' min';
}



//location displayer
 async function locationStuff(){
            let location = '';

            let textbox_value = document.getElementById('citysearch');
            const selected_value = document.getElementById('options');
            const option = selected_value.value;

            if(selected_value === ''){
                location.textContent = textbox_value.value;
            }
            else{
                location.textContent = option;
            };

            return location;

        };


//Next days general info

const week = [
    'Sunday:',
    'Monday:',
    'Tuesday:',
    'Wednesday:',
    'Thursday:',
    'Friday:',
    'Saturday:'
];

const today = new Date();
const dayName = week[today.getDay()];
//console.log(dayName);

//let appended_list = [];

function weatherDaysValue(current_day_key){
    appended_list = [];

    for(let i = current_day_key; i < Object.keys(week); i++){
        appended_list.push(week[i]);
        

    }
    
    
}


// function to sort day looping. This function will store the following 6 days after the current day in an array called proceeding_days_array. 

let proceeding_days_array = [];

function sortDays(){
    proceeding_days_array = [];
    if(week.includes(dayName)){
        for(let i = 1; i<=6; i++){
            let proceeding_days = week[((today.getDay() + i) % 7)];

            proceeding_days_array.push(proceeding_days);

        };
    };
    return proceeding_days_array;
    
    

}

// function to display the accurate days in the DOM and receive the correct weather data for those days. 

async function displayNextDaysWeather(){
    
    const dayElements = [
    
    document.getElementById('day1'),
    document.getElementById('day2'),
    document.getElementById('day3'),
    document.getElementById('day4'),
    document.getElementById('day5'),
    document.getElementById('day6'),

];

const temp = [
    document.getElementById('temp1'),
    document.getElementById('temp2'),
    document.getElementById('temp3'),
    document.getElementById('temp4'),
    document.getElementById('temp5'),
    document.getElementById('temp6'),

];

const temp_feels = [
    document.getElementById('temp1_feels'),
    document.getElementById('temp2_feels'),
    document.getElementById('temp3_feels'),
    document.getElementById('temp4_feels'),
    document.getElementById('temp5_feels'),
    document.getElementById('temp6_feels'),

];

const precip = [
    document.getElementById('precip1'),
    document.getElementById('precip2'),
    document.getElementById('precip3'),
    document.getElementById('precip4'),
    document.getElementById('precip5'),
    document.getElementById('precip6'),

];


    for(let i = 0; i < dayElements.length; i++){
        dayElements[i].textContent = proceeding_days_array[i];

    };
    for(let i = 1; i < temp.length; i++){
        temp[i].textContent = next_days_temps[i];

    };
    for(let i = 1; i < temp_feels.length; i++){
        temp_feels[i].textContent = next_days_temp_feels[i];

    };
    for(let i = 1; i < precip.length; i++){
        precip[i].textContent = next_days_precip[i];

    };

}


document.addEventListener('DOMContentLoaded', () => {
    sortDays();
});
