const leaflet = require('leaflet');
const d3 = require('d3');
import { schools as schoolsSelector } from '../state/selectors';

export var map;

export function renderMap(store) {
    function innerRender() {
        const schools = schoolsSelector(store.getState()).toJS();

        renderMarkers(schools);
    }

    setupMap();

    innerRender();
    store.subscribe(innerRender);
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

var markers = {};

function renderMarkers(schools) {
    if (!(Object.keys(markers).length === 0))
        filterOldMarks(schools);

    Object.keys(schools).forEach((schoolId) => {
        const school = schools[schoolId];
        const {lat, lng} = school.endereco.geometry.location;

        var marker = leaflet.marker([lat, lng]).addTo(map)
          .bindPopup(moreDetails(school)).openPopup();

        markers[school._id] = marker;

        marker.on("mouseover", function (e) {
            this.openPopup();
        });
        marker.on("mouseout", function (e) {
            this.closePopup();
        });
    });
}

function filterOldMarks(schools){
    Object.keys(markers).forEach((markerId) => {
        if(!schools.hasOwnProperty(markerId))
            map.removeLayer(markers[markerId]);
    });
}

function moreDetails(school){
    var st = detailsLayout.replace("#rank", school.rank);
    st = st.replace("#name", school.nome);
    st = st.replace("#address", school.endereco.address);
    st = st.replace("#email", school.email);
    return st;
}

/*
<div>
    <div>
        <h5>#rank</h5>
    </div>
    <div>
        <h5>#name</h5></b><br/>
        <p>#address</p></b><br/>
        <p>#email</p></b><br/>
    </div>
</div>
*/
var detailsLayout = "<div><div><h2>#rank%</h2></div><div><h3>#name</h3><p>#address</p><p>#email</p></div></div>";
