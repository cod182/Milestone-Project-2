const hereApiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key
const hereUserId = 'HERE-9843d6a3-4032-4da0-baf4-2d719893cbd5';
const hereClientId = 'viVz45yDq8PgWQBJT5fE';
const hereAccessKeyId = 'Xd0fC9GEvWMZ6Kq4DVH3gQ';
const hereAccessKeySecret = '9LLdVKvpXrRoxTYD251yXbUBjmf5bRRcDlZdkDPqSoNvaq3QN5-r8dh5EON99cLD9g538k7Cz3cOA0UVOE9mkA';
const hereTokenEndpointUrl = 'https://account.api.here.com/oauth2/token';
// @param  {H.Map} map // A HERE Map instance within the application

//When enter is pressed, the search box shrinks and the map is added
const searchBox = document.getElementById('search-box');
const greetSec = document.getElementById('greeting-box');
const mapContain = document.getElementById('map');
const resultsContain = document.getElementById('search-results');
let firstTime = true;

searchBox.addEventListener("keyup", function(event) { //Event listener to key up event
    if (event.key === "Enter") { // If key up is Enter then...
        if (firstTime) { // If this this the first run, run the below code
            classChange(); //Run function to add classed
            addMapEl(); //Run function to add the map
            firstTime = false;
        };
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
    xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyMzgzMzczOCwiZXhwIjoxNjIzOTIwMTM4LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLnlqSC1FQ1NlT1hXSUw2UU5fVm9BeXcub0tNVGZuVUxRRWVQU0xROTZvejN0MnRkZGkzM1J6N01BWWRfbjRrdXdtSlhyaG9nUXJIZDUwOTNPSTdGZjJPSUd6Tzdud0g3TXdmZmFlVEg2SHRfTkxsWHFtUUI0MGRnMHFpbkdLY0tSc3o1Ul9WWlZlU1UybWxxYzcyRnVpOUhyLU0xSUh0RVhCUXJacWJ2M0RxT2FBLjlXWTVUajU2QTBrOGxlUldLenNITHcyQ1JZdjBlV2RIREEydVdqbTlZa0U.ZJ6mMIOu-H35SzlH0NJ6A0kCDtDkjoUvxkLBRhIUxu8_xqCFw1MEOO3EiM-29Ej-YJTcSk_MFY5ZOi7d-6iaQcirSJh-hrP2WtRa1pqNumjs1k2ItpZ4ODbYEfY2xnV0xDyX7D0t7gK1-QKNANw1lyvIcDLMKLlW5JOmL9IQ0QohDkHuKnBdPESTPYr2xK1cIb6CgsW_YkT9mmIRrVx5yZHN2GGtxDksxe5GPgx_MnFj6AfnR3Bovt9eMVHzmwZB8Kozbt-QyF-0vmDGkn-JpmHoiEn98fjaWFSJFRtj0x4e5ZJfIzf2c-TUbuU6ASotsKldzXmjz0eNzzcNhROPPw");
    
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



function discoverSearch(coords) {
    const urlOrg = "https://discover.search.hereapi.com/v1/discover?q=";
    const url = urlOrg + 'campsite' + '&in=circle:' + coords + ';r=16093';

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyMzgzMzczOCwiZXhwIjoxNjIzOTIwMTM4LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLnlqSC1FQ1NlT1hXSUw2UU5fVm9BeXcub0tNVGZuVUxRRWVQU0xROTZvejN0MnRkZGkzM1J6N01BWWRfbjRrdXdtSlhyaG9nUXJIZDUwOTNPSTdGZjJPSUd6Tzdud0g3TXdmZmFlVEg2SHRfTkxsWHFtUUI0MGRnMHFpbkdLY0tSc3o1Ul9WWlZlU1UybWxxYzcyRnVpOUhyLU0xSUh0RVhCUXJacWJ2M0RxT2FBLjlXWTVUajU2QTBrOGxlUldLenNITHcyQ1JZdjBlV2RIREEydVdqbTlZa0U.ZJ6mMIOu-H35SzlH0NJ6A0kCDtDkjoUvxkLBRhIUxu8_xqCFw1MEOO3EiM-29Ej-YJTcSk_MFY5ZOi7d-6iaQcirSJh-hrP2WtRa1pqNumjs1k2ItpZ4ODbYEfY2xnV0xDyX7D0t7gK1-QKNANw1lyvIcDLMKLlW5JOmL9IQ0QohDkHuKnBdPESTPYr2xK1cIb6CgsW_YkT9mmIRrVx5yZHN2GGtxDksxe5GPgx_MnFj6AfnR3Bovt9eMVHzmwZB8Kozbt-QyF-0vmDGkn-JpmHoiEn98fjaWFSJFRtj0x4e5ZJfIzf2c-TUbuU6ASotsKldzXmjz0eNzzcNhROPPw");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(JSON.parse(xhr.responseText));
        const results = JSON.parse(xhr.responseText);
        addResults(results); //Run function to add results to the map
        }};
    xhr.send();
};

function getCoords(data) {
        let searchLatLng = []; //Lat & Lng of search stored in an array here
        const lat = data.items[0].position.lat;
        const lng = data.items[0].position.lng;
        searchLatLng.push(lat);
        searchLatLng.push(lng);
        const coords = searchLatLng.toString();
        discoverSearch(coords);
};


function addResults(results) {
    
};