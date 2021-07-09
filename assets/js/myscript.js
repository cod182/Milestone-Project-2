const hereApiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key

const searchBox = document.getElementById('search-box');
let search = ''; //Gets the value of the search
const greetSec = document.getElementById('greeting-box');
const loate = document.getElementById('locate'); //Geo Locate button
const mapContainer = document.getElementById('map-container')
let radius = '16093'; //Default number for the search radius
const mapContain = document.getElementById('map');
const resultsContain = document.getElementById('search-results');
let geoSearch = false;
let searchLatLng = []; //Lat & Lng of search stored in an array here
let firstTime = true;
let firstRadius = true;
let darkToggle = document.getElementById('dark-toggle');
let numOfResults = null;
const aboutText = document.getElementById('about-text');
let map = null; //map variable
let darkMode = localStorage.getItem('darkMode');

// Changes the about message every 5 seconds
var text = [];
    var counter = 0;

    text.push(`
    <p class="about-text white roboto">
        We are passionate about travelling and want to find you the perfect spot on your travels! Our site makes it easier for you to find the perfect location to rest your head. Whether you are in a tent, campervan or just after a room, we’ve got an easy to use method for finding you somewhere to stop. You could want a 5* stop with all the amenities or a patch of grass near to town, we’ve got you covered!
    </p>
    `);

    text.push(`
    <p class="about-text white roboto">
        All you need to do it tap your location into the search box above and bingo! You’ll have all the stops around your location, tap on one to get a bit more info!
        You can also tap the location button to get all the stops around you!
    </p>
    `);

setInterval(changeText, 5000);

function changeText() {
    aboutText.classList.add('about-hide');
    setTimeout(function () {
        aboutText.innerHTML = text[counter];
        aboutText.classList.remove('about-hide');
        counter++;
        if (counter >= text.length) {
            counter = 0;
        }
    }, 500);
};

//Dark mode toggle
darkToggle.addEventListener('click', () => { //listens for dark button clicked
    darkMode = localStorage.getItem('darkMode')
    if(darkMode !== 'enabled') { //if body has a class
        enableDarkMode(); // add classes
    } else {    // if body has no class
        disableDarkMode(); //remove classed
    }
});

// Classes to remove for Light mode
function disableDarkMode() {
    document.body.classList.remove('body--dark');
    document.body.classList.remove('body--white-text');
    searchBox.classList.remove('searchbox--dark');
    locate.classList.remove('locate--white');
    document.getElementById('dark-info-text').innerHTML = 'Dark Mode'
    document.getElementById('dark-info-arrow').classList.remove('dark-arrow--invert');
    localStorage.setItem('darkMode', null);
};

//Classes to add for Dark mode
function enableDarkMode() {
    document.body.classList.add('body--dark');
    document.body.classList.add('body--white-text');
    searchBox.classList.add('searchbox--dark');
    locate.classList.add('locate--white');
    document.getElementById('dark-info-text').innerHTML = 'Light Mode'
    document.getElementById('dark-info-arrow').classList.add('dark-arrow--invert');
    localStorage.setItem('darkMode','enabled');
};

//Checks if dark mode is enabled in local storage
if(darkMode === 'enabled') {
    enableDarkMode();
};

// Get location using geolocation and run a search based on resulting Lat/Lng
locate.addEventListener('click', function(event){ //Event listener on the locate button
    searchLatLng = []; //Set array to empty each time function run
    if (firstTime) { // If this this the first run, run the below code
        classChange(); //Run function to add classed
        firstTime = false;
    } else {
        document.getElementById('radius-value').innerHTML = '10';
        document.getElementById('radius').value = '16093';
    };

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    };
});

//If navigator.geolocation is sucsessful, this function is called
function success(position) {  
        searchLatLng.push(position.coords.latitude); //push the lat to searchLatLng
        searchLatLng.push(position.coords.longitude);//push the lng to searchLatLng
        coords = searchLatLng.toString(); //Set variable coords to  SearchLatLng as a String
        searchBox.value = ''; //Clears the searchBox
        radius = '16093'; 
        numOfResults = null;
        resultsContain.innerHTML = ""; //Set String empty each time function run
        mapContainer.innerHTML = ""; //Set String empty each time function run
        geoSearch = true;  
        classChange(); //Run function to add classed
        discoverSearch(coords, addMapEl); //run discover function taking coords and run the addReults &  addMapEl function
};

//If navigator.geolocation has an error, this function is called
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`); //Console log error
    classChangeRev();
    firstTime = true;
    numOfResults = null;
    searchLatLng = []; //Set array to empty each time function run
    resultsContain.innerHTML = ''; //Set String empty each time function run
    mapContainer.innerHTML = ''; //Set String empty each time function run
    searchBox.value = '';
    swal('Location Problem', 'Cannot find location, please try again or use search box', 'warning')
  };


//When enter is pressed, the search box shrinks, the map is added and getData runs
searchBox.addEventListener("keyup", function(event) { //Event listener to key up event
    if (event.key === "Enter") { // If key up is Enter then...
        radius = '16093';
        geoSearch = false;
        numOfResults = null;
        searchLatLng = []; //Set array to empty each time function run
        resultsContain.innerHTML = ""; //Set String empty each time function run
        mapContainer.innerHTML = ""; //Set String empty each time function run
        getSearchData(event) //Run function to get search results
    }
    
});

//Function to add and remove classed to prepare document for map and search results
function classChange(){
    searchBox.classList.remove('search-box-before'); //Remove class from searchBox
    searchBox.classList.add('search-box-after'); //Add class to searchBox
    greetSec.classList.remove('greeting-box-before'); //Remove class from greetSec
    greetSec.classList.add('greeting-box-after'); //Add class to greetSec
    resultsContain.classList.add('search-results-after'); // Adds the class to the search results section
    locate.classList.remove('locate-before'); //Remove class from locate
    locate.classList.add('locate-after'); //Add class to locate
};

function classChangeRev() {
    searchBox.classList.add('search-box-before'); //Remove class from searchBox
    searchBox.classList.remove('search-box-after'); //Add class to searchBox
    greetSec.classList.add('greeting-box-before'); //Remove class from greetSec
    greetSec.classList.remove('greeting-box-after'); //Add class to greetSec
    resultsContain.classList.remove('search-results-after'); // Adds the class to the search results section
    locate.classList.add('locate-before'); //Remove class from locate
    locate.classList.remove('locate-after'); //Add class to locate
}

function getSearchData(){
    search = searchBox.value;
    if (search){
        if (firstTime) { // If this this the first run, run the below code
            classChange(); //Run function to add classed
            firstTime = false; //sets firstTime to false so it doesn't run again
            getLatLng(search, getCoords); //runs the function to get the LatLng of the search term
        } else {
            classChange(); //Run function to add classed
            document.getElementById('radius-value').innerHTML = '10'; //sets the radius-value back to default
            document.getElementById('radius').value = '16093'; //sets the radius back to default
            getLatLng(search, getCoords); //runs the function to get the LatLng of the search term
        };
    } else {
        classChangeRev();
        swal('No Search Entered','Please try again','warning'); //Message displayed if no search term is entered
    };
};


// Get the Latitude and Londitude of the search
function getLatLng(search, cb){
    const urlGeo = 'https://geocode.search.hereapi.com/v1/geocode?q=';
    const urlComp = urlGeo + search + '&in=countryCode:GBR' + '&apiKey=' + hereApiKey; //combining the api url with the search term and limiting to GBR
    
    fetch(urlComp)
    .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        return response.json();
    })
    .then(data => {
        cb(data); //Call back to getCoords
        return data;
    })
    .catch(error => {
        firstTime = true; //sets firstTime to false so it doesn't run again
        classChangeRev(); //Run function to Reverse added classes
        searchBox.value = '';
        console.error('There has been a problem with your fetch operation:', error);
        swal('Search Term Invalid','Please try again','warning') //pop up wanring displayed if search term is bad
    });

};

// Puts the coordinates into a string and starts the discoverSearch function
function getCoords(data) {
    const lat = data.items[0].position.lat;
    const lng = data.items[0].position.lng;
    searchLatLng.push(lat);
    searchLatLng.push(lng);
    coords = searchLatLng.toString();
    discoverSearch(coords, addMapEl); //run discover function taking coords and run the addReults &  addMapEl function
};

// Runs a search to API using coords
// Callback 1 for addResults function
function discoverSearch(coords, cb) {
    const urlOrg = "https://discover.search.hereapi.com/v1/discover?q=";
    const url = urlOrg + 'campground' + '&in=circle:' + coords + ';r=' + radius + '&limit=100' + '&apiKey=' + hereApiKey;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(JSON.parse(xhr.responseText));
        const results = JSON.parse(xhr.responseText).items;
        cb(results); // Callback for addReults function
        }};
    xhr.send();
};

//Add map div and initilise the Here Map in section map
function addMapEl(results) {
    let mapDiv = document.createElement('div'); //Create a new div called resultDiv
    mapContainer.appendChild(mapDiv); //Appends resultDiv as a child of resultsContain
    mapDiv.id ='map'; //Add map ID to mapDiv
    mapDiv.classList.add('map'); //Add map class to mapDiv
    
    const platform = new H.service.Platform({ //New instance of Here Map
        apikey: hereApiKey //setting API key
      });

    const defaultLayers = platform.createDefaultLayers();
    map = new H.Map(document.getElementById('map'), //Here map placed into div with ID map (mapDiv)
    defaultLayers.vector.normal.map,{
    center: {lat:50, lng:5},
    zoom: 4,
    pixelRatio: window.devicePixelRatio || 1
    });

    window.addEventListener('resize', () => map.getViewPort().resize()); //Resize map when window resized
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);
    
    addResults(results); //runs function to start adding results to the page
    moveMapToLocation(map); //Run function to move map to searched
    addMapMarker(map, results, ui);
};

 //Move the center of the map to specified locatioin
function moveMapToLocation(map){
    const lat = searchLatLng[0].toString(); //sets latitude from searhLatLng array
    const lng = searchLatLng[1].toString(); //sets longitude from searhLatLng array

    map.setCenter({ //Sets the Lat & Lng of the map
        lat: lat, 
        lng: lng
    });

    map.setZoom(10); //Sets the Zoom level of the map
    const SearchLocation = new H.map.Marker({lat:lat, lng:lng});//Adds a marker where search was
    map.addObject(SearchLocation);
};

// Adds markers for each of the discovered search location
function addMapMarker(map, results, ui) {
    results.forEach(function(result){
        const lat = result.position.lat;
        const lng = result.position.lng;

        var outerElement = document.createElement('div'),
            innerElement = document.createElement('div');

        outerElement.appendChild(innerElement);
    
        // Add image to the DOM element
        innerElement.innerHTML = `<img src="assets/images/location-icon-32.png">`;
    
        function changeOpacity(evt) {
        evt.target.style.opacity = 0.6;
        };
    
        function changeOpacityToOne(evt) {
        evt.target.style.opacity = 1;
        };
  
        //create dom icon and add/remove opacity listeners
        var domIcon = new H.map.DomIcon(outerElement, {
        // the function is called every time marker enters the viewport
        onAttach: function(clonedElement, domIcon, domMarker) {
            clonedElement.addEventListener('mouseover', changeOpacity);
            clonedElement.addEventListener('mouseout', changeOpacityToOne);
        },
        // the function is called every time marker leaves the viewport
        onDetach: function(clonedElement, domIcon, domMarker) {
            clonedElement.removeEventListener('mouseover', changeOpacity);
            clonedElement.removeEventListener('mouseout', changeOpacityToOne);
        }
        });

        const locationMarker = new H.map.DomMarker({lat:lat, lng:lng}, {
            icon: domIcon
          });

        const phone = getPhone (result); //send the result to the getPhone function

        locationMarker.setData(`
        <div class="col-12">
            <div class="col-12">
                <div class="row">
                <div class="col-12 result-data-container">
                    <p class="result-address"><b>${result.title}</b></p>
                    <p class="result-address">${result.address.district}</p>
                    <p class="result-address">${result.address.county}</p>
                    <p class="">${result.address.postalCode}</p>
                    <p class="">${phone}</p>
                    </div>
                </div>
            </div> 
        </div>
        `);
        locationMarker.addEventListener('tap', event => {
            ui.getBubbles().forEach(bub => ui.removeBubble(bub));
            const bubble = new H.ui.InfoBubble(
                {lat: lat, lng: lng},
                {
                    content: event.target.getData()
                }
            );
            ui.addBubble(bubble);
        },false);

        map.addObject(locationMarker);
    });
};

//loops through the results to give results to pass on
function addResults(results) { 
    numOfResults = results.length; //sets the number of results for the radius results
    makeRadius(); //Runs the makeRadis function
    results.forEach(function(result){
        addResultToPage(result);
    });

};
//Gets the weather at the position of result
async function getWeather(result) {
//Open Weather API
    const openApi = '2e87b4183a4f602f8d20b6eca0cffef3';
    const weatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + result.position.lat + '&lon=' + result.position.lng + '&units=metric&appid=' + openApi;

    return await fetch(weatherURL)
    .then(response => {
                if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
};
let resultBuilding = [];
//Adds the result given to the DOM
async function addResultToPage (result) {
    resultBuilding = [];
    let weatherNow = await getWeather(result);
    let resultDiv = createResultDiv();
    createResultTitleInfo(result, weatherNow);// Append to result div
    createResultBodyInfo(result,weatherNow);
    let resultReady = resultBuilding.join('').toString();
    console.log(resultReady);
    resultDiv.innerHTML = resultReady; //Appends resultDiv as a child of resultsContain

    resultsContain.appendChild(resultDiv);
};

//Creates a New div with 2 classes
function createResultDiv(){
    let resultDiv = document.createElement('div'); //Create a new div called resultDiv
    resultDiv.classList.add('col-12'); //Adds the class to the div
    resultDiv.classList.add('result-box'); //Adds the class to the div
    return resultDiv
};

//Create title section storedd in title
function createResultTitleInfo(result, weatherNow) {
    resultBuilding = []
    const currWeather = weatherNow.current.weather[0].description; // current weather at location
    const iconWeather = 'https://openweathermap.org/img/w/' + weatherNow.current.weather[0].icon + '.png'; //current weather icon at location
    const currTemp = getAbslouteValue(weatherNow.current.temp); //sets the temp to no decimal places
    
    let title = `
            <div class="result-title-container col-12">
                <h2 class="blue bold result-row">
                    <a href="#map" onclick="moveMapToResult(this, map)" data-lat="${result.position.lat}" data-lng="${result.position.lng}">${result.title}</a>
                    <span class="weather-sm d-inline d-md-none"><img class="weather-icon-sm" src="${iconWeather}" alt="Weather Icon">${currWeather} - ${currTemp}ºc</span>
                </h2>
            </div>
            `;
            resultBuilding.push(title);
};

//Creates Body of Results
function createResultBodyInfo(result, weatherNow) {
    let body = [];
    let weatherArr = [];
    createBodyInfo(body,result);
    createBodyInfoWeather(weatherNow, weatherArr);
    createBodyMoreInfoButton(weatherArr); //Create the More info button in the body for displaying more info

    body.push(weatherArr.join('').toString()); //Joins all the weather arrays together and pusheds them into the body array
    let bodyReady = body.join('').toString(); // Joins all the arrays togather and pushes stores them in bodyReady variable
    resultBuilding.push(bodyReady); //Pushes the Body Ready variable into the resultBuilding Array
};

function createBodyInfo(body,result) {
    createBodyInfoOuter(body); //Run the function to create the outer container for the body, then pushed into body
    createBodyInfoDistance(result, body); //Run the function to create the distance div for the body, then pushed into body
    createBodyInfoAddress(result, body); //Run the function to create the address div for the body, then pushed into body
    createBodyInfoPhone(result, body); //Run the function to create the phone div for the body, then pushed into body
    createBodyInfoEmail(result, body); //Run the function to create the email div for the body, then pushed into body
    createBodyInfoHours(result, body); //Run the function to create the opening hours div for the body, then pushed into body
    createBodyInfoWebsite(result, body); //Run the function to create the website div for the body, then pushed into body
};

function createBodyInfoWeather(weatherNow, weatherArr) {
    createBodyInfoCurrentWeather(weatherNow, weatherArr); //Run the function to create the current weather div for the body, then pushed into weatherArr
    createBodyInfoWeatherToggle(weatherArr); //Run the function to create the weather toggle div for the body, then pushed into weatherArr
    createBodyInfoWeatherHourForcast1(weatherNow, weatherArr); //Run the function to create the hour weather forcast day 1+2 div for the body, then pushed into weatherArr
    createBodyInfoWeatherHourForcast2(weatherNow, weatherArr); //Run the function to create the hour weather forcast day 2+3 div for the body, then pushed into weatherArr
    createBodyInfoWeatherDailyForcast1(weatherNow, weatherArr); //Run the function to create the daily weather forcast day 1+2 div for the body,then pushed into weatherArr
    createBodyInfoWeatherDailyForcast2(weatherNow, weatherArr); //Run the function to create the daily weather forcast day 2+3 div for the body,then pushed into weatherArr
    createBodyInfoWeatherDailyForcastSmall1(weatherNow, weatherArr); //Create the small daily weather forcast day +2 div for the body,then pushed into weatherArr
    createBodyInfoWeatherDailyForcastSmall2(weatherNow, weatherArr); //Create the small daily weather forcast day +2 div for the body,then pushed into weatherArrweatherArr
};

//Staarts off the body section of More Info
function createBodyInfoOuter(body) {
    let bodyInfoOuter = `
            <div class="row">
                <div class="col-sm-12 col-md-7"> 
    `;
    body.push(bodyInfoOuter);
};

//Gets the Distance section of More Info
function createBodyInfoDistance(result, body) {
    const distance = getDistance(result.distance); //Gets the distance to location in KM
    let bodyInfoDistance = `
                    <div class="row">
                        <div class="col-3 result-row">
                            <p class="result-label">Distance:</p>
                        </div>
                        <div class="col-9 result-data-container">
                            <p class="result-data">${distance} Miles</p>
                        </div>
                    </div>
    `;
    body.push(bodyInfoDistance);
};

//Gets the address section of More Info
function createBodyInfoAddress(result, body) {
    let bodyInfoAddress = `
                <div class="row">
                    <div class="col-3 result-row">
                        <p class="result-label">Address:</p>
                    </div>
                    <div class="col-9 result-data-container">
                        <p class="result-data result-address">${result.title}</p>
                        <p class="result-data result-address">${result.address.district}</p>
                        <p class="result-data result-address more-info d-none">${result.address.county}</p>
                        <p class="result-data result-address more-info d-none">${result.address.city}</p>
                        <p class="result-data">${result.address.postalCode}</p>
                    </div>
                </div>
    `;
    body.push(bodyInfoAddress);
};

//Gets the Phone  section of More Info
function createBodyInfoPhone(result, body) {
    const phone = getPhone (result); //Gets the contact number of the location
    let bodyInfoPhone = `
            <div class="row">
                <div class="col-3 result-row">
                  <p class="result-label">Phone:</p>
                </div>
                <div class="col-9 result-data-container">
                 <p class="result-data">${phone}</p>
                </div>
            </div>
    `;
    body.push(bodyInfoPhone);
};

//Gets the Email address section of More Info
function createBodyInfoEmail(result, body) {
    const email = getEmail(result); //Gets the email of the result
    let bodyInfoEmail = `
            <div class="row more-info d-none">
                <div class="col-3 result-row">
                    <p class="result-label">Email:</p>
                </div>
                <div class="col-9 result-data-container">
                    <p class="result-data">${email}</p>
                </div>
            </div>
    `;
    body.push(bodyInfoEmail);
};

//Gets the Hours section of More Info
function createBodyInfoHours(result, body) {
    const hours = getHours(result); //Gets the hours the location is open
    let bodyInfoHours = `
            <div class="row">
                <div class="col-3 result-row">
                    <p class="result-label">Opening Hours:</p>
                </div>
                <div class="col-9 result-data-container">
                    <p class="result-data">${hours}</p>
                </div>
            </div>
    `;
    body.push(bodyInfoHours);
};

//Gets the website section of More Info
function createBodyInfoWebsite(result, body) {
    const website = getWebsite(result); //Gets the website of the result
        let bodyInfoWebsite = `
            <div class="row more-info d-none">
                <div class="col-3 result-row">
                    <p class="result-label">Website:</p>
                </div>
                <div class="col-9 result-data-container">
                    <p class="result-data">${website}</p>
                </div>
            </div>
        </div>
        `;
    body.push(bodyInfoWebsite);
};

//Gets the current weather section of More Info
function createBodyInfoCurrentWeather(weatherNow, weatherArr) {
    const currWeather = weatherNow.current.weather[0].description; // current weather at location
    const iconWeather = 'https://openweathermap.org/img/w/' + weatherNow.current.weather[0].icon + '.png'; //current weather icon at location
    const currTemp = getAbslouteValue(weatherNow.current.temp); //sets the temp to no decimal places
    let bodyInfoCurrentWeather = `
            <div class="col-md-5 col-sm-12 d-md-inline weather-container container-fluid">
                <div class="weather">
                    <div>
                        <h4 class="weather-title">Current Weather</h4>
                        <img src="${iconWeather}" alt="weather Icon">
                        <p class="weather-current">${currWeather}</p>
                        <p class="weather-temp">Current Temp: <span>${currTemp}ºc</span></p>
                    </div>
                </div>
        `;
        weatherArr.push(bodyInfoCurrentWeather);
};

// Creates the weather Toggle for the more info secion
function createBodyInfoWeatherToggle(weatherArr){
    let bodyInfoWeatherToggle = `
            <div class="more-info d-none hour-forcast">
                <label class="switch-weather">
                    <span class='d-none'>0</span>
                    <input type="checkbox" onclick="showHidedailyHour(this)">
                    <div class="slider-weather round-weather">
                        <span class="on-weather bold">Daily</span>
                        <span class="off-weather bold">Hourly</span>
                    </div>
                </label>
        `;
        weatherArr.push(bodyInfoWeatherToggle);
};

//Gets the hourly weather section 1+2 of More Info
function createBodyInfoWeatherHourForcast1(weatherNow, weatherArr) {
     let bodyInfoWeatherHourForcast1 = `
     <!-- Hourly Weather md+ display -->
            <div class="row">
                <div class="col-3 hourly-box">
                    <p class="weather-description">${weatherNow.hourly[0].weather[0].description}</p>
                    <img src="${'https://openweathermap.org/img/w/' + weatherNow.hourly[0].weather[0].icon + '.png'}" alt="weather Icon">
                    <p>${convertUnixToTime(weatherNow.hourly[0].dt)}</p>
                </div>

                <div class="col-3 hourly-box">
                    <p class="weather-description">${weatherNow.hourly[1].weather[0].description}</p>
                    <img src="${'https://openweathermap.org/img/w/' + weatherNow.hourly[0].weather[0].icon + '.png'}" alt="weather Icon">
                    <p>${convertUnixToTime(weatherNow.hourly[1].dt)}</p>
                </div>
        `;
        weatherArr.push(bodyInfoWeatherHourForcast1);
};

//Gets the hourly weather section 3+4 of More Info
function createBodyInfoWeatherHourForcast2(weatherNow, weatherArr) {
    let bodyInfoWeatherHourForcast2 = `
            <div class="col-3 hourly-box">
                <p class="weather-description">${weatherNow.hourly[2].weather[0].description}</p>
                <img src="${'https://openweathermap.org/img/w/' + weatherNow.hourly[0].weather[0].icon + '.png'}" alt="weather Icon">
                <p>${convertUnixToTime(weatherNow.hourly[2].dt)}</p>
            </div>

            <div class="col-3 hourly-box">
                <p class="weather-description">${weatherNow.hourly[3].weather[0].description}</p>
                <img src="${'https://openweathermap.org/img/w/' + weatherNow.hourly[0].weather[0].icon + '.png'}" alt="weather Icon">
                <p>${convertUnixToTime(weatherNow.hourly[3].dt)}</p>
            </div>
        </div>
       `;
       weatherArr.push(bodyInfoWeatherHourForcast2);
};

//Gets the daily weather section 1+2 of More Info
function createBodyInfoWeatherDailyForcast1(weatherNow, weatherArr){
    let bodyInfoWeatherDailyForcast1 = `
    <!-- Daily Weather md+ display -->
        <div class="row d-none">
            <div class="col-3 daily-box">
                <p class="weather-description">${weatherNow.daily[0].weather[0].description}</p>
                <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                <p class="bold">${convertUnixToDay(weatherNow.daily[0].dt)}</p>
                <p>Temp:${getAbslouteValue(weatherNow.daily[0].temp.max)}ºc</p>
            </div>

            <div class="col-3 daily-box">
                <p class="weather-description">${weatherNow.daily[1].weather[0].description}</p>
                <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                <p class="bold">${convertUnixToDay(weatherNow.daily[1].dt)}</p>
                <p>Temp:${getAbslouteValue(weatherNow.daily[1].temp.max)}ºc</p>
            </div>
       `;
       weatherArr.push(bodyInfoWeatherDailyForcast1);
};

//Gets the daily weather section 3+4 of More Info
function createBodyInfoWeatherDailyForcast2(weatherNow, weatherArr){
    let bodyInfoWeatherDailyForcast2 = `
                <div class="col-3 daily-box">
                    <p class="weather-description">${weatherNow.daily[2].weather[0].description}</p>
                    <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                    <p class="bold">${convertUnixToDay(weatherNow.daily[2].dt)}</p>
                    <p>Temp:${getAbslouteValue(weatherNow.daily[2].temp.max)}ºc</p>
                </div>

                <div class="col-3 daily-box">
                    <p class="weather-description">${weatherNow.daily[3].weather[0].description}</p>
                    <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                    <p class="bold">${convertUnixToDay(weatherNow.daily[3].dt)}</p>
                    <p>Temp:${getAbslouteValue(weatherNow.daily[3].temp.max)}ºc</p>
                </div>
            </div>
        </div>
       `;
       weatherArr.push(bodyInfoWeatherDailyForcast2);
};

//Gets the small daily weather section 1+2 of More Info
function createBodyInfoWeatherDailyForcastSmall1(weatherNow, weatherArr) {
    let bodyInfoWeatherDailyForcastSmall1 = `
    <!-- Small more info weather Display -->
        <div class="more-info d-none d-md-none daily-forcast">
            <h5>Daily Forcast</h5>
            <div class="row">
                <div class="col-3 hourly-box">
                    <p class="weather-description">${weatherNow.daily[0].weather[0].description}</p>
                    <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                    <p class="bold">${convertUnixToDay(weatherNow.daily[0].dt)}</p>
                    <p>Temp:${getAbslouteValue(weatherNow.daily[0].temp.max)}ºc</p>
                </div>

                <div class="col-3 hourly-box">
                    <p class="weather-description">${weatherNow.daily[1].weather[0].description}</p>
                    <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                    <p class="bold">${convertUnixToDay(weatherNow.daily[1].dt)}</p>
                    <p>Temp:${getAbslouteValue(weatherNow.daily[1].temp.max)}ºc</p>
                </div>
       `;
       weatherArr.push(bodyInfoWeatherDailyForcastSmall1);
};

//Gets the small daily weather section 3+4 of More Info
function createBodyInfoWeatherDailyForcastSmall2(weatherNow, weatherArr) {
    let bodyInfoWeatherDailyForcastSmall2 = `
                        <div class="col-3 hourly-box">
                            <p class="weather-description">${weatherNow.daily[2].weather[0].description}</p>
                            <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                            <p>${convertUnixToDay(weatherNow.daily[2].dt)}</p>
                            <p>Temp:${getAbslouteValue(weatherNow.daily[2].temp.max)}ºc</p>
                        </div>

                        <div class="col-3 hourly-box">
                            <p class="weather-description">${weatherNow.daily[3].weather[0].description}</p>
                            <img src="${'https://openweathermap.org/img/w/' + weatherNow.daily[0].weather[0].icon + '.png'}" alt="weather Icon">
                            <p class="bold">${convertUnixToDay(weatherNow.daily[3].dt)}</p>
                            <p>Temp:${getAbslouteValue(weatherNow.daily[3].temp.max)}ºc</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>  
       `;
       weatherArr.push(bodyInfoWeatherDailyForcastSmall2);
};

//Creates the more info button and closes the body
function createBodyMoreInfoButton(weatherArr) {
    let bodyMoreInfoButton = `
        <div class="row">
            <div class="col-md-5 result-row">
                <button class="button btn-blue btn--info" onclick="moreInfo(this)">More Info</button>
            </div>

    </div>
    `
    weatherArr.push(bodyMoreInfoButton);
};

// Changes the More info button to Less Info when clicked
function moreInfo(elem) {
    let parent = elem.parentElement.parentElement.parentElement.getElementsByClassName('more-info');

    if(elem.innerText === 'More Info'){
        elem.innerText = `Less Info`;
        removeMoreInfoClasses(parent);
    } else {
        elem.innerText = 'More Info';
        addMoreInfoClasses(parent);
    };
};

//Removes the classes in order to show more info on the result
function removeMoreInfoClasses(parent) {
        parent[0].classList.remove('d-none');
        parent[1].classList.remove('d-none');
        parent[2].classList.remove('d-none');
        parent[3].classList.remove('d-none');
        parent[4].classList.remove('d-none');
        parent[5].classList.remove('d-none');
};

//Adds the classes in order to hide more info on the result
function addMoreInfoClasses(parent) {
        parent[0].classList.add('d-none');
        parent[1].classList.add('d-none');
        parent[2].classList.add('d-none');
        parent[3].classList.add('d-none');
        parent[4].classList.add('d-none');
        parent[5].classList.add('d-none');
};

//switches between the hourly and daily weather forcast
function showHidedailyHour(elem) {
    let weatherHour = elem.parentElement.nextElementSibling;
    let weatherDay = elem.parentElement.nextElementSibling.nextElementSibling;
    
    if(elem.previousElementSibling.innerHTML === '0'){
        showDailyWeather(elem, weatherHour, weatherDay);
    }else{
        showHourlyWeather(elem, weatherHour, weatherDay);
    }
};

//shows the daily wather element, hiding the hourly weather element
function showDailyWeather(elem, weatherHour, weatherDay) {
        weatherHour.classList.add('d-none');
        weatherDay.classList.remove('d-none');
        elem.previousElementSibling.innerHTML = '1';
};

//shows the hourly wather element, daily the hourly weather element
function showHourlyWeather(elem, weatherHour, weatherDay) {
        weatherHour.classList.remove('d-none');
        weatherDay.classList.add('d-none');
        elem.previousElementSibling.innerHTML = '0';
};

//converts unix timecode to hours
function convertUnixToTime(unix) {
    
            dateObj = new Date(unix * 1000);

            hours = dateObj.getUTCHours(); // Get hours from the timestamp
            minutes = dateObj.getUTCMinutes(); // Get minutes from the timestamp

            hoursMin = hours.toString().padStart(2, '0') + ':' +
                minutes.toString().padStart(2, '0'); //combine hours and minutes
            
                return hoursMin;
};

function convertUnixToDay(unix) {
        const milliseconds = unix * 1000;
        const dateObject = new Date(milliseconds);

    return dateObject.toLocaleString("en-gb", {weekday: "long"})
};
 
// Gets the phone number if it exists, if it doesn't, shows no phone icon
function getPhone(result) {
        if(result.contacts) { //if contacts exists in result
            if (result.contacts[0].phone){ //if phone exists in contacts
                return result.contacts[0].phone[0].value; //display phone number
            } else if (result.contacts[0].mobile) { //if no phone number, check for mobile number
                return result.contacts[0].mobile[0].value; //display mobile number
            }
        } else { // if no phone or mobile
            return `<i class="fas fa-phone-slash"></i>`; //display no phone icon
        };
};

//Gets the hours the location is open, if none available, asks to call
function getHours(result) {
    if(result.openingHours){
        return result.openingHours[0].text
    } else {
        return `<i class="fas fa-phone"></i><span class="result-data">- Call to confirm</span>`;
    }
};

//Converts the distance in meters to miles to 1dp and returns it
function getDistance(mDist) {
    const distKm = mDist * 0.001; //convert meters to KM
    const dist = distKm / 1.609; //converts KM to Miles
    return dist.toFixed(1); //Returns distance in miles to 1 decimal place
};

//gets the website address for the result
function getWebsite(result) {
    if(result.contacts) { //if contacts exists in result
        if (result.contacts[0].www){ //if website exists in contacts
            return result.contacts[0].www[0].value; //display website 
        } else if (result.contacts[0].www) { //if no website 1, check for website 2
            return `<a href="${result.contacts[0].www[1].value}" alt="${result.title}" target="_blank"</a>`; //display website
        } else {
            return `<i class="fas fa-phone"></i><span class="result-data">Website not available</span>`;
        }
    } else { // if no website
        return `<i class="fas fa-phone"></i><span class="result-data">Website not available</span>`;
    };
};

//gets the email address for the result
function getEmail(result) {
    if(result.contacts) { //if contacts exists in result
        if (result.contacts[0].email){ //if email exists in contacts
            return result.contacts[0].email[0].value; //display email 
        } else {
            return `<i class="fas fa-phone"></i><span class="result-data">- Please Call</span>`;
        }
    } else { // if no email
        return `<i class="fas fa-phone"></i><span class="result-data">- Please Call</span>`;
    };
};

//converts the string temp to a number with 2 digits
function getAbslouteValue(temp) {
    return parseInt(temp, 10);
};

//Create the radius div and set the innerHTML
function makeRadius() {
    if (firstRadius) { //if frist radius is true (First Run)
        let radiusArea = document.createElement('div');// Create new Div
        radiusArea.classList.add('row');
        radiusArea.innerHTML = `
            <div class="row m-0 radius-container" id="radius-container">
                <div class="col-md-6 col-sm-12 gx-0">
                    <div class="radius-adjust" id="radius-adjust">
                        <label for="radius">Radius: </label>
                        <input type="range" step="8000" min="1" max="80490" value="16093"  class="slider" id="radius">
                        <p class="d-inline" id="radius-val"><span id="radius-value">10</span> Miles</p>
                        <button id="radius-update" class="button btn-radius btn-blue">Update</button>
                    </div>
                </div>
                <div class="col-md-6 col-sm-12 gx-0">
                    <div id="result-no-container" class="result-num-container">
                        <p class="d-inline">Results:<span id="num-of-results"></span><span class="small"><em>(Max 100)</em></span?</p>
                    </div>
                </div>
            </div>
        `;
        const searchUpperContainer = document.getElementById('search-area-container');
        searchUpperContainer.prepend(radiusArea);
        firstRadius = false; //Set the variable to false

        let rval = document.getElementById('radius-value');
        let radiusSlide = document.getElementById('radius');

        radiusSlide.oninput = function() { //Displayed the radius selected when the slider is moved
            let mls = getDistance(radiusSlide.value);
            rval.innerHTML = Math.round(mls); //rounds the numer and siaplyed in rval
        };

        let radiusUpdateBtn = document.getElementById('radius-update');

        radiusUpdateBtn.addEventListener('click', function () {
            if(geoSearch) {
                numRes.innerHTML = [];
                resultsContain.innerHTML = ""; //Set String empty each time function run
                mapContainer.innerHTML = ""; //Set String empty each time function run
                radius = radiusSlide.value;
                discoverSearch(coords, addMapEl); //run discover function taking coords and run the addReults &  addMapEl function
            } else {
                searchLatLng = []; //Set array to empty each time function run
                numRes.innerHTML = [];
                resultsContain.innerHTML = ""; //Set String empty each time function run
                mapContainer.innerHTML = ""; //Set String empty each time function run
                radius = radiusSlide.value;
                getSearchData(searchBox.value) //Run function to get search results
            }
        });
    };
    const numRes = document.getElementById('num-of-results');
    numRes.innerHTML = numOfResults;  
};

//gets coordinates and focuses the map on that location
function moveMapToResult(event, map) {

    let lat  = event.dataset.lat; //set the lat from the dataset lat
    let lng = event.dataset.lng;//set the lng from the dataset lng

    map.setCenter({ //Sets the Lat & Lng of the map
        lat: lat, 
        lng: lng
    });
    map.setZoom(14); //Sets the Zoom level of the map
    console.log('Move map to: lat ' + lat + ',lng ' + lng);
};


