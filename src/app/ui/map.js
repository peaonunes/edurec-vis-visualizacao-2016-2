const leaflet = require('leaflet');
const d3 = require('d3');
import { schools as schoolsSelector } from '../state/selectors';
import { actionCreators as schoolSelectionActions } from '../state/actions/schoolSelection';

let map;
let markers = {};
let qualitativeScale = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"];
let rankScale = ["#d7191c","#fdae61",'#a6d96a',"#1a9641"];
let aguaLegend = [
    {key: "Inexistente", color: qualitativeScale[0]},
    {key: "Rede pública" , color: qualitativeScale[1]},
    {key: "Poço artesiano" , color: qualitativeScale[2]},
    {key: "Cacimba" , color: qualitativeScale[3]},
    {key: "Fonte" , color: qualitativeScale[4]},
    {key: "Outros" , color: qualitativeScale[5]}
    ];
let energiaLegend = [
    {key: "Inexistente", color: qualitativeScale[0]},
    {key: "Rede pública" , color: qualitativeScale[1]},
    {key: "Gerador" , color: qualitativeScale[2]},
    {key: "Outros" , color: qualitativeScale[3]}
];
let esgotoLegend = [
    {key: "Inexistente", color: qualitativeScale[0]},
    {key: "Rede pública" , color: qualitativeScale[1]},
    {key: "Fossa" , color: qualitativeScale[2]},
    {key: "Outros" , color: qualitativeScale[3]}
];
let notaLegend = [
    {key: "Muito Ruim", color: rankScale[0]},
    {key: "Ruim" , color: rankScale[1]},
    {key: "Bom" , color: rankScale[2]},
    {key: "Muito Bom" , color: rankScale[3]}
]
let legendMap = {
    "agua" : aguaLegend,
    "nota" : notaLegend,
    "energia" : energiaLegend,
    "esgoto" : esgotoLegend
};

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

function renderLabel(colouringCriteria) {
    d3.select("div.info").filter(".legend").remove();

    var legend = leaflet.control({position: 'bottomright'});
    console.log(colouringCriteria);
    legend.onAdd = function (map) {

        var div = leaflet.DomUtil.create('div', 'info legend');
        var legend = legendMap[colouringCriteria];

        for (var i = 0; i < legend.length; i++) {
          var item = legend[i];
          var label = item.key;
          var color = item.color;
          div.innerHTML += '<div> <i style="background:' + color + '"></i> <span>' + label +'</span> </div>';
        }

        return div;
    };

    legend.addTo(map);
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

  renderLabel(colouringCriteria);
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

    if (rank < 25)
        return rankScale[0];
    else if (rank >= 25 && rank < 50)
        return rankScale[1];
    else if (rank >= 50 && rank < 75)
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
