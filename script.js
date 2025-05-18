const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const WeatherInfo = document.getElementById("infoField");
const cityNameDisplay = document.getElementById("cityName");
const temperatureDisplay = document.getElementById("tempDisplay");
const descriptionDisplay = document.getElementById("weatherDescription");
const appTempDisplay = document.getElementById("appTempDisplay");
const errorMessage = document.getElementById("errorMessage");
const favCity = document.getElementById("favCityInput");
const getFavBtn = document.getElementById("getFavBtn");
const clrFavBtn = document.getElementById("clrFavBtn");

let favoriteCity = localStorage.getItem("FavCity") || "New York";

const weatherdata = async function fetchWeatherData(city) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "accept-encoding": "deflate, gzip, br",
    },
  };

  const response = await fetch(
    `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=oP2JGg2zdVQGZSKXqmYXyQXvx9bbJuDW`,
    options
  );
  const data = await response.json();
  return data;
};

getFavBtn.addEventListener("click", async () => {
  favoriteCity = favCity.value.trim();
  localStorage.setItem("FavCity", favoriteCity);
  if (favoriteCity) {
    getFavBtn.textContent = "Added";
    favCity.value = `${favoriteCity}`;
    favCity.classList.add("cursor-not-allowed");
    favCity.disabled = true;
    clrFavBtn.textContent = "Clear";
  }
  if (!favoriteCity) return;
  try {
    const weatherData = await weatherdata(favoriteCity);
    displayWeatherData(weatherData, favoriteCity);
  } catch (error) {
    showError();
  }
});

clrFavBtn.addEventListener("click", () => {
  localStorage.removeItem("FavCity");
  setTimeout(() => {
    clrFavBtn.textContent = "Cleared";
    getFavBtn.textContent = "Add";
    favCity.classList.remove("cursor-not-allowed");
    favCity.disabled = false;
    favCity.value = "";
  }, 300);
});

document.addEventListener("DOMContentLoaded", async () => {
  if (!favoriteCity) return;
  if (favoriteCity) {
    getFavBtn.textContent = "Added";
    favCity.value = `${favoriteCity}`;
    favCity.classList.add("cursor-not-allowed");
    favCity.disabled = true;
    clrFavBtn.textContent = "Clear";
  }
  try {
    const weatherData = await weatherdata(favoriteCity);
    displayWeatherData(weatherData, favoriteCity);
  } catch (error) {
    showError();
  }
});

getWeatherBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) return;
  try {
    const weatherData = await weatherdata(city);
    displayWeatherData(weatherData, city);
  } catch (error) {
    showError();
  }
});

const weatherCode = {
  0: "Unknown Weather Condition",
  1000: "Clear Skies with No Clouds",
  1001: "Overcast and Cloudy Throughout",
  1100: "Mostly Clear with Few Clouds",
  1101: "Partly Cloudy with Some Sun",
  1102: "Mostly Cloudy with Limited Sunlight",
  2000: "Dense Fog Reducing Visibility",
  2100: "Light Fog with Slight Haze",
  3000: "Gentle Breeze with Mild Wind",
  3001: "Moderate Wind Flow Present",
  3002: "Strong Wind with Noticeable Gusts",
  4000: "Light Drizzle with Fine Raindrops",
  4001: "Steady Rainfall Covering Area",
  4200: "Occasional Light Rain Showers",
  4201: "Heavy Rain with Intense Downpour",
  5000: "Snowfall Covering Surfaces",
  5001: "Scattered Flurries with Light Snow",
  5100: "Light Snowfall with Small Accumulation",
  5101: "Heavy Snowfall Creating Thick Layers",
  6000: "Freezing Drizzle with Ice Formation",
  6001: "Steady Freezing Rain Coating Surfaces",
  6200: "Occasional Light Freezing Rain",
  6201: "Heavy Freezing Rain Making Roads Slippery",
  7000: "Ice Pellets Falling with Light Impact",
  7101: "Intense Heavy Ice Pellet Showers",
  7102: "Scattered Light Ice Pellet Showers",
  8000: "Thunderstorm with Lightning and Rain",
};

async function displayWeatherData(weatherData, city) {
  let weathCode = weatherData.timelines.hourly[0].values.weatherCode;
  temperatureDisplay.textContent = `Current Temperature: ${weatherData.timelines.hourly[0].values.temperature} C`;
  appTempDisplay.textContent = `Feels like ${weatherData.timelines.hourly[0].values.temperatureApparent} C`;
  cityNameDisplay.textContent = weatherData.location.name;
  descriptionDisplay.textContent = weatherCode[weathCode];
  WeatherInfo.classList.add("flex");
  WeatherInfo.classList.remove("hidden");
}
function showError() {
  errorMessage.classList.remove("hidden");
  WeatherInfo.classList.add("hidden");
}
