const cityInput = document.getElementById("cityInput")
const searchBtn = document.getElementById("searchBtn")
const weatherResult = document.getElementById("weatherResult")
const loading = document.getElementById("loading")
const forecastContainer = document.getElementById("forecast")

const apiKey = "YOUR_API_KEY"

async function getWeather(city) {

    try {

        loading.style.display = "block"

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error("City not found")
        }

        const data = await response.json()

        return data

    }
    catch (error) {

        weatherResult.innerHTML = `<p>${error.message}</p>`

    }
    finally {

        loading.style.display = "none"

    }

}

function displayWeather(data) {

    const icon = data.weather[0].icon
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`

    const html = `
    <div class="weather-card">
        <img class="weather-icon" src="${iconURL}">
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Condition: ${data.weather[0].description}</p>
    </div>
    `

    weatherResult.innerHTML = html

    changeBackground(data.weather[0].main)

}

function changeBackground(weather) {

    const body = document.body

    if (weather.includes("Cloud")) {
        body.style.background = "linear-gradient(135deg,#757f9a,#d7dde8)"
    }
    else if (weather.includes("Rain")) {
        body.style.background = "linear-gradient(135deg,#314755,#26a0da)"
    }
    else if (weather.includes("Clear")) {
        body.style.background = "linear-gradient(135deg,#f7971e,#ffd200)"
    }
    else {
        body.style.background = "linear-gradient(135deg,#5f9cff,#9bd5ff)"
    }

}

async function getForecast(city) {

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(url)

    const data = await response.json()

    displayForecast(data)

}

function displayForecast(data) {

    forecastContainer.innerHTML = ""

    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"))

    daily.forEach(day => {

        const icon = day.weather[0].icon
        const iconURL = `https://openweathermap.org/img/wn/${icon}.png`

        const card = `
<div class="forecast-card">
<p>${day.dt_txt.split(" ")[0]}</p>
<img src="${iconURL}">
<p>${day.main.temp}°C</p>
</div>
`

        forecastContainer.innerHTML += card

    })

}

searchBtn.addEventListener("click", async function () {

    const city = cityInput.value

    const weatherData = await getWeather(city)

    if (weatherData) {

        displayWeather(weatherData)

        getForecast(city)

    }

})

function getLocationWeather() {

    navigator.geolocation.getCurrentPosition(async position => {

        const lat = position.coords.latitude
        const lon = position.coords.longitude

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

        const response = await fetch(url)

        const data = await response.json()

        displayWeather(data)

    })

}

getLocationWeather()