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
      var forecastArr = data.list;

      // get forecast for next 5 days
      for (var i = 0; i < 5; i++) {
        var forecast = forecastArr[i].main;
        var icon = forecastArr[i].weather[0].icon;
        var imgUrl = "https://openweathermap.org/img/wn/";

        var container = document.getElementById("five-day-box");
        var card = document.createElement("div");
        card.setAttribute("class", "card col-12 col-sm-2");
        var imageEl = document.createElement("img");
        imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
        var tempHeading = document.createElement("h4");
        tempHeading.textContent = getDegree(forecast.temp);

        // append
        card.append(imageEl, tempHeading);
        container.appendChild(card);
      }
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
      // get icon
      var imgUrl = "https://openweathermap.org/img/wn/";
      var icon = data.weather[0].icon;

      // create els
      var imageEl = document.createElement("img");
      var tempHeading = document.createElement("h2");
      var feelsPara = document.createElement("p");
      var humidPara = document.createElement("p");

      // attach data to els
      imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
      tempHeading.textContent = getDegree(data.main.temp);
      feelsPara.textContent = "Feels Like: " + getDegree(data.main.feels_like);
      humidPara.textContent = "Humidity: " + data.main.humidity;

      // append els
      currentDayBox.append(imageEl, tempHeading, feelsPara, humidPara);
    });
}

// get current location
// works on mobile, however doesn't prompt user to turn on location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// get weather and forecast for current location
function showPosition(position) {
  var long = position.coords.longitude;
  var lat = position.coords.latitude;

  getFiveDayForecast(long, lat);
  getCurrentWeather(long, lat);
}

getLocation();

// format degrees
function getDegree(num) {
  var degrees = "";
  var floorNum = Math.floor(num);
  degrees = floorNum + "°F";
  return degrees;
}

// initiate search
searchButton.addEventListener("click", function () {
  city = cityField.value;
  getCoordinates(city);
});
