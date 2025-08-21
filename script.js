// Update time, date, and welcome message
function updateTime() {
  const now = new Date();

  // Local time
  const localTimeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const localDateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // UTC time
  const utcTimeString = now.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const utcDateString = now.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Update display
  document.getElementById("localTime").textContent = localTimeString;
  document.getElementById("localDate").textContent = localDateString;
  document.getElementById("utcTime").textContent = utcTimeString;
  document.getElementById("utcDate").textContent = utcDateString;

  // Update welcome message based on local time
  const hour = now.getHours();
  let greeting;
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else if (hour < 21) greeting = "Good evening";
  else greeting = "Good night";

  document.getElementById("welcomeMessage").textContent = `${greeting}, Wei`;
}

// Weather API optimization - only call once per hour
let weatherData = null;
let lastWeatherUpdate = 0;
const WEATHER_UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

async function updateWeather() {
  const now = Date.now();

  // Check if we need to fetch new weather data
  if (weatherData && now - lastWeatherUpdate < WEATHER_UPDATE_INTERVAL) {
    // Use cached weather data
    displayWeather(weatherData);
    return;
  }

  try {
    // Try to get user's location first
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });

    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://wttr.in/${latitude},${longitude}?format=j1`,
    );

    if (!response.ok) throw new Error("Weather API failed");

    const data = await response.json();

    // Cache the weather data
    weatherData = data;
    lastWeatherUpdate = now;

    displayWeather(data);
  } catch (error) {
    console.error("Weather fetch failed:", error);
    await getTorontoWeather();
  }
}

function displayWeather(data) {
  const weatherConditionMap = {
    "Sunny": "☀️",
    "Clear": "☀️", 
    "Partly cloudy": "⛅",
    "Cloudy": "☁️",
    "Overcast": "☁️",
    "Mist": "🌫️",
    "Fog": "🌫️",
    "Light rain": "🌦️",
    "Heavy rain": "🌧️",
    "Rain": "🌧️",
    "Thunderstorm": "⛈️",
    "Snow": "❄️",
    "Light snow": "❄️",
    "Heavy snow": "❄️"
  };

  const currentCondition = data.current_condition[0];
  const weatherDesc = currentCondition.weatherDesc[0].value;
  const temperature = Math.round(currentCondition.temp_C);
  const location = data.nearest_area[0].areaName[0].value;

  const weatherIcon = weatherConditionMap[weatherDesc] || "🌤️";

  document.querySelector("#weather span").textContent = weatherIcon;
  document.getElementById("temp").textContent = `${temperature}°C`;

  const weatherDiv = document.getElementById("weather");
  if (!weatherDiv.querySelector(".location")) {
    const locationSpan = document.createElement("span");
    locationSpan.className = "location";
    locationSpan.textContent = `📍 ${location}`;
    weatherDiv.appendChild(locationSpan);
  } else {
    weatherDiv.querySelector(".location").textContent = `📍 ${location}`;
  }
}

// Fallback function for Toronto weather
async function getTorontoWeather() {
  try {
    const response = await fetch(
      `https://wttr.in/Toronto?format=j1`,
    );

    if (!response.ok) throw new Error("Weather API failed");

    const data = await response.json();

    // Cache the weather data
    weatherData = data;
    lastWeatherUpdate = Date.now();

    displayWeather(data);
  } catch (error) {
    console.error("Toronto weather failed:", error);
    // Ultimate fallback
    document.querySelector("#weather span").textContent = "🌤️";
    document.getElementById("temp").textContent = "Weather unavailable";

    // Add location to weather widget
    const weatherDiv = document.getElementById("weather");
    if (!weatherDiv.querySelector(".location")) {
      const locationSpan = document.createElement("span");
      locationSpan.className = "location";
      locationSpan.textContent = "📍 Toronto";
      weatherDiv.appendChild(locationSpan);
    }
  }
}

// Initialize time and weather
updateTime();
updateWeather();
setInterval(updateTime, 1000);

// Search functionality
const searchInput = document.getElementById("searchInput");
const engineButtons = document.querySelectorAll(".engine-btn");
let currentEngine = "google";

const searchEngines = {
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
};

engineButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    engineButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentEngine = btn.dataset.engine;
    searchInput.focus();
  });
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    const query = encodeURIComponent(searchInput.value.trim());
    window.open(searchEngines[currentEngine] + query, "_blank");
    searchInput.value = "";
  }
});

// Focus search with '/' key and handle escape
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && e.target !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  } else if (e.key === "Escape" && e.target === searchInput) {
    e.preventDefault();
    searchInput.blur();
    document.body.focus();
  }
});
