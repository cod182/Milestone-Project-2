const hereApiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key
const hereUserId = 'HERE-9843d6a3-4032-4da0-baf4-2d719893cbd5';
const hereClientId = 'viVz45yDq8PgWQBJT5fE';
const hereAccessKeyId = 'Xd0fC9GEvWMZ6Kq4DVH3gQ';
const hereAccessKeySecret = '9LLdVKvpXrRoxTYD251yXbUBjmf5bRRcDlZdkDPqSoNvaq3QN5-r8dh5EON99cLD9g538k7Cz3cOA0UVOE9mkA';
const hereTokenEndpointUrl = 'https://account.api.here.com/oauth2/token';
const bearerToken = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyNDAwODIxOCwiZXhwIjoxNjI0MDk0NjE4LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLnRxX0xZdmUwejUxd1NMdm03RnFWSkEua09KZlk3Qy13SmJfQ3N2c2VLQzREcWh5c1VUdjdPbUJwOVA3eW5YRld1TE1qbUNkbDNyVDZnM2tRRWFrNHlZX1JqbG9XOEZGb1ctSkRXY3I1dnhkLWNibUYyU1hEZ1dOc2dzc3hjcFo2RGhodFFIZWdDT21SVXFBTU9Id2JoRHgzb01NZXdibUwtRkRGeGJWR0trLWpRLldkaUhhbk93VUN5OFh0RlB1NF8yc0xRZUNnNzNfZDk1OGVmcktVQS1pQ0U.uL6Lh5yTLJG8AHNUcAZzwWAH14Yvx4ys854SHM6FDFXPen2Nyykfgj-Rx0mLqU6nRr2waiFa6G3lYCm-VrigUtJrmdZziZl4OK_OpLBCCftyFTgBE9ZN1oeTdwb4m9uACAyb627Dvbx75FwbOZh_Saw1aN4KfXkAxN9n9hErPbQpGK1-jCQcw0Fi1lPHcTk9GvIzmnRveiQqJmx3sEDLG5ChQD1enj-R9tiMgpluevoXGDglkgb0nCFUXCHIkBs5Mkc3YI-y2dZc_iXByiZzkSdirJ8ML5bETrzsHHP3s52WLPkdKMNt9xYep3U9Q8-wjNyq0PjmeUx8iMgkJndZFA';

const searchBox = document.getElementById('search-box');
const greetSec = document.getElementById('greeting-box');
const mapContainer = document.getElementById('map-container')
const mapContain = document.getElementById('map');
const resultsContain = document.getElementById('search-results');
let searchLatLng = []; //Lat & Lng of search stored in an array here
let firstTime = true;
let runMap = true;




//When enter is pressed, the search box shrinks, the map is added and getData runs
searchBox.addEventListener("keyup", function(event) { //Event listener to key up event
    if (event.key === "Enter") { // If key up is Enter then...
        if (firstTime) { // If this this the first run, run the below code
            classChange(); //Run function to add classed
            firstTime = false;
        };
        searchLatLng = []; //Set array to empty
        resultsContain.innerHTML = ""; //Set String empty
        mapContainer.innerHTML = ""; //Set String empty
        getData(event) //Run function to get search results
    }
    
});

//Function to add and remove classed to prepare document for map and search results
function classChange(){
    searchBox.classList.remove('search-box-before'); //Remove class from searchBox
    searchBox.classList.add('search-box-after'); //Add class to searchBox
    greetSec.classList.remove('greeting-box-before'); //Remove class from greetSec
    greetSec.classList.add('greeting-box-after'); //Add class to greetSec
    // mapContain.classList.add('map'); //Add class to mapContain
    resultsContain.classList.add('search-results-after'); // Adds the class to the search results section

}

//Initilisting the Here Map in section map
function addMapEl() {
    let mapDiv = document.createElement('div'); //Create a new div called resultDiv
    mapContainer.appendChild(mapDiv); //Appends resultDiv as a child of resultsContain
    mapDiv.id ='map';
    mapDiv.classList.add('map');
    

    const platform = new H.service.Platform({ //New instance of Here Map
        apikey: hereApiKey //setting API key
      });
      const defaultLayers = platform.createDefaultLayers();
      const map = new H.Map(document.getElementById('map'),
        defaultLayers.vector.normal.map,{
        center: {lat:50, lng:5},
        zoom: 4,
        pixelRatio: window.devicePixelRatio || 1
      });
      window.addEventListener('resize', () => map.getViewPort().resize()); //Resize map when window resized
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      const ui = H.ui.UI.createDefault(map, defaultLayers);

      moveMapToLocation(map)
};


// Boiler Plate Code created with postman.co
function getData(){
    const search = searchBox.value; //Gets the value of the search
    getLatLng(search);
};


// Get the Latitude and Londitude of the search
function getLatLng(search){
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
            getCoords(data);
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
    discoverSearch(coords); //run discover function taking coords
    addMapEl()
};


// Runs a search to API using coords
function discoverSearch(coords) {
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
        addResults(results); //Run function to add results to the search results area
        }};
    xhr.send();
};

function addResults(results, i) {
    results.forEach(function(result){
        addResultToPage(result);
        console.log(result)
        addMapMarker(result);
    })
};

function addResultToPage (result) {
    let resultDiv = document.createElement('div'); //Create a new div called resultDiv
    resultDiv.classList.add('col-md-4'); //Adds the class to the div
    resultDiv.classList.add('result-box'); //Adds the class to the div
    const phone = getPhone (result); //Gets the contact number of the location
    const hours = getHours(result); //Gets the hours the location is open
    const distance = getDistance(result); //Gets the distance to location in KM

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
                        <p class="result-data">${distance} Km</p>
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
    const dist = rawDist * 0.001;
    return dist.toFixed(1);
}
 //Move the center of the map to specified locatioin
function moveMapToLocation(map){
    const lat = searchLatLng[0].toString(); //sets latitude from searhLatLng array
    const lng = searchLatLng[1].toString(); //sets longitude from searhLatLng array

    map.setCenter({ //Sets the Lat & Lng of the map
        lat: lat, 
        lng: lng
    });
    map.setZoom(12); //Sets the Zoom level of the map
  };

function addMapMarker(result, map) {
    const lat = result.position.lat;
    const lng = result.position.lng;
    console.log(map, lat)

    const marker = new H.map.Marker({lat:lat, lng:lng});
    // map.addObject(marker);
}
