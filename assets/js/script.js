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
        console.log(forecast);

        var container = document.getElementById("five-day-box");
        var card = document.createElement("div");
        card.setAttribute("class", "card col-12 col-sm-2");
        var tempPara = document.createElement("p");
        tempPara.textContent = getDegree(forecast.temp);

        // append
        card.appendChild(tempPara);
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
      console.log(data);

      // get icon
      var imgUrl = "http://openweathermap.org/img/wn/";
      var icon = data.weather[0].icon;

      // create els
      var imageEl = document.createElement("img");
      var tempPara = document.createElement("p");
      var feelsPara = document.createElement("p");
      var humidPara = document.createElement("p");

      // attach data to els
      imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
      tempPara.textContent = "Temp: " + getDegree(data.main.temp);
      feelsPara.textContent = "Feels Like: " + getDegree(data.main.feels_like);
      humidPara.textContent = "Humidity: " + data.main.humidity;

      // append els
      currentDayBox.append(imageEl, tempPara, feelsPara, humidPara);
    });
}

// get current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// get weather and forecast for current location
function showPosition(position) {
  console.log(position);

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
