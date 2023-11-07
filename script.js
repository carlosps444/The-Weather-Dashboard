const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "e09412b62d0e86811699a2175d0c724f"; // API KEY

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 237).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed}mph</h4>
        <h4>Humidity: ${weatherItem.main.humidity}</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`;
    }else{

    return `<li class="card">
        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4>Temp: ${(weatherItem.main.temp - 237).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed}mph</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>`;
}

}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`; // Use backticks to insert variables

    fetch(WEATHER_API_URL)
        .then((res) => res.json())
        .then((data) => {
            const uniqueForecastDays = [];

            const fiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            cityInput.value = "";

            currentWeatherDiv.innerHTML = "";

            weatherCardsDiv.innerHTML = "";

            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0){

                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));



                }else{

                
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            
                }
            });

        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Use cityName, not cityInput, and fix the backticks in the URL
    if (!cityName) return; // Return if cityName is empty

    const GEOCODING_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`; // Use backticks to insert variables

    fetch(GEOCODING_API_URL)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod === "404") {
                return alert(`City not found: ${cityName}`);
            }

            const { name, coord } = data;
            getWeatherDetails(name, coord.lat, coord.lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL)
            .then((res) => res.json())
            .then((data) => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
           
        })
        .catch(() => {
            alert("An error occurred while fetching the city!");
        });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location to grant access again.");
            }
        }
    );
}
locationButton.addEventListener("click", getUserCoordinates)
searchButton.addEventListener("click", getCityCoordinates)
