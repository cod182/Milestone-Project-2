const hereApiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key
const hereUserId = 'HERE-9843d6a3-4032-4da0-baf4-2d719893cbd5';
const hereClientId = 'viVz45yDq8PgWQBJT5fE';
const hereAccessKeyId = 'Xd0fC9GEvWMZ6Kq4DVH3gQ';
const hereAccessKeySecret = '9LLdVKvpXrRoxTYD251yXbUBjmf5bRRcDlZdkDPqSoNvaq3QN5-r8dh5EON99cLD9g538k7Cz3cOA0UVOE9mkA';
const hereTokenEndpointUrl = 'https://account.api.here.com/oauth2/token';
const bearerToken = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyNDYxMzY5MywiZXhwIjoxNjI0NzAwMDkzLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLkpVSjFpc0pMTjYxTnJQRnp0SWZXTEEuME92MlFUNGd5allCLTJ0SmRVXzlvc3hVcG1kSF9ObGNkRTNvNHZTNkdIbVEzMkpYMWNhVndfY3UyUTZQa29aWXJvUXNYMC1pZHBOeEgtZ2IyQkpMR2R4UktXWkVXMGgwSmhsNGNvTkp0eGpiRVgxVnJNeENTdnJuLWY5MmYteDBNaWF3U1JHQUhHR2tCOHFyRThUaVd3LkVlQUFob2tLbmxLYmlyT3drcDVmazBJWGpINVU2TUVTQWRrMjhMbWtwUE0.ZSjV5JVJcjjNm2zWCu8yqR4eFUVYYLKH-P_uwpKgodjTi8P2n6FD3vgG39mWRDqpFAQ1_gtQF2NN3nqoBUAeD5SLZvy8welwuCk4JiiPiyuiJOSoGa9lT7wrwaq6bndS5G21yf0IiouLtlB9EyHnQA6ZoRGdBR17_gV7LEnLtkDA1rt1ks8lHdXEk8wBIXcEwripAe27vfqO7yeFsQkl_P9zKktrqE_VHQfSdd4WJxGX6x7InpNfsutI9V9XqnVeFFfyaotwEoPnYPzZ2ePSNWdVGwX5lu98PLU3yUR0nLPBDTd2NW-EJgt0LaovI6FHfGWJ2-dZcIUbrI8RWyXKfQ';

const searchBox = document.getElementById('search-box');
const greetSec = document.getElementById('greeting-box');
const mapContainer = document.getElementById('map-container')
let radius = '16093';
const mapContain = document.getElementById('map');
const resultsContain = document.getElementById('search-results');
let searchLatLng = []; //Lat & Lng of search stored in an array here
let firstTime = true;
let firstRadius = true;
let darkToggle = document.getElementById('dark-toggle');

//Dark mode toggle
darkToggle.addEventListener('click', function() { //listens for dark button clicked
    if(document.body.className !== '') { //if body has a class
        removeDarkClasses(); //remove classed
    } else {    // if body has no class
        addDarkClasses(); // add classes
    }
});
// Classes to remove for Light mode
function removeDarkClasses() {
    document.body.classList.remove('dark');
    document.body.classList.remove('white-text');
    searchBox.classList.remove('dark-search');
};
//Classes to add for Dark mode
function addDarkClasses() {
    document.body.classList.add('dark');
    document.body.classList.add('white-text');
    searchBox.classList.add('dark-search');
};

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

};

function getSearchData(){
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
    discoverSearch(coords, addResults, addMapEl); //run discover function taking coords and run the addReults &  addMapEl function
};

// Runs a search to API using coords
// Callback 1 for addResults function, 2 for AddMapsEL function
function discoverSearch(coords, cb, cb2) {
    const urlOrg = "https://discover.search.hereapi.com/v1/discover?q=";
    const url = urlOrg + 'campground' + '&in=circle:' + coords + ';r=' + radius + '&limit=100';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(JSON.parse(xhr.responseText));
        const results = JSON.parse(xhr.responseText).items;
        cb(results); // Callback for addReults function
        cb2(results); // Callbakc for addMapEl function
        }};
    xhr.send();
};

function addResults(results) {
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
    const distance = getDistance(result.distance); //Gets the distance to location in KM
    makeRadius();
    
    resultDiv.innerHTML = `
                <div class="result-title-container">
                    <h2 class="blue bold result-row">${result.title}</h2>
                </div>
            <div class="col-9" id="data-text">
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
                    <button class="btn btn-blue btn-info" data-info-modal data-bs-toggle="modal" data-bs-target="#resultMoreInfo">More Info</button>
                </div>
                </div>
    `;
    resultsContain.appendChild(resultDiv); //Appends resultDiv as a child of resultsContain
    };


function addMoreInfo(result) {
    const modalOfInfo = document.body.querySelector('[data-modal-info]');
    let modalHead = document.createElement('div');
    modalHead.classList.add('modal-header');

    modalHead.innerHTML = `
        <h5 class="modal-title roboto result-title blue bold" id="resultMoreInfoLabel">${result.title}</h5>
        <button type="button" class="btn-close m-0" data-bs-dismiss="modal" aria-label="Close"></button>
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
                      <p class="result-data">123 example street</p>
                      <p class="result-data">Example city</p>
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
                      <p class="result-data">02938 273748</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3 result-row">
                      <p class="result-label">Email:</p>
                    </div>
                    <div class="col-9">
                      <p class="result-data">location@email.com</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3 result-row">
                      <p class="result-label">Website:</p>
                    </div>
                    <div class="col-9">
                      <p class="result-data">www.location.com</p>
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
 
// Gets the phone number if it exists, if it doesn't, shows no phone icon
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
function getDistance(mDist) {
    const distKm = mDist * 0.001; 
    const dist = distKm / 1.609; //converts KM to Miles
    return dist.toFixed(1); //Returns distance is miles to 1 decimal place
};

//Create Modal

function createInfoModal() {
    
    const infoModalContainer = document.getElementById('resultMoreInfo');
    let infoModal = document.createElement('div');
    infoModal.classList.add('modal-dialog'); //Adds the class to the div
    infoModal.classList.add('modal-dialog-centered'); //Adds the class to the div

    infoModal.innerHTML = `
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title roboto result-title blue bold" id="resultMoreInfoLabel">Location</h5>
            <button type="button" class="btn-close m-0" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body result-modal">
            <div class="row">
                <div class="col-9">
                <div class="row">
                    <div class="col-3 result-row">
                    <p class="result-label">Address:</p>
                    </div>
                    <div class="col-9">
                    <p class="result-data">123 example street</p>
                    <p class="result-data">Example city</p>
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
                    <p class="result-data">02938 273748</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 result-row">
                    <p class="result-label">Email:</p>
                    </div>
                    <div class="col-9">
                    <p class="result-data">location@email.com</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 result-row">
                    <p class="result-label">Website:</p>
                    </div>
                    <div class="col-9">
                    <p class="result-data">www.location.com</p>
                    </div>
                </div>
                </div>
                <div class="col-3">
                <div class="weather"></div>
                </div>
            </div>
        </div>
        </div>
    `;

    infoModalContainer.appendChild(infoModal);
}

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
    addMapMarker(map, results, ui)
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

        const phone = getPhone (result);

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

//Create the radius div and set the innerHTMl
function makeRadius() {
    if (firstRadius) { //if frist radius is true (First Run)
        let radiusArea = document.createElement('div');// Create new Div
        radiusArea.classList.add('row');
        radiusArea.innerHTML = `
            <div class="col-12">
                <div id="radius-container">
                    <label for="radius">Radius: </label>
                    <input type="range" min="1" max="80490" value="16093" class="slider" id="radius">
                    <p class="d-inline" id="radius-val"><span id="radius-value">10</span> Miles</p>
                    <button id="radius-update" class="btn btn-info btn-radius">Update</button>
                </div>
            </div>
        `;

        greetSec.appendChild(radiusArea);
        let rval = document.getElementById('radius-value');
        let radiusSlide = document.getElementById('radius');
        let radiusVal = document.getElementById('radius-val');

        radiusSlide.oninput = function() { //if the
            let mls = getDistance(radiusSlide.value);
            rval.innerHTML = mls;
        };
        firstRadius = false; //Set the variable to false
        let radiusUpdateBtn = document.getElementById('radius-update');
        radiusUpdateBtn.addEventListener('click', function () {
        searchLatLng = []; //Set array to empty each time function run
        resultsContain.innerHTML = ""; //Set String empty each time function run
        mapContainer.innerHTML = ""; //Set String empty each time function run
        radius = radiusSlide.value;
        getSearchData(searchBox.value) //Run function to get search results
    });
    };

    
};


