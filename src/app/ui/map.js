const leaflet = require('leaflet');
const d3 = require('d3');
import { schools as schoolsSelector } from '../state/selectors';
import { actionCreators as schoolSelectionActions } from '../state/actions/schoolSelection';

let map;
let markers = {};

export function renderMap(store) {
  function innerRender() {
    const schools = schoolsSelector(store.getState());

    renderMarkers(store, schools);
  }

  setupMap();

  innerRender();
  store.subscribe(innerRender);
}

function setupMap(){
  const mapContainer = d3.select("#map");
  const {width, height} = mapContainer.node().getBoundingClientRect();

  const mapGroup = mapContainer
    .selectAll('#map-content')
    .data([null]);

  mapGroup
    .enter()
    .append('div')
    .attr('id', 'map-content')
    .merge(mapGroup)
    .attr("style", `height: ${height}px !important; width: ${width}px !important;`);

  map = leaflet.map("map").setView([-8.079, -34.920], 12);

  leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(map);
}

function renderMarkers(store, schools) {
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
          radius: 10,
          dataID: schoolId
        })
        .addTo(map);

      markers[schoolId] = marker;

      marker.on("click", function(d, a) {
        store.dispatch(schoolSelectionActions.deselectSchool());
        store.dispatch(schoolSelectionActions.selectSchool(schools.get(d.target.options.dataID)));
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
