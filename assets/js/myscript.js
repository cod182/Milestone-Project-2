const hereApiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key
const hereUserId = 'HERE-9843d6a3-4032-4da0-baf4-2d719893cbd5';
const hereClientId = 'viVz45yDq8PgWQBJT5fE';
const hereAccessKeyId = 'Xd0fC9GEvWMZ6Kq4DVH3gQ';
const hereAccessKeySecret = '9LLdVKvpXrRoxTYD251yXbUBjmf5bRRcDlZdkDPqSoNvaq3QN5-r8dh5EON99cLD9g538k7Cz3cOA0UVOE9mkA';
const hereTokenEndpointUrl = 'https://account.api.here.com/oauth2/token';
const bearerToken = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyMzkyMDI0MywiZXhwIjoxNjI0MDA2NjQzLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLmlxTUthNEFmdEw3OTN2TlVpN1g5YXcuMVhEY2ZSUlZDMWE5QjczNUthbjhsbm5OQXQzWU1hX2lxOC16aFpkYWtPclROQUJZMTY2ZlZOZHI5bmhOaW1RYldHXzF5eHF1bnVDMm9SallXQk81U1dqNzNUT1BXSmpIRXB5ZTM1ejNQN1djakI2dXRtODlEYzh1VWVIa1JWNDNDN1VFRlZDZmViSWFwT25PU2F4UzdnLlF6Nnh5bkEyMTFoRXBjdUdqcUlUWWxkTGFrTUdxQlZUbjkxNmxvWmZyR2s.AJtYckbIMU5OzRE-r7GuduMJ-q6DUgXUExTSftRqIQzXpRm_ORmnn0I_OBe3hHwHOOTM4BfyDBi7G2d4He0rY-zHhpmAH9drP0EggYcATpTZy3SJz_hdIzUfLoW4rCbMFO0uHU44HndxMEqCOAtytcaZbFaof9BPvQg8NUfkKpSsbVDeu9tU8J1tMtf-e89YyCWg5qJfcbqhg7HSbO7cTRDW7Q262KJsYmmVh94vz_0KdmYDb4_Wze77Vpt1F546M0HD5wNa4tKdm42nudbeuhmpbrbLyylUdMemMgLRYa5ayifOIXlDNQDom2qEfT1QUv8NQ4aLrKfNTRjmmw8oRw';

// @param  {H.Map} map // A HERE Map instance within the application

const searchBox = document.getElementById('search-box');
const greetSec = document.getElementById('greeting-box');
const mapContain = document.getElementById('map');
const resultsContain = document.getElementById('search-results');
let firstTime = true;

//When enter is pressed, the search box shrinks, the map is added and getData runs
searchBox.addEventListener("keyup", function(event) { //Event listener to key up event
    if (event.key === "Enter") { // If key up is Enter then...
        if (firstTime) { // If this this the first run, run the below code
            classChange(); //Run function to add classed
            addMapEl(); //Run function to add the map
            firstTime = false;
        };
        resultsContain.innerHTML = "";
    getData(event) //Run function to get search results
    }
    
});

//Function to add and remove classed to prepare document for map and search results
function classChange(){
    searchBox.classList.remove('search-box-before'); //Remove class from searchBox
    searchBox.classList.add('search-box-after'); //Add class to searchBox
    greetSec.classList.remove('greeting-box-before'); //Remove class from greetSec
    greetSec.classList.add('greeting-box-after'); //Add class to greetSec
    mapContain.classList.add('map'); //Add class to mapContain
    resultsContain.classList.add('search-results-after'); // Adds the class to the search results section

}

//Initilisting the Here Map in section map
function addMapEl() {
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
    let searchLatLng = []; //Lat & Lng of search stored in an array here
    const lat = data.items[0].position.lat;
    const lng = data.items[0].position.lng;
    searchLatLng.push(lat);
    searchLatLng.push(lng);
    const coords = searchLatLng.toString();
    discoverSearch(coords); //run discover function taking coords
};

// Runs a search to API using coords
function discoverSearch(coords) {
    const urlOrg = "https://discover.search.hereapi.com/v1/discover?q=";
    const url = urlOrg + 'campsite' + '&in=circle:' + coords + ';r=16093';

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
    })
};

function addResultToPage (result) {
    let resultDiv = document.createElement('div');
    resultDiv.classList.add('col-md-4');
    resultDiv.classList.add('result-box');

    resultDiv.innerHTML;
    resultsContain.appendChild(resultDiv);
    };