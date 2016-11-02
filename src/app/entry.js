const d3 = require('d3');
const leaflet = require('leaflet');

document.addEventListener('DOMContentLoaded', () => {
    d3.select('#content')
        .append('h1')
        .text('Coming soon...');

    renderMap();
});

var map;

function renderMap() {
    setupMap();

    var schools = [
        {
            "nome": "ESCOLA MUNICIPAL IRMA TEREZINHA BATISTA - ANEXO I",
            "lat": -8.014138299999999,
            "lng": -34.8813573
        },
        {
            "nome": "ESCOLA MUNICIPAL ENGENHEIRO UMBERTO GONDIM",
            "lat": -8.0847,
            "lng": -34.884
        },
        {
            "nome": "ESCOLA MUNICIPAL POETA PAULO BANDEIRA DA CRUZ",
            "lat": -8.121,
            "lng": -34.955
        }
    ];

    renderPoints(schools);
}

function setupMap(){
    var content = d3.select("#content");

    content.append("div")
        .attr("id", "map")
        .attr("style", "height: 500px !important; width: 900px !important;");

    map = leaflet.map("map").setView([-8.079, -34.920], 12);

    leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);
}

function renderPoints(schools) {
    for (var index in schools){
        var school = schools[index];
        leaflet.marker([school["lat"], school["lng"]]).addTo(map)
            .bindPopup("<b>"+school["nome"]+"</b><br/>").openPopup();
    }
}
