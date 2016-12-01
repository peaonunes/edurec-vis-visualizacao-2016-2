import './d3.parsets.scss';
import { actionCreators as parallelFiltersActions } from '../../state/actions/parallelFilters';

const d3v3 = require('./d3v3');
const setupParsetFunction = require('./d3.parsets');

setupParsetFunction(d3v3);

let headers = ["Internet", "Energia", "Esgoto", "Agua", "Lixo", "Merenda", "Funcionarios"];
let chart = d3v3.parsets();
let storeApp;
let width = screen.width*0.6;

export function renderParallelSetsChart(store){
    storeApp = store;
    renderOptions('#options');
    function innerRender() {
        const {schools} = store.getState();

        renderParallelSet('#parallel', schools);
    }

    innerRender();
    store.subscribe(innerRender);
}

function renderOptions(selector) {
    var options = d3.select(selector);
    options
    .attr("style", "width: "+width+"px; height: 30px; border-left-style: solid; background-color: #616161; padding-top:10px")
    .selectAll("input")
    .data(headers)
    .enter()
    .append("label")
        .attr("style", "color: white; padding-left: 20px;")
        .attr("for",function(d){ return d; })
        .text(function(d) { return d; })
    .append("input")
        .attr("checked", true)
        .attr("type", "checkbox")
        .attr("id", function(d,i) { return d; })
        .on("click", function(d, i){
            selectFeature(d);
    });
}

function selectFeature(fieldName) {
    storeApp.dispatch(parallelFiltersActions.toggleParallelFilter(fieldName));
}

function renderParallelSet(selector, schools){
    d3v3.select(selector).select("svg").remove();

    var svg = d3v3.select(selector).append("svg")
      .attr("style", "background-color: #f5f5f5")
      .attr("width", width)
      .attr("height", chart.height());

    var filteredCategories = getFilteredCategories();

    chart.dimensions(filteredCategories);
    chart.width(width);

    const chartData = schools.reduce((list, school) => {
        list.push({
            Merenda : extractFood(school),
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
    // TODO: Create the filter and update the state.
    console.log(selectedDimensions);
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
        console.log(filteredList);
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
    if(value != 1)
        return "Sem internet";
    else
        return "Com internet";
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
