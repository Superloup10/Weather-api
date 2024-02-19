const OPEN_WEATHER_MAP_API_KEY = "0d47d640a383307597fca125db84f064";
const OPEN_WEATHER_MAP_API_URL = "https://api.openweathermap.org/data/2.5/weather?appId={{apiKey}}&lat={{lat}}&lon={{long}}&units=metric&lang=fr"
const ADRESSE_API_URL = "https://api-adresse.data.gouv.fr/search/?q={{cityName}}&type=municipality&postcode={{postCode}}"
const SUGGESTED_CITY_ADRESSE_API_URL = "https://api-adresse.data.gouv.fr/search/?q={{cityName}}&type=municipality"

/**
 * Generate the URL to call for city data.
 *
 * @param {string} cityName - The name of the city.
 * @param {string} [postCode=""] - The postal code of the city.
 * @returns {string} - The URL to call for city data.
 */
function getUrlToCallForCityData(cityName, postCode = "") {
    return ADRESSE_API_URL
        .replace("{{cityName}}", cityName)
        .replace("{{postCode}}", postCode)
}

/**
 * Returns the URL to call for getting suggested cities based on the given city name.
 *
 * @param {string} cityName - The name of the city to get suggestions for.
 * @return {string} - The URL to call for getting suggested cities.
 */
function getUrlToCallForSuggestedCities(cityName) {
    return SUGGESTED_CITY_ADRESSE_API_URL.replace("{{cityName}}", cityName);
}

/**
 * Returns the URL to call for getting weather data from Open Weather Map API.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} long - The longitude of the location.
 * @return {string} The URL to call for weather data.
 */
function getUrlToCallForWeatherData(lat, long) {
    return OPEN_WEATHER_MAP_API_URL
        .replace("{{apiKey}}", OPEN_WEATHER_MAP_API_KEY)
        .replace("{{lat}}", lat)
        .replace("{{long}}", long)
}

/**
 * Calls an API by making a network request to the specified URL.
 *
 * @param {string} urlToCall - The URL of the API to call.
 * @return {Promise<any>} - A Promise that resolves to the parsed JSON response from the API, or null if the response is not ok.
 * @throws {Error} - If an error occurs during the network request.
 */
async function callApi(urlToCall) {
    return await fetch(urlToCall)
        .then(res => res.ok ? res.json() : null)
        .catch(err => console.error(`[${err.type}]${err.errno}(${err.code}):${err.message}`));
}
