fetch("../header.html")
    .then((response) => response.text())
    .then((data) => {
        document.querySelector("header").innerHTML = data;
        let searchInput = {};

        document.querySelector("#search-input").addEventListener("input", async (e) => {
            const regex = /^(?<cityName>\w+) ?(?:\((?<postcode>\d{2,5})\))?$/gm;
            const match = regex.exec(e.target.value);
            searchInput = {};
            if (match) {
                searchInput = match.groups;
                console.log(searchInput);
                if (searchInput["cityName"].length >= 3) {
                    await genDataList(searchInput["cityName"]);
                }
            }
        });
        document.querySelector("#search-icon").addEventListener("click", async (_) => {
            console.log(searchInput);
            const data = await getCoordinatesByCityNameAndPostCode(searchInput["cityName"], searchInput["postcode"]);
            if (data !== null) {
                console.log(data);
                await addWeatherCard(true, data);
            } else {
                await addWeatherCard(false, data);
            }
        });
    });
fetch("../footer.html")
    .then((response) => response.text())
    .then((data) => {
        document.querySelector("footer").innerHTML = data;
    });

/**
 * Generates a list of suggested cities based on the given city name.
 *
 * @param {string} cityName - The name of the city.
 */
async function genDataList(cityName) {
    const citiesList = document.querySelector("#citiesList");
    citiesList.innerHTML = "";

    const cityData = await getSuggestedCities(cityName);
    if (cityData !== null && cityData.length > 0) {
        cityData.forEach(city => {
            const option = document.createElement("option");
            option.value = `${city.cityName}(${city.postCode})`;
            citiesList.appendChild(option);
        });
    }
}
