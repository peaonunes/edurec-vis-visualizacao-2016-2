const leaflet = require('leaflet');
const d3 = require('d3');
import { schools as schoolsSelector } from '../state/selectors';

let map;
let markers = {};

export function renderMap(store) {
  function innerRender() {
    const schools = schoolsSelector(store.getState());

    renderMarkers(schools);
  }

  setupMap();

  innerRender();
  store.subscribe(innerRender);
}

function setupMap(){
  const content = d3.select("#content");

  const mapGroup = content
    .selectAll('#map')
    .data([null]);

  mapGroup
    .enter()
    .append('div')
    .attr('id', 'map')
    .merge(mapGroup)
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

function renderMarkers(schools) {
  clearMapMarkers(schools);

  schools.keySeq().forEach((schoolId) => {
    const school = schools.get(schoolId);
    const schoolLocation = school.getIn(['endereco', 'geometry', 'location']);

    const lat = schoolLocation.get('lat');
    const lng = schoolLocation.get('lng');

    if (!markers[schoolId]) {
      var marker = leaflet
        .circleMarker([lat, lng], {
          color: '#black',
          weight: 3,
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 10
        })
        .addTo(map)
        .bindPopup(moreDetails(school));

      markers[schoolId] = marker;

      marker.on("mouseover", function() {
        this.openPopup();
      });

      marker.on("mouseout", function() {
        this.closePopup();
      });
    } else {
      map.addLayer(markers[schoolId]);
    }
  });
}

function clearMapMarkers(){
  Object.keys(markers).forEach((markerId) => {
    map.removeLayer(markers[markerId]);
  });
}

function moreDetails(school){
  const rank = school.get('rank');
  const nome = school.get('nome');
  const endereco = school.getIn([ 'endereco', 'address' ]);
  const email = school.get('email');

  const layout =
`<div>
  <div>
    <h5>${rank || 'Sem nota'}</h5>
  </div>
  <div>
    <h5>${nome}</h5>
    <p>${endereco}</p>
    <p>${email}</p>
  </div>
</div>`;

  return layout;
}
