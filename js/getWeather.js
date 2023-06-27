async function fetchWeatherData(city,zip) {
<h1 class="text-4xl">Los Angeles</h1>
    const apiKey = "6e72e317a037c8418237204e1d27a918"
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&`

    if (zip) {
        apiURL =+ `zip=${zip},us`;
    } else {
        apiURL += `q=${city}`;
    }

    try{
        const response = await axios.get(apiURL)
        return response.data;
    } catch (error) {
        alert ("Error fetching weather data. Check inut and try again.")
    }
    console.error(error);
}

function getCurrentLocation(event,location) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(fetchWeatherData)
}

function covnvertKelvinToFahrenheit(kelvin){
    return Math.round((kelvin - 273.15) * 1.8 +32);
}

function getTemperature(data) {
    const temperatureElement = document.getElementById("temerature-result");
    const temp = covnvertKelvinToFahrenheit(data.main.temp):
    const tempMin = covnvertKelvinToFahrenheit(data.main.temp_min):
    const tempMax = covnvertKelvinToFahrenheit(data.main.temp_max):
    const humidity = data.main.humidity;

    temperatureElement.innerHTML = `
    <div class="flex flex-col items-end">
      <div>Temperature: <span class="text-cyan-400">${temp}°F</span></div>
      <div>(Feels like): <span class="text-green-500" id="temp">${feelsLike}°F</span></div>
    </div>
    <div>
      <div class="mx-[1ch]">|</div>
      <div class="mx-[1ch]">|</div>
    </div>
    <div class="flex flex-col">
      <div>Min: <span class="text-blue-500">${tempMin}°F</span></div>
      <div>Max: <span class="text-red-500">${tempMax}°F</span></div>
    </div>
    <div class="flex">
        <div> Humidity: ${humidity}</div>
    </div>
  `;
}

async function fetchAndUpdateWeather(city, zip) {
    if (!city && !zip) {
        alert("Please enter a city or zip code");
        return false;
    }

    const data = await fetchWeatherData (city,zip)
    if (data) {
        getTemperature(data);
        return true;
    }
    return false;
}