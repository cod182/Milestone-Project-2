const apiKey = 'cAo6Cjf5wlcux7gJjPODw_tNNN5lglP7Ayka-t9R7J4'; //Here Maps Api Key
const restApi = 'pu2_DtcuggeDNRL5hMMI3C8IVP0Sd5fx9AqefGKcT4c'; //Here Maps REST Api Key
const appId = 'viVz45yDq8PgWQBJT5fE'; //Here Maps App ID
const oAuth = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyMzMyNzc2OSwiZXhwIjoxNjIzNDE0MTY5LCJraWQiOiJqMSJ9'; ///Here Maps Token (only lasts 24hrs)

// /**
//  * @param  {H.Map} map      A HERE Map instance within the application
//  */

// function getData(){

//     var url = "https://discover.search.hereapi.com/v1/discover?in=circle:${search};r=1000&q=campsites";

//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url);
    
//     xhr.setRequestHeader("Accept", "application/json");
//     xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJ2aVZ6NDV5RHE4UGdXUUJKVDVmRSIsImlhdCI6MTYyMzMyNzc2OSwiZXhwIjoxNjIzNDE0MTY5LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLm1oSDVhdmJFLXUyNnNjX0lwcURHbncuOWRYQTFYT3VnRVFvRFRYUkJXWWtaM1M5a0xwRDJ2ZmY0Q2xBalRDajRQYU5JT25LZTFyYUcwNkFxUmk4MHJqMWhGNVAtUXpmZEhQSVVEN3NiVUNYM3RNNlRkS1pOcHZLdGtWVXowMGdqREdVS2NHUFhDV1hENy14ekw4WTVpMnpVOFM5bUY4bmxEblBKdGVlak1ZTXBBLkkwTGpDXzBDUzVTTWlONlB2QkRIOUlKMkcwX1hudHBZQjFRbGd2VzM4cDQ.rfwasZ12LIrUTFcBRCoLdMTpPHYF9WpDaSVIe8LyBFNpKrSz0AWQimyE1TpuTCdx5Yw7hUNX1_57X1Rzr6iwncFsUFYWX3rCoXWa6socC8duMqCLI8fBAGG4aUf9CIF4HpqUkG9JoeShwKE3c02j1MBGFYlEERyUTjHed6_VgD5xnfgp98JvsHBkA9lFaf9Wcu5rOlLB3ySr3Ti0KKdK7F157ACb6XbiWcQt-SMr-Qp8lcyo5aOv8zIjiaIJGrOfSFMpUxmUlGchhHsAkS1n6iX4JEJd-15qBh7-vke_mbx37ZiQlE11IZ7e1WriZz1f6rizZ5OSA86gawLFQ5wBtA");
    
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//         console.log(xhr.status);
//         console.log(xhr.responseText);
//         }};
    
//     xhr.send();
// };

// function fetchSearchResults(event){
//     var result = document.getElementById('search-results');
//     result.innerHTML = "";

//     getData(event, function(data){
//         data = data.results;
//         var tableHeaders = getTableHeaders(data[0]);
        
//         data.forEach(function(item) {
//             var dataRow = [];

//             Object.keys(item).forEach(function(key){
//                 var rowData = item[key].toString();
//                 var truncatedData = rowData.substring(0,15);
//                 dataRow.push(`<td>${truncatedData}</td>`);
//             })
//             tableRows.push(`<tr>${dataRow}</tr>`);
//         });

//         result.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");
//     });
// }

 

  


  



//When enter is pressed, the search box shrinks and the map us added
const searchBox = document.getElementById('search-box');
const greetSec = document.getElementById('greeting-box');
const mapContain = document.getElementById('map');
let firstTime = true;
searchBox.addEventListener("keyup", function(event) { //Event listener to key up event
    if (event.key === "Enter") { // If key up is Enter then...
        searchBox.classList.remove('search-box-before'); //Remove class from searchBox
        searchBox.classList.add('search-box-after'); //Add class to searchBox
        greetSec.classList.remove('greeting-box-before'); //Remove class from greetSex
        greetSec.classList.add('greeting-box-after'); //Add class to greetSec
        mapContain.classList.add('map'); //Add class to mapContain
        if (firstTime) { // If this this the first run, run the below code
            addMapEl(); //Run function to add the map
            addResults(); //Run function to add results to the map
            firstTime = false;
        }
    }
});

//Initilisting the Here Map in section map
function addMapEl() {
    const platform = new H.service.Platform({ //New instance of Here Map
        apikey: apiKey //setting API key
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

// When called adds the class to the search results section
function addResults() {
    const resultsContain = document.getElementById('search-results');
    resultsContain.classList.add('search-results-after');
};