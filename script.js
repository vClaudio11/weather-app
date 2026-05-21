const API_KEY = 'b38cd688d5c0010b0d7944a904bff140';
const weatherContainer = document.querySelector('.weather-container');
const errorContainer = document.querySelector('.error-container');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const temperature = document.querySelector('#temperature');
const weatherDescription = document.querySelector('#description');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#windSpeed');
const cityName = document.querySelector('#cityName');
const errorMessage = document.querySelector('#errorMessage');

// render API data on page load

async function fetchWeather(city) {

    // show loading state
    searchButton.textContent = 'Searching...';
    searchButton.disabled=true;    

    try {
        // attempt to fetch weather data from API
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        let response = await fetch(url)
        const data = await response.json();
        if (data.cod === 401) {
            throw new Error('Invalid API key. Please check your API key and try again.');
        }
        if (data.cod === '404') {
            throw new Error('City not found. Please check the city name and try again.');
        }
        displayWeather(data);

    } catch (error) {
        // handle any errors that occur during the fetch process and reset the UI to show the error message
        console.log(error);
        errorMessage.textContent = `Error: ${error.message}`;
        errorContainer.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
        weatherContainer.classList.remove('visible');
    } finally {
        // reset search button state after fetch attempt
        searchButton.textContent = 'Search';
        searchButton.disabled=false;
    }
}

// display weather data onto the page
function displayWeather(data) {
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
    windSpeed.textContent = `Wind Speed: ${Math.round(data.wind.speed)} m/s`;
    cityName.textContent = data.name;

    weatherContainer.classList.remove('hidden');
    weatherContainer.classList.add('visible');
    errorContainer.classList.add('hidden');

    searchInput.value = '';
}

// search button event listener
searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city !== '') { 
        fetchWeather(city);
    }   else {
        errorMessage.textContent = `Please enter a city name.`;
        errorContainer.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
    }
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});