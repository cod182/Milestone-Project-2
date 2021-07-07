const hereApiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key

const searchBox = document.getElementById('search-box');
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
let numOfResults = [];
const aboutText = document.getElementById('about-text');
let map = null; //map variable
let firstWeather;

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

let darkMode = localStorage.getItem('darkMode')

// Classes to remove for Light mode
const disableDark = () => {
    document.body.classList.remove('dark');
    document.body.classList.remove('white-text');
    searchBox.classList.remove('dark-search');
    locate.classList.remove('white-text');
    localStorage.setItem('darkMode', null);


};
//Classes to add for Dark mode
const enableDark = () => {
    document.body.classList.add('dark');
    document.body.classList.add('white-text');
    searchBox.classList.add('dark-search');
    locate.classList.add('white-text');
    localStorage.setItem('darkMode','enabled');
};

//Checks if dark mode is enabled in local storage
if(darkMode === 'enabled') {
    enableDark();
};

//Dark mode toggle
darkToggle.addEventListener('click', () => { //listens for dark button clicked
    darkMode = localStorage.getItem('darkMode')
    if(darkMode !== 'enabled') { //if body has a class
        enableDark(); // add classes
    } else {    // if body has no class
        disableDark(); //remove classed
    }
});

// Get location using geolocation and run a search based on resulting Lat/Lng
locate.addEventListener('click', function(event){ //Event listener on the locate button
        if (firstTime) { // If this this the first run, run the below code
            classChange(); //Run function to add classed
            firstTime = false;
        } else {
            document.getElementById('radius-value').innerHTML = '10';
            document.getElementById('radius').value = '16093';
        };
        searchBox.value = '';
        radius = '16093';
        numOfResults = [];
        searchLatLng = []; //Set array to empty each time function run
        resultsContain.innerHTML = ""; //Set String empty each time function run
        mapContainer.innerHTML = ""; //Set String empty each time function run
        geoSearch = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            searchLatLng.push(position.coords.latitude);
            searchLatLng.push(position.coords.longitude);
            coords = searchLatLng.toString();
            discoverSearch(coords, addMapEl); //run discover function taking coords and run the addReults &  addMapEl function
        })
      }
    });

//When enter is pressed, the search box shrinks, the map is added and getData runs
searchBox.addEventListener("keyup", function(event) { //Event listener to key up event
    if (event.key === "Enter") { // If key up is Enter then...
        if (firstTime) { // If this this the first run, run the below code
            classChange(); //Run function to add classed
            firstTime = false;
        } else {
            document.getElementById('radius-value').innerHTML = '10';
            document.getElementById('radius').value = '16093';
        };
        radius = '16093';
        firstWeather = true;
        geoSearch = false;
        numOfResults = [];
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

function getSearchData(){
    const search = searchBox.value; //Gets the value of the search
    getLatLng(search, getCoords);
};


// Get the Latitude and Londitude of the search
function getLatLng(search, cb){
    const urlGeo = 'https://geocode.search.hereapi.com/v1/geocode?q=';
    const urlComp = urlGeo + search + '&in=countryCode:GBR' + '&apiKey=' + hereApiKey; //combining the api url with the search term and limiting to GBR
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urlComp);
    
    xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(JSON.parse(xhr.responseText));
            const data = JSON.parse(xhr.responseText);
            cb(data); //Call back to getCoords
            };
    };
    xhr.send();
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
    
    addResults(results, map);
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
async function addResults(results) { 
    numOfResults = results.length; //sets the number of results for the radius results
    makeRadius(); //Runs the makeRadis function
    results.forEach(function(result){
        addResultToPage(result);
    });

};

//takes the result and gets an XML document of info related, then calls back for addReultsToPage
// function getWeather(result) {
    // RESULTS OUT OF ORDER

//     return new Promise(resolve => {
//         const weatherUrl = 'https://weather.cc.api.here.com/weather/1.0/report.xml?apiKey=' + hereApiKey + '&product=observation&latitude=' + result.position.lat + '&longitude=' + result.position.lng + '&oneobservation=true';
//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", weatherUrl);
//         let weatherResult = null;

//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 3) {
//                 console.log('getWeather','Status - ' + xhr.status, 'readyState - ' + xhr.readyState); //LOG status and ready State
//             }else if (xhr.readyState === 4) {
//                 console.log('getWeather','Status - ' + xhr.status, 'readyState - ' + xhr.readyState);
//                 let parser = new DOMParser();
//                 let xmlDoc = parser.parseFromString(xhr.response, 'text/xml');
//                 weatherResult = xmlDoc.getElementsByTagName('observation')[0]; //get the first tag of type observation and assign it to weather variable

//             } };
//         xhr.send();
//         setTimeout(() => {
//           resolve(weatherResult);
//         }, 3000);
//       });
    
//     };

async function getWeather(result) {

// RESULTS OUT OF ORDER
//Here Maps API
    // const weatherUrl = 'https://weather.cc.api.here.com/weather/1.0/report.xml?apiKey=' + hereApiKey + '&product=observation&latitude=' + result.position.lat + '&longitude=' + result.position.lng + '&oneobservation=true';

    // return await fetch(weatherUrl)
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //     return response.text();
    // })
    // .then(data => {
    //     let parser = new DOMParser();
    //     let xmlDoc = parser.parseFromString(data, 'text/xml'); //
    //     return xmlDoc.getElementsByTagName('observation')[0]; //get the first tag of type observation and assign it to weather variable
    // })
    // .catch(error => {
    //     console.error('There has been a problem with your fetch operation:', error);
    //   });


// RESULTS OUT OF ORDER
//Open Weather API
    const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ result.address.city + '&units=metric&appid=966dc856d7503b6af207c5b5d50e5703';
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



// RESULTS OUT OF ORDER

    // try {
    //     const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ result.address.city + '&units=metric&appid=966dc856d7503b6af207c5b5d50e5703';
    //     const reposResponse = await fetch(weatherURL);
    //     const weather = await reposResponse.json();
    
    // return weather;
    //   } catch (error) {
    //     console.log(error);
    //   }
};

//Adds the result given to the DOM
async function addResultToPage (result) {
    let weatherNow = await getWeather(result);

    let resultDiv = document.createElement('div'); //Create a new div called resultDiv
    resultDiv.classList.add('col-12'); //Adds the class to the div
    resultDiv.classList.add('result-box'); //Adds the class to the div

    const phone = getPhone (result); //Gets the contact number of the location
    const hours = getHours(result); //Gets the hours the location is open
    const distance = getDistance(result.distance); //Gets the distance to location in KM
    const email = getEmail(result); //Gets the email of the result
    const website = getWebsite(result); //Gets the website of the result

    let currWeather = weatherNow.weather[0].description; // current weather at location
    let iconWeather = 'http://openweathermap.org/img/w/' + weatherNow.weather[0].icon + '.png'; //current weather icon at location
    let currTemp = fixTemp(weatherNow.main.temp); //sets the temp to no decimal places

    resultDiv.innerHTML = `
            <div class="result-title-container col-12">
                <h2 class="blue bold result-row">
                    <a href="#map" onclick="moveMapToResult(this, map)" data-lat="${result.position.lat}" data-lng="${result.position.lng}">${result.title}</a>
                    <span class="d-inline d-md-none"><img class="weather-icon-sm" src="${iconWeather}" alt="Weather Icon"></span>
                </h2>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-9">

                    <div class="row">
                        <div class="col-3 result-row">
                            <p class="result-label">Distance:</p>
                        </div>
                        <div class="col-9 result-data-container">
                            <p class="result-data">${distance} Miles</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3 result-row">
                            <p class="result-label">Address:</p>
                        </div>
                        <div class="col-9 result-data-container">
                            <p class="result-data result-address">${result.title}</p>
                            <p class="result-data result-address">${result.address.district}</p>
                            <p class="result-data result-address">${result.address.county}</p>
                            <p class="result-data result-address more-info d-none">${result.address.city}</p>
                            <p class="result-data">${result.address.postalCode}</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3 result-row">
                            <p class="result-label">Phone:</p>
                        </div>
                        <div class="col-9 result-data-container">
                            <p class="result-data">${phone}</p>
                        </div>
                    </div>

                    <div class="row more-info d-none">
                        <div class="col-3 result-row">
                            <p class="result-label">Email:</p>
                        </div>
                        <div class="col-9 result-data-container">
                            <p class="result-data">${email}</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3 result-row">
                            <p class="result-label">Opening Hours:</p>
                        </div>
                        <div class="col-9 result-data-container">
                            <p class="result-data">${hours}</p>
                        </div>
                    </div>

                    

                    <div class="row more-info d-none">
                        <div class="col-3 result-row">
                            <p class="result-label">Website:</p>
                        </div>
                        <div class="col-9 result-data-container">
                            <p class="result-data">${website}</p>
                        </div>
                    </div>


                </div>

                <div class="col-md-3 d-none d-md-inline weather-container">
                    <div class="weather">
                        <div>
                            <h4 class="weather-title">Current Weather</h4>
                            <img src="${iconWeather}" alt="weather Icon">
                            <p class="weather-current">${currWeather}</p>
                            <p class="weather-temp">Current Temp: <span>${currTemp}ºc</span></p>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="row">
                <div class="col-md-5 result-row">
                    <button class="btn btn-blue btn-info more-info-button" onclick="moreInfo(this)">More Info</button>
                </div>
            </div>
    `;
    resultsContain.appendChild(resultDiv); //Appends resultDiv as a child of resultsContain
};

// Changes the More info button to Less Info when clicked
function moreInfo(elem) {
    let hello = document.createElement('div');
    hello.innerHTML = 'hello';
    let city = elem.parentElement.parentElement.parentElement.getElementsByClassName('more-info');
    if(elem.innerText === 'More Info'){
        elem.innerText = `Less Info`;
        city[0].classList.remove('d-none');
        city[1].classList.remove('d-none');
        city[2].classList.remove('d-none');
    } else {
        elem.innerText = 'More Info';
        city[0].classList.add('d-none');
        city[1].classList.add('d-none');
        city[2].classList.add('d-none');
    };
    

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
function fixTemp(temp) {
    return parseInt(temp, 10);
};

function addMoreInfo(result) {

    const phone = getPhone (result); //Gets the contact number of the result
    const hours = getHours(result); //Gets the hours the result is open
    const distance = getDistance(result.distance); //Gets the distance to result in miles
    const email = getEmail(result); //Gets the email of the result
    const website = getWebsite(result); //Gets the website of the result

    const modalOfInfo = document.body.querySelector('[data-modal-info]');
    let modalHead = document.createElement('div');
    modalHead.classList.add('modal-header');
    modalHead.classList.add('result-modal-header');

    modalHead.innerHTML = `
        <h5 class="result-modal-title modal-title roboto result-title blue bold" id="resultMoreInfoLabel">${result.title}</h5>
        <button type="button" class="result-modal-close btn-close m-0" data-bs-dismiss="modal" aria-label="Close"></button>
    `;

    let modalBody = document.createElement('div');
    modalBody.classList.add('result-modal');
    modalBody.classList.add('modal-body');

    modalBody.innerHTML = `
            <div class="row">
                <div class="col-9">
                  <div class="row">
                    <div class="col-3 result-row">
                      <p class="result-label">Address:</p>
                    </div>
                    <div class="col-9">
                        <p class="result-data result-address">${result.title}</p>
                        <p class="result-data result-address">${result.address.district}</p>
                        <p class="result-data result-address">${result.address.county}</p>
                        <p class="result-data">${result.address.postalCode}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3 result-row">
                      <p class="result-label">Services:</p>
                    </div>
                    <div class="col-9">
                      <p class="result-data">Water, Electric, Waste</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3 result-row">
                      <p class="result-label">Phone:</p>
                    </div>
                    <div class="col-9">
                        <p class="result-data">${phone}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3 result-row">
                        <p class="result-label">Email:</p>
                    </div>
                    <div class="col-9">
                        <p class="result-data">${email}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3 result-row">
                      <p class="result-label">Website:</p>
                    </div>
                    <div class="col-9">
                      <p class="result-data">${website}</p>
                    </div>
                  </div>
                </div>
                <div class="col-3">
                  <div class="weather"></div>
                </div>
              </div>
          </div>
    `;

    modalOfInfo.appendChild(modalHead);
    modalOfInfo.appendChild(modalBody);
};


//Create the radius div and set the innerHTML
function makeRadius() {
    if (firstRadius) { //if frist radius is true (First Run)
        let radiusArea = document.createElement('div');// Create new Div
        radiusArea.classList.add('row');
        radiusArea.innerHTML = `
            <div class="row" id="radius-container">
                <div class="col-md-6 col-sm-12 gx-0">
                    <div id="radius-adjust">
                        <label for="radius">Radius: </label>
                        <input type="range" step="8000" min="1" max="80490" value="16093"  class="slider" id="radius">
                        <p class="d-inline" id="radius-val"><span id="radius-value">10</span> Miles</p>
                        <button id="radius-update" class="btn btn-info btn-radius">Update</button>
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


