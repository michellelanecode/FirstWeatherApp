
//current location selectors
let findLocation = document.querySelector("form");
let currentLocationWeather = document.querySelector("button");
let currentCityName = document.getElementById("currentCityName");
let searchBar = document.getElementById("searchBar");

//time selectors
let todayDate = document.getElementById("currentDate");
let currentTime = new Date();
let hour = currentTime.getHours();
let day = currentTime.getDate();
let min = currentTime.getMinutes();
let month = currentTime.getMonth();
let year = currentTime.getFullYear();
let months = [
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
// current weather selectors 
let description = document.querySelector("description");
let precipitation = document.querySelector("precipitation");
let humidity = document.querySelector("humidity");
let wind = document.querySelector("wind");
let currentTemp = document.getElementById("currentTemp");
let currentWeatherIcon = document.getElementById("currentWeatherIcon");

//search bar selectors
let searchForm = document.querySelector("searchBarButton");
let currentLocationButton = document.querySelector("button");

// link information and selectors
let fahrenheitLink = document.getElementById("fahrenheit-link");
let celciusLink = document.getElementById("celciusLink")
let kelvinConversion = 273.15 * 9 / 5 + 32;
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
let apiKey = "f2985cb429c8538026b7f0c5af55bd4f"
celciusLink.classList.remove("active");
fahrenheitLink.classList.add("active");

//future weather 

let futureWeatherIcons = document.querySelectorAll(".futureWeatherIcons");
let futureDate = document.querySelectorAll(".futuredate");
let futureHigh = document.querySelectorAll(".highFutureWeather");
let futureLow = document.querySelectorAll(".lowFutureWeather");


function timeControls() {
    for (let i = 0; i < months.length; i++) {
      if (month === i) {
        month = months[i];
      }
    }
  if (hour > 12) {
      hour = hour - 12;
      min = min + "pm";
  } else {
      min = min + "am";
  }
}

timeControls();

// current Time 
todayDate.innerHTML = `${month} ${day}, ${year} </br> ${hour}:${min}`;

// current Location weather functions: 

function showTemperatureName(response) {
    currentCityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`
    let lat = response.data.coord.lat;
    let lon = response.data.coord.lon;

    if (celciusLink.classList.contains("active")) {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            )
            .then(showTemperature);
    } else {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
            )
            .then(showTemperature);
    }
}

function showTemperature(response) {
    console.log(response);
    let icon = response.data.current.weather[0].icon;
  currentTemp.innerHTML = `${Math.round(response.data.current.temp)}°`;
  if (response.data.daily[0].rain) {
     precipitation.innerHTML = `${response.data.daily[0].rain}%`;
  } else {
    precipitation.innerHTML = `0%`
  }
  precipitation.innerHTML = ``;
  humidity.innerHTML = `${response.data.current.humidity}°`;
  wind.innerHTML = `<small>${response.data.current.wind_speed}mph/mps</small> Gust: <small>${response.data.current.wind_gust}mph/mps</small> Direction: <small>${response.data.current.wind_deg}°</small>`;
    currentWeatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png">`;
    for (let i = 0; i < 5; i++){
      let icon = response.data.daily[i].weather[0].icon;
      futureWeatherIcons[
        i
      ].innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" class=futureWeatherImg>`;
        futureDate[i].innerHTML = `${currentTime.getMonth() + 1}/${day + i}`;
        let high = Math.round(response.data.daily[i].temp.max);
        let low = Math.round(response.data.daily[i].temp.min);
      futureHigh[i].innerHTML = `${high}°`
      futureLow[i].innerHTML = `${low}°`
    }
};


function showPosition(response) {
    let lat = response.coords.latitude;
    let lon = response.coords.longitude;
    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    ).then(showTemperatureName);
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`).then(showTemperature);
};

navigator.geolocation.getCurrentPosition(showPosition)





//current Location button 

currentLocationButton.addEventListener("click", (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(showPosition);

})

function changeWeather(event) {
    event.preventDefault();
    let weather = searchBar.value;
            axios
                .get(
                    `${apiUrl}${weather}&appid=${apiKey}`
                )
                .then(showTemperatureName);
};

findLocation.addEventListener("submit", changeWeather);

//change celcius and fahrenheit 

fahrenheitLink.addEventListener("click",(event)=>{
    event.preventDefault();
    celciusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    axios.get(`${apiUrl}${currentCityName.innerHTML}&appid=${apiKey}`).then(showTemperatureName);
})

celciusLink.addEventListener("click",(event)=> {
    event.preventDefault();
    celciusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    axios
      .get(`${apiUrl}${currentCityName.innerHTML}&units=metric&appid=${apiKey}`)
      .then(showTemperatureName);
})