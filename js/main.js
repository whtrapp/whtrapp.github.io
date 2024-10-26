import { dayOfTheWeek, getMonth, getCitiesList } from './utils.js';
import {
  fetchWeatherData,
  fetchAstronomyData,
  fetchForecastData,
} from './weatherApi.js';
import {
  saveToLocalStorage,
  clearLastVisited,
  getLastVisitedCity,
} from './localStorage.js';
import { updateUI } from './uiController.js';
import { autocomplete } from './searchAutocomplete.js'

document.addEventListener('DOMContentLoaded', function () {
  const app = document.querySelector('.whtrlive');
  const temp = document.querySelector('.today-temperature');
  const dateOutput = document.querySelector('.date');
  const timeOutput = document.querySelector('.time');
  const nameOutput = document.querySelector('.place');
  const icon = document.querySelector('.weather-icon');
  const cloudOutput = document.querySelector('.cloudy');
  const humidityOutput = document.querySelector('.humidity');
  const windOutput = document.querySelector('.windspeed');
  const PrecipitationOutput =
    document.querySelector('.precipitation');
  const form = document.getElementById('locationInput');
  const search = document.querySelector('.search');
  const clrHistory = document.getElementById('clearHistory');
  const cities = document.querySelectorAll('.city');
  const dayOutput = document.querySelector('.day');
  const sunriseOutput = document.querySelector('.sunrise');
  const sunsetOutput = document.querySelector('.sunset');
  const tomorrowOutput = document.querySelector(
    '.tomorrow-temperature'
  );
  const lastVisitedList =
    document.getElementById('lastVisitedList');
  const exploreBtn = document.getElementById('exploreBtn');
  const displayPlace = document.getElementById('displayPlace');
  let place = "";

  let cityInput = getLastVisitedCity() || 'London';

  const exploreCities = [
    'New York',
    'California',
    'Paris',
    'Tokyo',
    'Bali',
    'Sydney',
    'Dubai',
  ];

  async function updateWeatherDisplay(city = cityInput) {
    try {
      const weatherData = await fetchWeatherData(city);
      const date = weatherData.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);
      const theDate = `${y}-${m}-${d}`;

            // Update UI elements
            temp.innerHTML = `${weatherData.current.temp_c}&#176;C / ${weatherData.current.temp_f}&#176;F`;
            dateOutput.innerHTML = `${getMonth(d, m, y)} ${d}, ${y}`;
            timeOutput.innerHTML = time;
            dayOutput.innerHTML = dayOfTheWeek(d, m, y);
            // nameOutput.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path></svg> ${weatherData.location.name}, ${weatherData.location.country}`;
            place = weatherData.location.name + ", " + weatherData.location.country;
            typingEffect();

            const iconID = weatherData.current.condition.icon.substr(
                '//cdn.weatherapi.com/weather/64x64/'.length
            );
            icon.src = './img/icons/' + iconID;

            const [astronomyData, forecastData] = await Promise.all([
                fetchAstronomyData(city, theDate),
                fetchForecastData(city),
            ]);

            sunriseOutput.innerHTML =
                astronomyData.astronomy.astro.sunrise;
            sunsetOutput.innerHTML =
                astronomyData.astronomy.astro.sunset;
            tomorrowOutput.innerHTML = `Tomorrow's Temperature: ${forecastData.current.temp_c}&#176;C / ${forecastData.current.temp_f}&#176;F`;

            cloudOutput.innerHTML = weatherData.current.cloud + '%';
            humidityOutput.innerHTML =
                weatherData.current.humidity + '%';
            windOutput.innerHTML =
                weatherData.current.wind_kph + 'km/h';
            PrecipitationOutput.innerHTML =
                weatherData.current.precip_mm + 'mm';

            const timeOfDay = weatherData.current.is_day
                ? 'day'
                : 'night';
            updateUI(app, weatherData, timeOfDay, exploreBtn);

            saveToLocalStorage(weatherData.location.name);
            displayLastVisited();
            app.style.opacity = '1';
        } catch (error) {
            console.error('Error updating weather display:', error);
            app.style.opacity = '1';
        }
    }

    function displayLastVisited() {
        const storedData = localStorage.getItem('lastVisited');
        lastVisitedList.innerHTML = '';

        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                const fragment = document.createDocumentFragment();
                data.forEach((item) => {
                    const li = document.createElement('li');
                    li.classList.add('city');
                    li.textContent = item.city;
                    li.addEventListener('click', handleCityClick);
                    fragment.appendChild(li);
                });
                lastVisitedList.appendChild(fragment);
            } catch (error) {
                console.error('Error parsing stored data:', error);
                lastVisitedList.innerHTML = 'Error loading data.';
            }
        } else {
            lastVisitedList.innerHTML = 'Empty..';
        }
    }

    function handleCityClick(e) {
        cityInput = e.target.innerHTML;
        updateWeatherDisplay(cityInput);
    }

    // Event Listeners
    exploreBtn.addEventListener('click', () => {
        cityInput =
            exploreCities[
                Math.floor(Math.random() * exploreCities.length)
            ];
        updateWeatherDisplay();
    });

    clrHistory.addEventListener('click', () => {
        clearLastVisited();
        displayLastVisited();
    });

    cities.forEach((city) => {
        city.addEventListener('click', (e) => {
            cityInput = e.target.innerHTML;
            updateWeatherDisplay();
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (search.value.length === 0) {
            alert('Please type a proper City name');
        } else {
            cityInput = search.value;
            updateWeatherDisplay();
            search.value = '';
        }
    } );
  
    function typingEffect() {
      let initialText = "";
      let placeText = place;
      let index = 0;

      // Clear the displayPlace content each time before starting the animation
      displayPlace.innerHTML = initialText;

      function typeCharacter() {
        if (index < placeText.length) {
          displayPlace.innerHTML = initialText + placeText.slice(0, index + 1);
          index++;
          setTimeout(typeCharacter, 100);
        }
      }

      typeCharacter();
    }

    // Initial load
    updateWeatherDisplay();
    displayLastVisited();
    autocomplete(document.getElementById("search"), getCitiesList());
});
