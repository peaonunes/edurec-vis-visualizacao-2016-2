const leaflet = require('leaflet');
const d3 = require('d3');
import { schools as schoolsSelector } from '../state/selectors';
import { actionCreators as schoolSelectionActions } from '../state/actions/schoolSelection';

let map;
let markers = {};
let qualitativeScale = ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"];
let rankScale = ["#c7e9c0","#a1d99b","#74c476",'#31a354',"#006d2c"];

export function renderMap(store) {
  function innerRender() {
    const state = store.getState();

    const schools = schoolsSelector(state);
    const colouringCriteria = state.colorFilter;

    renderMarkers(store, schools, colouringCriteria);
  }

  setupMap();

  innerRender();
  store.subscribe(innerRender);
}

function setupMap(){
  const mapContainer = d3.select("#map");
  const {width, height} = mapContainer.node().getBoundingClientRect();

  mapContainer.style("border", "1px solid black");

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

function renderMarkers(store, schools, colouringCriteria) {
  clearMapMarkers(schools);

  schools.keySeq().forEach((schoolId) => {
    const school = schools.get(schoolId);
    const schoolLocation = school.getIn(['endereco', 'geometry', 'location']);

    const lat = schoolLocation.get('lat');
    const lng = schoolLocation.get('lng');

    if (!markers[schoolId]) {
      var marker = leaflet
        .circleMarker([lat, lng], {
          color: 'white',
          weight: 0.5,
          fillColor: getColor(colouringCriteria, school),
          fillOpacity: 0.75,
          radius: 7.5,
          dataID: schoolId
        })
        .addTo(map);

      markers[schoolId] = marker;

      marker.on("click", function(d, a) {
        store.dispatch(schoolSelectionActions.deselectSchool());
        store.dispatch(schoolSelectionActions.selectSchool(schools.get(d.target.options.dataID)));
      });
    } else {
      markers[schoolId]
        .setStyle({
          fillColor: getColor(colouringCriteria, school),
        })
        .bringToFront();
    }
  });
}

function clearMapMarkers(){
  Object.keys(markers).forEach((markerId) => {
    markers[markerId]
      .setStyle({
        fillColor: '#bdbdbd',
      })
      .bringToBack();
  });
}

function getColor(type, school) {
    if (type === "default" || type == null)
        return "#f03";
    else {
        if (type === "agua")
            return extractWater(school);
        else if (type === "energia")
            return extractEnergy(school);
        else if (type === "esgoto")
            return extractSewer(school);
        else if (type === "tipo")
            return extractType(school);
        else if (type === "nota")
            return extractRank(school);
    }
}

function extractRank(school) {
    const rank = school.get("rank");

    if (rank < 2.5)
        return rankScale[0];
    else if (rank >= 2.5 && rank < 5.0)
        return rankScale[1];
    else if (rank >= 5.0 && rank < 7.5)
        return rankScale[2];
    else
        return rankScale[3];
}

function extractType(school) {
    const value = school.get("tipo");
    const typeScale = {
        "creche" : qualitativeScale[0],
        "ef" : qualitativeScale[1],
        "em" : qualitativeScale[2],
        "ef&em" : qualitativeScale[3]
    };
    return typeScale[value];
}

function extractEnergy(school) {
    const value = school.get('_energia');

    if (value.get('inexistente'))
        return qualitativeScale[0];
    else if (value.get('rede_publica'))
        return qualitativeScale[1];
    else if (value.get('gerador'))
        return qualitativeScale[2];
    else
        return qualitativeScale[3];
}

function extractWater(school) {
    const value = school.get('_agua');
    if (value.get('inexistente'))
        return qualitativeScale[0];
    else if (value.get('rede_publica'))
        return qualitativeScale[1];
    else if (value.get('poco_artesiano'))
        return qualitativeScale[2];
    else if (value.get('cacimba'))
        return qualitativeScale[3];
    else if (value.get('fonte'))
        return qualitativeScale[4];
    else
        return qualitativeScale[5];
}

function extractSewer(school) {
    const value = school.get('_esgoto');

    if (value.get('inexistente'))
        return qualitativeScale[0];
    else if (value.get('rede_publica'))
        return qualitativeScale[1];
    else if (value.get('fossa'))
        return qualitativeScale[2];
    else
        return qualitativeScale[3];
}
