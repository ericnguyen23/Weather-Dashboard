var apiKey = "df02f1a29bde5e2b414c74db145d3704";
var cityField = document.getElementById("city-field");
var searchButton = document.getElementById("search-button");
var currentDayBox = document.getElementById("current-day-box");
var city = "";
var imgUrl = "https://openweathermap.org/img/wn/";
var fiveDayBox = document.getElementById("five-day-box");

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
      // clear results first as to not duplicate
      fiveDayBox.innerHTML = "";

      var forecastArr = data.list;

      // get forecast for next 5 days
      // In order to get each day at noon, start at index 4 and get the next item 8 indexes away
      for (var i = 4; i < forecastArr.length; i += 8) {
        // console.log(forecastArr[i]);

        // set vars
        var forecast = forecastArr[i].main;
        var icon = forecastArr[i].weather[0].icon;

        // create els
        var card = document.createElement("div");
        var imageEl = document.createElement("img");
        var tempHeading = document.createElement("h4");
        var dateEl = document.createElement("p");

        // set att and set data to els
        card.setAttribute("class", "card col-12 col-sm-2");
        imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
        tempHeading.textContent = getDegree(forecast.temp);
        dateEl.textContent = dayjs(forecastArr[i].dt_txt).format("dddd");

        // append
        card.append(imageEl, tempHeading, dateEl);
        fiveDayBox.appendChild(card);
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
      // clear result
      currentDayBox.innerHTML = "";
      // get icon
      var icon = data.weather[0].icon;

      // create els
      var cityName = document.createElement("h3");
      var dateEl = document.createElement("p");
      var imageEl = document.createElement("img");
      var tempHeading = document.createElement("h2");
      var feelsPara = document.createElement("p");
      var humidPara = document.createElement("p");

      // attach data to els
      cityName.textContent = data.name;
      dateEl.textContent = dayjs().format("dddd MM/DD/YYYY");
      imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
      tempHeading.textContent = getDegree(data.main.temp);
      feelsPara.textContent = "Feels Like: " + getDegree(data.main.feels_like);
      humidPara.textContent = "Humidity: " + data.main.humidity;

      // append els
      currentDayBox.append(
        cityName,
        dateEl,
        imageEl,
        tempHeading,
        feelsPara,
        humidPara
      );
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
