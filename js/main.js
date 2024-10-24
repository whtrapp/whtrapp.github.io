document.addEventListener("DOMContentLoaded", function () {
  const app = document.querySelector(".whtrlive");
  const temp = document.querySelector(".today-temperature");
  const dateOutput = document.querySelector(".date");
  const timeOutput = document.querySelector(".time");
  const nameOutput = document.querySelector(".place");
  const icon = document.querySelector(".weather-icon");
  const cloudOutput = document.querySelector(".cloudy");
  const humidityOutput = document.querySelector(".humidity");
  const windOutput = document.querySelector(".windspeed");
  const PrecipitationOutput = document.querySelector(".precipitation");
  const form = document.getElementById("locationInput");
  const search = document.querySelector(".search");
  const btn = document.querySelector(".searchbtn");
  const clrHistory = document.getElementById("clrHistory");
  const cities = document.querySelectorAll(".city");
  const dayOutput = document.querySelector(".day");
  const sunriseOutput = document.querySelector(".sunrise");
  const sunsetOutput = document.querySelector(".sunset");
  const tomorrowOutput = document.querySelector(".tomorrow-temperature");
  const lastVisitedList = document.getElementById("lastVisitedList");

  //Default City
  let cityInput = "London";

  //Default Cities
  const exploreCities = [
    "New York",
    "California",
    "Paris",
    "Tokyo",
    "Bali",
    "Sydney",
    "Dubai",
  ];

  const exploreBtn = document.getElementById("exploreBtn");

  exploreBtn.addEventListener("click", () => {
    const randomCity =
      exploreCities[Math.floor(Math.random() * exploreCities.length)];
    cityInput = randomCity;
    fetchWeatherData();
    saveToLocalStorage(cityInput);
    displayLastVisited();
    app.style.opacity = "1";
  });

  clrHistory.addEventListener("click", handleClearHistory);

  function handleClearHistory() {
    clearLastVisited();
    displayLastVisited();
  }

  function displayLastVisited() {
    const storedData = localStorage.getItem("lastVisited");
    lastVisitedList.innerHTML = "";

    if (storedData) {
      let data;
      try {
        data = JSON.parse(storedData);
      } catch (error) {
        console.error("Error parsing stored data:", error);
        lastVisitedList.innerHTML = "Error loading data.";
        return;
      }

      const fragment = document.createDocumentFragment();
      data.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("city");
        li.textContent = item.city;
        li.addEventListener("click", handleCityClick);
        fragment.appendChild(li);
      });
      lastVisitedList.appendChild(fragment);
    } else {
      lastVisitedList.innerHTML = "Empty..";
    }
  }

  function handleCityClick(e) {
    const cityInput = e.target.innerHTML;
    console.log(cityInput);
    fetchWeatherData(cityInput);
    saveToLocalStorage(cityInput);
    displayLastVisited();
    app.style.opacity = "1";
  }

  cities.forEach((city) => {
    city.addEventListener("click", (e) => {
      //Change to clicked city
      cityInput = e.target.innerHTML;
      console.log(city);

      //def later
      fetchWeatherData();
      saveToLocalStorage(cityInput);
      displayLastVisited();
      app.style.opacity = "1";
    });
  });

  //submission of the form
  form.addEventListener("submit", (e) => {
    if (search.value.length == 0) {
      alert("Please type a proper City name");
    } else {
      cityInput = search.value;
      fetchWeatherData();
      saveToLocalStorage(cityInput);
      displayLastVisited();
      search.value = "";
      app.style.opacity = "1";
    }
    e.preventDefault();
  });

  function dayOfTheWeek(day, month, year) {
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
  }

  function getMonth(day, month, year) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const d = new Date(new Date(`${year}-${month}-${day}`));
    return monthNames[d.getMonth()];
  }

  let apiKey = "7c742b695b3243f3864123423232302";

  const stored = localStorage.getItem("lastVisited");
  if (stored) {
    const Lcity = JSON.parse(stored)[0].city;
    cityInput = Lcity;
    fetchWeatherData();
  }

  function fetchWeatherData(city = cityInput) {
    fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
    )
      .then((response) => response.json())
      .then((data) => {
        temp.innerHTML = `${data.current.temp_c}&#176;C / ${data.current.temp_f}&#176;F`;

        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${getMonth(d, m, y)} ${d}, ${y}`;
        timeOutput.innerHTML = time;
        dayOutput.innerHTML = `${dayOfTheWeek(d, m, y)}`;
        theDate = `${y}-${m}-${d}`;

        nameOutput.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path></svg> ${data.location.name}, ${data.location.country}`;
        const iconID = data.current.condition.icon.substr(
          "//cdn.weatherapi.com/weather/64x64/".length
        );
        icon.src = "./img/icons/" + iconID;

        fetch(
          `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}&dt=${theDate}`
        )
          .then((response) => response.json())
          .then((astrodata) => {
            sunriseOutput.innerHTML = `${astrodata.astronomy.astro.sunrise}`;
            sunsetOutput.innerHTML = `${astrodata.astronomy.astro.sunset}`;
          });

        fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=yes&alerts=no`
        )
          .then((response) => response.json())
          .then((tomorrowdata) => {
            tomorrowOutput.innerHTML = `Tomorrow's Temperature: ${tomorrowdata.current.temp_c}&#176;C / ${tomorrowdata.current.temp_f}&#176;F`;
          });

        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";
        PrecipitationOutput.innerHTML = data.current.precip_mm + "mm";

        let timeOfDay = "day";
        const code = data.current.condition.code;

        if (!data.current.is_day) {
          timeOfDay = "night";
        }

        // Change button styles based on day or night
        if (timeOfDay === "day") {
          exploreBtn.style.backgroundColor = "#007bff"; // Blue for day
          exploreBtn.style.color = "white"; // Text color for day
          exploreBtn.querySelector("svg").style.fill = "white"; // Set SVG color for day

          // Add hover effect for day
          exploreBtn.addEventListener("mouseover", () => {
            exploreBtn.style.backgroundColor = "#0056b3"; // Darker blue on hover
            exploreBtn.querySelector("svg").style.fill = "#e2e2e2"; // Lighter on hover
          });
          exploreBtn.addEventListener("mouseout", () => {
            exploreBtn.style.backgroundColor = "#007bff"; // Revert to original
            exploreBtn.querySelector("svg").style.fill = "white"; // Revert to original
          });
        } else {
          // Dark mode styles
          exploreBtn.style.backgroundColor = "white"; // White background for dark mode
          exploreBtn.style.color = "black"; // Black text color for dark mode
          exploreBtn.querySelector("svg").style.fill = "black"; // Set SVG color to black for dark mode

          // Add hover effect for dark mode
          exploreBtn.addEventListener("mouseover", () => {
            exploreBtn.style.backgroundColor = "#f0f0f0"; // Light gray on hover
            exploreBtn.querySelector("svg").style.fill = "#7f7f7f"; // Darker gray on hover
          });
          exploreBtn.addEventListener("mouseout", () => {
            exploreBtn.style.backgroundColor = "white"; // Revert to original
            exploreBtn.querySelector("svg").style.fill = "black"; // Revert to original
          });
        }

        if (code == 1000) {
          app.style.backgroundImage = `url(./img/background/${timeOfDay}/clear.jpg)`;
        } else if (
          code == 1003 ||
          code == 1006 ||
          code == 1009 ||
          code == 1030 ||
          code == 1069 ||
          code == 1087 ||
          code == 1135 ||
          code == 1273 ||
          code == 1276 ||
          code == 1279 ||
          code == 1282
        ) {
          app.style.backgroundImage = `url(./img/background/${timeOfDay}/cloudy.jpg)`;
        } else if (
          code == 1063 ||
          code == 1069 ||
          code == 1072 ||
          code == 1150 ||
          code == 1153 ||
          code == 1180 ||
          code == 1186 ||
          code == 1189 ||
          code == 1192 ||
          code == 1195 ||
          code == 1204 ||
          code == 1207 ||
          code == 1240 ||
          code == 1243 ||
          code == 1246 ||
          code == 1249 ||
          code == 1252
        ) {
          app.style.backgroundImage = `url(../img/background/${timeOfDay}/rainy.jpg)`;
          btn.style.background = "#647d75";
        } else {
          app.style.backgroundImage = `url(../img/background/${timeOfDay}/snowy.jpg)`;
        }
        app.style.opacity = "1";
      })
      .catch(() => {
        alert("City not found");
        app.style.opacity = "1";
      });
  }

  function saveToLocalStorage(city) {
    const storedData = localStorage.getItem("lastVisited");
    if (storedData) {
      let data = JSON.parse(storedData);
      const existingCityIndex = data.findIndex((item) => item.city == city);
      if (existingCityIndex !== -1) {
        data[existingCityIndex].city = city;
        data.unshift(data.splice(existingCityIndex, 1)[0]);
      } else {
        data.unshift({ city });
      }
      data = data.slice(0, 3);
      localStorage.setItem("lastVisited", JSON.stringify(data));
    } else {
      localStorage.setItem("lastVisited", JSON.stringify([{ city }]));
    }
  }

  function clearLastVisited() {
    const storedData = localStorage.getItem("lastVisited");
    if (storedData) {
      localStorage.removeItem("lastVisited");
    }
  }

  fetchWeatherData();

  app.style.opacity = "1";
  // Initial display of last visited cities
  displayLastVisited();
});
