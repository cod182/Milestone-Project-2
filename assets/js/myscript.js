const hereApiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key
const hereUserId = 'HERE-9843d6a3-4032-4da0-baf4-2d719893cbd5';
const hereClientId = 'viVz45yDq8PgWQBJT5fE';
const hereAccessKeyId = 'Xd0fC9GEvWMZ6Kq4DVH3gQ';
const hereAccessKeySecret = '9LLdVKvpXrRoxTYD251yXbUBjmf5bRRcDlZdkDPqSoNvaq3QN5-r8dh5EON99cLD9g538k7Cz3cOA0UVOE9mkA';
const hereTokenEndpointUrl = 'https://account.api.here.com/oauth2/token';
const bearerToken = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyNDM1MDU0NSwiZXhwIjoxNjI0NDM2OTQ1LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLmVkRHBEQmVrWGFPR1lub19XM2xlOEEuS3dmOTc0WVVvMVh2bUVUX3AtZXVzeE4xbEtwaVlzSjBpSVg0RXVxTko5cHlsYmZET2hEcFZQSjRhYlNva2E0ZlhLck9kd0hFTnlHMEtuOE9QMDRrN2pIU2dSVWg0MVRqaTlxRkFnTHE4VzhoRlFXNktNWDJCQklxV0dXT0l5V1QxWWpLeG82YW1xSjhrQUhQXzh6TkNnLi1kMXotOGFVNHpBeF85WVllUXVBSjlmVUYzU2kybXlhLW42UWhoeHU4dGM.qikQJdiCU6jDIhMDdkmMheD2hB94Y9RXRruFuemw8ZMHgGEVbezRJgi4iQ-VE2l0Ob7Ur1cotVRyW9FYEEZd1PLciY8gOv4UnQY4013apsV-PST6ZHMOsekCRimOv8Jj10aXIv3SGt6v2O5u1vOYJeGtV0lxFRMp0_-bD1LWo8cjWoj_oUgpnSA84LfAndJcBi2iFJL036O9Jjh2f_1D9dzAXpSh0fL1iblsfGDilaNVP0OwpVKXXG7mMHHeszKpA-3oYCs265x68XADJjVmWy_nLh15lMHc5AM9ef-ga0q8CNV2-Acd74-5fmvE8W5FPrjGRc8Vhfgmmp9ealGpZw';

const searchBox = document.getElementById('search-box');
const greetSec = document.getElementById('greeting-box');
const mapContainer = document.getElementById('map-container')
const mapContain = document.getElementById('map');
const resultsContain = document.getElementById('search-results');
let currentSearch = [];
let markerLocations = [];
let searchLatLng = []; //Lat & Lng of search stored in an array here
let firstTime = true;
let runMap = true; //If true the map is allowed to run

window.onload = getBearer()

function getBearer() {
    
};


//When enter is pressed, the search box shrinks, the map is added and getData runs
searchBox.addEventListener("keyup", function(event) { //Event listener to key up event
    if (event.key === "Enter") { // If key up is Enter then...
        if (firstTime) { // If this this the first run, run the below code
            classChange(); //Run function to add classed
            firstTime = false;
        };
        searchLatLng = []; //Set array to empty each time function run
        resultsContain.innerHTML = ""; //Set String empty each time function run
        mapContainer.innerHTML = ""; //Set String empty each time function run
        getData(event) //Run function to get search results
    }
    
});

//Function to add and remove classed to prepare document for map and search results
function classChange(){
    searchBox.classList.remove('search-box-before'); //Remove class from searchBox
    searchBox.classList.add('search-box-after'); //Add class to searchBox
    greetSec.classList.remove('greeting-box-before'); //Remove class from greetSec
    greetSec.classList.add('greeting-box-after'); //Add class to greetSec
    resultsContain.classList.add('search-results-after'); // Adds the class to the search results section

};

function getData(){
    const search = searchBox.value; //Gets the value of the search
    getLatLng(search, getCoords);
};


// Get the Latitude and Londitude of the search
function getLatLng(search, cb){
    const urlGeo = 'https://geocode.search.hereapi.com/v1/geocode?q=';
    const urlComp = urlGeo + search + '&in=countryCode:GBR'; //combining the api url with the search term and limiting to GBR
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urlComp);
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
    
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
    discoverSearch(coords, addResults, addMapEl); //run discover function taking coords
};


// Runs a search to API using coords
function discoverSearch(coords, cb, cb2) {
    const urlOrg = "https://discover.search.hereapi.com/v1/discover?q=";
    const url = urlOrg + 'campground' + '&in=circle:' + coords + ';r=16093';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(JSON.parse(xhr.responseText));
        const results = JSON.parse(xhr.responseText).items;
        cb(results);
        cb2(results);
        }};
    xhr.send();
};

function addResults(results) {
    markerLocations = [];
    results.forEach(function(result){
        addResultToPage(result);
    });
};

function addResultToPage (result) {
    let resultDiv = document.createElement('div'); //Create a new div called resultDiv
    resultDiv.classList.add('col-lg-4'); //Adds the class to the div
    resultDiv.classList.add('col-md-6'); //Adds the class to the div
    resultDiv.classList.add('col-sm-12'); //Adds the class to the div
    resultDiv.classList.add('result-box'); //Adds the class to the div
    const phone = getPhone (result); //Gets the contact number of the location
    const hours = getHours(result); //Gets the hours the location is open
    const distance = getDistance(result); //Gets the distance to location in KM
    currentSearch = result.position;

    resultDiv.innerHTML = `
                <div class="result-title-container">
                    <h2 class="blue bold result-row">${result.title}</h2>
                </div>
            <div class="col-9">
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
                <div class="row">
                    <div class="col-3 result-row">
                        <p class="result-label">Opening Hours:</p>
                    </div>
                    <div class="col-9 result-data-container">
                        <p class="result-data">${hours}</p>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="weather"></div>
            </div>
                <div class="row">
                <div class="col-md-5 result-row">
                    <button class="btn btn-blue btn-info" data-bs-toggle="modal" data-bs-target="#resultMoreInfo">More Info</button>
                </div>
                </div>
    `;
    resultsContain.appendChild(resultDiv); //Appends resultDiv as a child of resultsContain
    };

// Gets the phone numer if it exists, if it doesn't, shows no phone icon
function getPhone(result) {
        if(result.contacts) {
            if (result.contacts[0].phone){
                return result.contacts[0].phone[0].value;
            } else if (result.contacts[0].mobile) {
                return result.contacts[0].mobile[0].value;
            }
        } else {
            return `<i class="fas fa-phone-slash"></i>`;
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

//Converts the distance in miles to KM to 1dp and returns it
function getDistance(result) {
    const rawDist = result.distance
    const distKm = rawDist * 0.001;
    const dist = distKm / 1.609;
    return dist.toFixed(1);
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
      const map = new H.Map(document.getElementById('map'), //Here map placed into div with ID map (mapDiv)
        defaultLayers.vector.normal.map,{
        center: {lat:50, lng:5},
        zoom: 4,
        pixelRatio: window.devicePixelRatio || 1
      });

      window.addEventListener('resize', () => map.getViewPort().resize()); //Resize map when window resized
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      const ui = H.ui.UI.createDefault(map, defaultLayers);

      moveMapToLocation(map); //Run function to move map to searched
      addMapMarker(map, results)
};

 //Move the center of the map to specified locatioin
function moveMapToLocation(map){
    const lat = searchLatLng[0].toString(); //sets latitude from searhLatLng array
    const lng = searchLatLng[1].toString(); //sets longitude from searhLatLng array

    map.setCenter({ //Sets the Lat & Lng of the map
        lat: lat, 
        lng: lng
    });
    map.setZoom(12); //Sets the Zoom level of the map
    const SearchLocation = new H.map.Marker({lat:lat, lng:lng});//Adds a marker where search was
    map.addObject(SearchLocation);
  };

function addMapMarker(map, results) {
    results.forEach(function(result){
        const lat = result.position.lat;
        const lng = result.position.lng;

        var outerElement = document.createElement('div'),
            innerElement = document.createElement('div');

    
        outerElement.appendChild(innerElement);
    
        // Add text to the DOM element
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
        map.addObject(locationMarker);
    });
    
};
