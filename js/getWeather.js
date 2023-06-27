async function fetchWeatherData(city, zip, coords = null) {
  const apiKey = "056e5a496ed237e46fe2e65ead648222";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&`;

  if (zip) {
    apiURL += `zip=${zip},us`;
  } else if (coords) {
    apiURL += `lat=${coords.latitude}&lon=${coords.longitude}`;
  } else {
    apiURL += `q=${city}`;
  }

  try {
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    alert("Error fetching weather data. Check input and try again.");
    console.error(error);
  }
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition((position) => {
    fetchAndUpdateWeather(null, null, position.coords);
  });
}

function convertKelvinToFahrenheit(kelvin) {
  return Math.round((kelvin - 273.15) * 1.8 + 32);
}

function getTemperature(data) {
  const cityName = document.getElementById("city-name");
  cityName.innerText = data.name;

  const weatherIcon = document.getElementById("weather-icon");
  const weatherIconCode = data.weather[0].icon;
  const weatherIconDesc = data.weather[0].description;
  const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconCode}@4x.png`;
  weatherIcon.innerHTML = `
    <img src="${weatherIconURL}" alt="${weatherIconDesc}">
    <div class="text-center -mt-10">${weatherIconDesc}</div>
  `;

  const temperatureElement = document.getElementById("temperature-result");
  const temp = convertKelvinToFahrenheit(data.main.temp);
  const tempMin = convertKelvinToFahrenheit(data.main.temp_min);
  const tempMax = convertKelvinToFahrenheit(data.main.temp_max);
  const humidity = data.main.humidity;

  temperatureElement.innerHTML = `
      <div class="flex flex-col items-end">
          <div>Temperature: <span class="text-cyan-400">${temp}°F</span></div>
      </div>
      <div class="flex flex-col">
          <div>Min: <span class="text-blue-400">${tempMin}°F</span></div>
          <div>Max: <span class="text-red-500">${tempMax}°F</span></div>
      </div>
      <div class="flex">
          <div>Humidity: ${humidity}</div>
      </div>
  `;
}

async function fetchAndUpdateWeather(city, zip, coords = null) {
  if (!city && !zip && !coords) {
    alert("Please enter a city or zip code");
    return false;
  }

  const data = await fetchWeatherData(city, zip, coords);
  if (data) {
    getTemperature(data);
    return true;
  }
  return false;
}

document
  .getElementById("current-location")
  .addEventListener("click", getCurrentLocation);

document.getElementById("city-field").addEventListener("change", (event) => {
  fetchAndUpdateWeather(event.target.value, null);
});

document.getElementById("zip-field").addEventListener("change", (event) => {
  fetchAndUpdateWeather(null, event.target.value);
});
