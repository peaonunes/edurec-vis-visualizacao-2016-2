import './d3.parsets.scss';
import { actionCreators as parallelFiltersActions } from '../../state/actions/parallelFilters';
import { actionCreators as parallelSelectActions } from '../../state/actions/parallelSelect';

const d3v3 = require('./d3v3');
const setupParsetFunction = require('./d3.parsets');

setupParsetFunction(d3v3);

let headers = ["Internet", "Energia", "Esgoto", "Agua", "Lixo", "Funcionarios"];
let internetToValue = {
  "Com internet" : 1,
  "Sem internet" : 0
};
let energyToValue = {
  "Inexistente" : "inexistente",
  "Rede pública" : "rede_publica",
  "Gerador" : "gerador",
  "Outros" : "outros"
};
let sewerToValue = {
  "Inexistente" : "inexistente",
  "Rede pública" : "rede_publica",
  "Fossa" : "fossa",
  "Outros" : "outros"
};
let waterToValue = {
  "Inexistente" : "inexistente",
  "Rede pública" : "rede_publica",
  "Poço artesiano" : "poco_artesiano",
  "Cacimba" : "cacimba",
  "Fonte" : "fonte",
  "Outros" : "outros"
};
let trashToValue = {
  "Coleta periódica" : "coleta_periodica",
  "Recicla" : "recicla",
  "Queima" : "queima",
  "Enterra" : "enterra",
  "Outros" : "outros"
};
let employessToValue = {
  "Até 25" : 25,
  "Até 50" : 50,
  "Até 75" : 75,
  "Até 100" : 100,
  "Mais que 100" : Number.POSITIVE_INFINITY
};
let headersToField = {
  "Internet": ["acesso_internet",internetToValue],
  "Energia" : ["_energia",energyToValue],
  "Esgoto": ["_esgoto",sewerToValue],
  "Agua": ["_agua",waterToValue],
  "Lixo": ["_lixo",trashToValue],
  "Funcionarios": ["total_funcionarios",employessToValue]
};
let chart = d3v3.parsets();
let storeApp;

export function renderParallelSetsChart(store){
  storeApp = store;
  renderOptions('#options');
  function innerRender() {
    const {schools} = store.getState();

    renderParallelSet('#parallel', schools);
  }

  innerRender();
  store.subscribe(innerRender);
  d3.select(window).on('resize', innerRender);
}

function renderOptions(selector) {
  var options = d3.select(selector);

  options
    .selectAll("input")
    .data(headers)
    .enter()
    .append("label")
    .attr("for",function(d){ return d; })
    .text(function(d) { return d; })
    .append("input")
    .attr("checked", true)
    .attr("type", "checkbox")
    .attr("id", function(d,i) { return d; })
    .on("click", function(d, i){
      selectFeature(d);
    });

  const resetButton = options.selectAll('button').data([null]);

  resetButton
    .enter()
    .append('button')
    .text('Limpar seleção')
    .on('click', function() {
      storeApp.dispatch(parallelSelectActions.resetParallelSetSelection());
    });
}

function selectFeature(fieldName) {
  storeApp.dispatch(parallelFiltersActions.toggleParallelFilter(fieldName));
}

function renderParallelSet(selector, schools){
  const chartContainer = d3v3.select(selector);

  const width = chartContainer.node().getBoundingClientRect().width;

  chartContainer.select("svg").remove();

  var svg = chartContainer.append("svg")
    .attr("style", "background-color: #f5f5f5")
    .attr("width", width)
    .attr("height", chart.height());

  var filteredCategories = getFilteredCategories();

  chart.dimensions(filteredCategories);
  chart.width(width);

  const chartData = schools.reduce((list, school) => {
    list.push({
      Internet : extractInternet(school),
      Energia : extractEnergy(school),
      Esgoto : extractSewer(school),
      Agua : extractWater(school),
      Lixo : extractTrash(school),
      Funcionarios : extractEmpolyees(school),
    });

    return list;
  }, []);

  svg.datum(chartData).call(chart);

  svg.selectAll("path")
    .on("click", function(d) {
      changeViewsBasedOn(d);
    });
}

function changeViewsBasedOn(root) {
  var selectedDimensions = [];
  getSelectedDimensions(root, selectedDimensions);
  dispatchFiltersToViews(selectedDimensions);
}

function getSelectedDimensions(path, dimensions) {
  if (path != null && path.name != null){
    dimensions.push({
      dimension : path.dimension,
      value : path.name
    })
    getSelectedDimensions(path.parent, dimensions);
  }
}

function dispatchFiltersToViews(selectedDimensions) {
  selectedDimensions = selectedDimensions.map(function(element, index, originalSelection){
    var map = headersToField[element.dimension];
    var dimension = map[0];

    if(dimension == "acesso_internet") {
      return createFilter(dimension, originalSelection[index].value !== "Sem internet");
    }

    var value = map[1][element.value];

    if(dimension == "total_funcionarios"){
      if(value == Number.POSITIVE_INFINITY){
        return createFilter(dimension, Number.POSITIVE_INFINITY, 100);
      } else {
        return createFilter(dimension, value, value-25);
      }
    }

    if (value === 'outros') {
      const excludedFields = Object.keys(map[1])
        .map((key) => map[1][key])
        .filter((value) => value !== 'outros');

      return createFilter(dimension, excludedFields);
    }

    return createFilter(`${dimension}.${value}`);
  });

  // converter dimension e value para _dimension.value, acesso internet, Funcionarios pra total_funcionarios
  // de acordo com o valor de total_funcionarios extrair o range rangeFilterFactory(
  // createFilter para todo mundo com o fieldpath e arguentos necessarios (caso do total_funcionarios)
  // criar um novo objeto de fieldpath : retorno do createFilter
  // dispatch novo objeto
  storeApp.dispatch(parallelSelectActions.selectParallel(selectedDimensions));
}

function createFilter(fieldPath, ...args) {
  const rangeFilterFields = ['total_funcionarios'];
  const matchFilterFields = ['acesso_internet'];

  if (rangeFilterFields.indexOf(fieldPath) !== -1) {
    return rangeFilterFactory(fieldPath, ...args);
  } else if (matchFilterFields.indexOf(fieldPath) !== -1) {
    return matchFilterFactory(fieldPath, args[0]);
  } else if (args[0] !== undefined) {
    return exclusionFilterFactory(fieldPath, args[0]);
  } else {
    return booleanFilterFactory(fieldPath);
  }

  function matchFilterFactory(fieldPath, expectedValue) {
    console.log(`Creating match filter for '${fieldPath}': value: ${expectedValue}`);

    return (school) => {
      return school.getIn(fieldPath.split('.')) === expectedValue;
    }
  }

  function exclusionFilterFactory(fieldPath, valuesToExclude) {
    console.log(`Creating filter for '${fieldPath}' excluding values ${valuesToExclude}`);

    return (school) => {
      const schoolFieldValue = school.getIn(fieldPath.split('.'));

      return schoolFieldValue !== undefined &&
          valuesToExclude.length > 0 &&
          valuesToExclude.reduce((agg, value) => {
            return agg && !schoolFieldValue.get(value);
          }, true);
    };
  }

  function booleanFilterFactory(fieldPath) {
    console.log(`Creating boolean filter for '${fieldPath}'`);

    return (school) => {
      return !!school.getIn(fieldPath.split('.'));
    };
  }

  function rangeFilterFactory(fieldPath, upperBound, lowerBound = 0) {
    console.log(`Creating range filter for '${fieldPath}': [${lowerBound}, ${upperBound}]`);

    return (school) => {
      const schoolFieldValue = school.getIn(fieldPath.split('.'));

      return schoolFieldValue !== undefined &&
        schoolFieldValue >= lowerBound &&
        schoolFieldValue < upperBound;
    }
  }
}

function getFilteredCategories(){
  const {parallelFilters} = storeApp.getState();
  if (parallelFilters.size < 1){
    return headers;
  } else {
    var filteredList = [];
    for (var i = 0; i < headers.length; i++) {
      var fieldName = headers[i];
      if(!parallelFilters.contains(fieldName))
        filteredList.push(fieldName);
    }
    return filteredList;
  }
}

function extractFood(school) {
  const value = school.get('alimentacao_escolar');
  if (value != 1)
    return "Não possui"
  else
    return "Possui"
}

function extractEmpolyees(school) {
  const value = school.get('total_funcionarios');
  if (value < 25)
    return "Até 25";
  else if (value < 50)
    return "Até 50";
  else if (value < 75)
    return "Até 75";
  else if (value < 100)
    return "Até 100";
  else
    return "Mais que 100";
}

function extractInternet(school) {
  const value = school.get('acesso_internet');
  if(value)
    return "Com internet";
  else
    return "Sem internet";
}

function extractEnergy(school) {
  const value = school.get('_energia');

  if (value.get('inexistente'))
    return "Inexistente";
  else if (value.get('rede_publica'))
    return "Rede pública";
  else if (value.get('gerador'))
    return "Gerador";
  else
    return "Outros";
}

function extractWater(school) {
  const value = school.get('_agua');
  if (value.get('inexistente'))
    return "Inexistente";
  else if (value.get('rede_publica'))
    return "Rede pública";
  else if (value.get('poco_artesiano'))
    return "Poço artesiano";
  else if (value.get('cacimba'))
    return "Cacimba";
  else if (value.get('fonte'))
    return "Fonte";
  else
    return "Outros";
}

function extractSewer(school) {
  const value = school.get('_esgoto');

  if (value.get('inexistente'))
    return "Inexistente";
  else if (value.get('rede_publica'))
    return "Rede pública";
  else if (value.get('fossa'))
    return "Fossa";
  else
    return "Outros";
}

function extractTrash(school) {
  const value = school.get('_lixo');

  if (value.get('recicla'))
    return "Recicla";
  else if (value.get('coleta_periodica'))
    return "Coleta periódica";
  else if (value.get('queima'))
    return "Queima";
  else if (value.get('enterra'))
    return "Enterra";
  else
    return "Outros";
}
