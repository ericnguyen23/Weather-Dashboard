var apiKey = "df02f1a29bde5e2b414c74db145d3704";
var cityField = document.getElementById("city-field");
var searchButton = document.getElementById("search-button");
var currentDayBox = document.getElementById("current-day-box");
var city = "";

// Get cities long, lats based on city text input
function getCoordinates(city) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var long = data[0].lon;
      var lat = data[0].lat;
      console.log(long, lat);
      getFiveDayForecast(long, lat);
      getCurrentWeather(long, lat);
    });
}

// get five day forecast
function getFiveDayForecast(longtitude, latitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longtitude}&appid=${apiKey}&units=imperial`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

// get current weather
function getCurrentWeather(longtitude, latitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&appid=${apiKey}&units=imperial`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var imgUrl = "http://openweathermap.org/img/wn/";
      var icon = data.weather[0].icon;

      var imageEl = document.createElement("img");
      var tempPara = document.createElement("p");
      var feelsPara = document.createElement("p");
      var humidPara = document.createElement("p");

      imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
      tempPara.textContent = "Temp: " + data.main.temp;
      feelsPara.textContent = "Feels Like: " + data.main.feels_like;
      humidPara.textContent = "Humidity: " + data.main.humidity;

      currentDayBox.append(imageEl, tempPara, feelsPara, humidPara);
    });
}

// initiate search
searchButton.addEventListener("click", function () {
  city = cityField.value;
  getCoordinates(city);
});
