var apiKey = "df02f1a29bde5e2b414c74db145d3704";
var cityField = document.getElementById("city-field");
var searchButton = document.getElementById("search-button");
var currentDayBox = document.getElementById("current-day-box");
var city = "";
var imgUrl = "https://openweathermap.org/img/wn/";
var fiveDayBox = document.getElementById("five-day-box");
var historyBox = document.getElementById("search-history");

// Get cities long, lats based on city text input
// this is needed for the 5 day and current weather api
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
      // In order to get each day at noon, start at index 4 and get the next item 8 index' away
      for (var i = 4; i < forecastArr.length; i += 8) {
        var forecast = forecastArr[i].main;
        var icon = forecastArr[i].weather[0].icon;

        var card = document.createElement("div");
        var dateEl = document.createElement("p");
        var imageEl = document.createElement("img");
        var tempHeading = document.createElement("h4");
        var humidEl = document.createElement("p");
        var windEl = document.createElement("p");

        // set att and set data to els
        card.setAttribute("class", "card col-12 col-sm-2");
        dateEl.textContent = dayjs(forecastArr[i].dt_txt).format(
          "dddd MM/DD/YYYY"
        );
        imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
        tempHeading.textContent = getDegree(forecast.temp);
        humidEl.innerHTML = `Humidity: ${forecast.humidity}`;
        windEl.innerHTML = `Wind Speed: ${forecastArr[i].wind.speed}MPH`;

        // append
        card.append(dateEl, imageEl, tempHeading, humidEl, windEl);
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

      var cityName = document.createElement("h3");
      var dateEl = document.createElement("p");
      var imageEl = document.createElement("img");
      var tempHeading = document.createElement("h2");
      var feelsPara = document.createElement("p");
      var humidPara = document.createElement("p");
      var windPara = document.createElement("p");

      // attach data to els
      cityName.textContent = data.name;
      dateEl.textContent = dayjs().format("dddd MM/DD/YYYY");
      imageEl.setAttribute("src", imgUrl + icon + "@4x.png");
      tempHeading.innerHTML = `${getDegree(data.main.temp)}`;
      feelsPara.innerHTML = `Feels Like: ${getDegree(data.main.feels_like)}`;
      humidPara.innerHTML = `Humidity ${data.main.humidity}`;
      windPara.innerHTML = `Wind: ${data.wind.speed}MPH`;

      // append els
      currentDayBox.append(
        cityName,
        dateEl,
        imageEl,
        tempHeading,
        feelsPara,
        humidPara,
        windPara
      );
    });
}

// get current location
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
  degrees = floorNum + "??F";
  return degrees;
}

// populate search history
function populateHistory(city) {
  var cityEl = document.createElement("p");
  cityEl.innerHTML = `<p class="cities-item">${city}</p>`;
  historyBox.appendChild(cityEl);

  var cities = document.querySelectorAll(".cities-item");

  // add listener to each city item
  for (let i = 0; i < cities.length; i++) {
    cities[i].addEventListener("click", function () {
      getCoordinates(cities[i].textContent);
    });
  }
}

// initiate search
searchButton.addEventListener("click", function () {
  // set city to users input
  city = cityField.value;
  populateHistory(city);
  getCoordinates(city);
});
