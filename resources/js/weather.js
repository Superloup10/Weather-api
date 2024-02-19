/**
 * Retrieves weather data for a given latitude and longitude.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} long - The longitude of the location.
 *
 * @return {Promise<Object>} A promise that resolves to an object containing weather data.
 */
async function getWeatherData(lat, long) {
    const urlToCall = getUrlToCallForWeatherData(lat, long);
    const apiResult = await callApi(urlToCall);
    return {
        cityName: apiResult.name,
        img: apiResult.weather[0].icon,
        description: apiResult.weather[0].description,
        country: apiResult.sys.country,
        temp: apiResult.main.temp,
        clouds: apiResult.clouds.all,
        humidity: apiResult.main.humidity,
        pressure: apiResult.main.pressure,
        windDirection: apiResult.wind.deg,
        windSpeed: apiResult.wind.speed
    };
}

/**
 * Retrieves a list of suggested cities based on a given city name.
 *
 * @param {string} cityName - The name of the city to get suggestions for.
 * @return {Promise<Array<Object>>} - The list of suggested cities, each represented by an object with a cityName and postCode property.
 */
async function getSuggestedCities(cityName) {
    const urlToCall = getUrlToCallForSuggestedCities(cityName);
    const apiResult = await callApi(urlToCall);
    const result = [];
    for (const cityData of apiResult.features) {
        result.push({
            cityName: cityData.properties.label,
            postCode: cityData.properties.postcode
        });
    }
    return result;
}

/**
 * Retrieves the coordinates (latitude and longitude) for a given city name and optional postal code.
 *
 * @param {string} cityName - The name of the city.
 * @param {string} [postCode=""] - The optional postal code of the city.
 * @return {Object | null} - The coordinates of the city as an object with properties "lat" (latitude) and "long" (longitude). Returns null if no coordinates are found.
 */
async function getCoordinatesByCityNameAndPostCode(cityName, postCode = "") {
    const urlToCall = getUrlToCallForCityData(cityName, postCode);
    const apiResult = await callApi(urlToCall);
    if (apiResult.features.length > 0) {
        const cityData = apiResult.features[0].geometry;
        return {
            lat: cityData.coordinates[1],
            long: cityData.coordinates[0]
        };
    } else {
        return null;
    }
}
