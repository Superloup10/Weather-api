let map = L.map('map');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = new L.Marker();
let coordinates;

navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    coordinates = [lat, long];
    map.setView([lat, long], 13);
    marker.setLatLng([lat, long]).addTo(map);
});

/**
 * Generates a view model from weather data.
 *
 * @param {Object} weatherData - The weather data object.
 * @param {string} weatherData.country - The country information.
 * @param {number} weatherData.temp - The temperature in Celsius.
 * @param {number} weatherData.clouds - The cloud coverage percentage.
 * @param {number} weatherData.humidity - The humidity percentage.
 * @param {number} weatherData.pressure - The pressure in hPa.
 * @param {number} weatherData.windDirection - The wind direction in degrees.
 * @param {number} weatherData.windSpeed - The wind speed in m/s.
 * @returns {Object[]} - An array of objects representing the view model.
 * @property {string} Object.title - The title of the weather attribute.
 * @property {*} Object.data - The corresponding data value.
 * @property {?string} Object.suffixe - The suffix to append to the data value (optional).
 */
function getViewModelFromData(weatherData) {
    return [
        {
            title: "Country",
            data: weatherData.country
        },
        {
            title: "Temp",
            data: weatherData.temp,
            suffixe: "°C"
        },
        {
            title: "Clouds",
            data: weatherData.clouds,
            suffixe: "%"
        },
        {
            title: "Humidity",
            data: weatherData.humidity,
            suffixe: "%"
        },
        {
            title: "Pressure",
            data: weatherData.pressure,
            suffixe: "hPa"
        },
        {
            title: "Wind Direction",
            data: weatherData.windDirection,
            suffixe: "°"
        },
        {
            title: "Wind Speed",
            data: weatherData.windSpeed,
            suffixe: "m/s"
        }
    ];
}

/**
 * Formats weather data into a table view model.
 *
 * @param {Object} weatherData - The weather data object to be formatted.
 * @param {string} weatherData.country - The country information.
 * @param {number} weatherData.temp - The temperature in Celsius.
 * @param {number} weatherData.clouds - The cloud coverage percentage.
 * @param {number} weatherData.humidity - The humidity percentage.
 * @param {number} weatherData.pressure - The pressure in hPa.
 * @param {number} weatherData.windDirection - The wind direction in degrees.
 * @param {number} weatherData.windSpeed - The wind speed in m/s.
 * @return {HTMLTableElement} - The formatted weather data as a table element.
 */
function formatWeatherData(weatherData) {
    const weatherViewModel = getViewModelFromData(weatherData);
    const table = document.createElement('table');

    weatherViewModel.forEach(item => {
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        const dataCell = document.createElement('td');
        titleCell.textContent = item.title;
        dataCell.textContent = item.data + (item.suffixe ? item.suffixe : "");
        row.appendChild(titleCell);
        row.appendChild(dataCell);
        table.appendChild(row);
    });

    return table;
}

/**
 * Retrieves weather data for a given latitude and longitude, prints it to the console, and returns the formatted data.
 *
 * @param {number} lat - The latitude.
 * @param {number} long - The longitude.
 * @returns {HTMLTableElement} The formatted weather data.
 */
async function printWeatherData(lat, long) {
    const weatherData = await getWeatherData(lat, long);
    console.log(weatherData);
    return formatWeatherData(weatherData);
}

/**
 * Sets the marker on the map at the specified latitude and longitude coordinates.
 * Also updates the map view to center around the marker coordinates.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} long - The longitude coordinate.
 *
 * @returns {void}
 */
function addMarkerWithCoordinates(lat, long) {
    marker.setLatLng([lat, long]);
    map.setView([lat, long], 13);
}

/**
 * Returns the current date.
 *
 * @returns {Object} - The current date in the form of an object with day, month, and year properties.
 */
function getCurrentDate() {
    return {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    };
}

/**
 * Create a card HTML string based on the provided city search flag and weather data.
 *
 * @param {boolean} cityIsSearch - Flag indicating if the city is being searched.
 * @param {Object} data - Weather data object containing city coordinates.
 * @returns {Promise<string>} - The generated card HTML string.
 */
async function createCardHTMLString(cityIsSearch, data) {
    const dateNow = getCurrentDate();
    const weatherData = await getWeatherData(data.lat, data.long);
    return `<div id="card">
                <div id="card-header">
                    <p>${weatherData.cityName}</p> <p>${dateNow.day}/${dateNow.month < 10 ? "0" + dateNow.month : dateNow.month}/${dateNow.year}</p>
                </div>
                <div id="card-body">
                    <img src="../images/${weatherData.img}.svg" alt="Image de la météo"/>
                    <p>${weatherData.temp}°C</p>
                    <p>${weatherData.description}</p>
                </div>
                <div id="card-footer">
                    <p><img src="../images/wind.svg" alt="Image de vent"/> Vent : ${(weatherData.windSpeed * 3.6).toFixed(2)} km/h</p>
                    <p><img src="../images/rain.svg" alt="Image de pluie"/> Précipitations : ${weatherData.clouds}%</p>
                    <p><img src="../images/humidity.svg" alt="Image d'humidité"/> Humidité : ${weatherData.humidity}%</p>
                </div>
            </div>`;
}

/**
 * Returns the HTML content for disabling a card.
 *
 * @return {string} The HTML content for disabling a card.
 */
function disableCardHTML() {
    return "<p>Pour afficher la météo d'une ville, recherchez-la grâce au champ de recherche !</p>";
}

/**
 * Adds a weather card to the DOM based on the provided cityIsSearch and data.
 * If cityIsSearch is true, the card will be enabled and populated with data.
 * If cityIsSearch is false, the card will be disabled.
 *
 * @param {boolean} cityIsSearch - Indicates if the weather card is being added as a result of a city search
 * @param {object} data - The weather data object for the city
 * @return {Promise<void>} - A promise that resolves after the weather card has been added
 */
async function addWeatherCard(cityIsSearch, data) {
    const cardCity = document.querySelector("#card-city");
    if (cityIsSearch) {
        cardCity.disabled = false;
        cardCity.innerHTML = await createCardHTMLString(cityIsSearch, data);
        addMarkerWithCoordinates(data.lat, data.long);
    } else {
        cardCity.disabled = true;
        cardCity.innerHTML = disableCardHTML();
        addMarkerWithCoordinates(coordinates[0], coordinates[1]);
    }
}

async function onMapClick(event) {
    const htmlData = await printWeatherData(event.latlng.lat, event.latlng.lng);
    marker.setLatLng([event.latlng.lat, event.latlng.lng]);
    await addWeatherCard(true, {lat: event.latlng.lat, long: event.latlng.lng});
    marker.bindPopup(htmlData).openPopup();
}

map.on('click', onMapClick);
