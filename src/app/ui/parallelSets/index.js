import './d3.parsets.scss';

const d3v3 = require('./d3v3');
const setupParsetFunction = require('./d3.parsets');
// require('./d3-workaround');

setupParsetFunction(d3v3);

let chart = d3v3.parsets();

export function renderParallelSetsChart(store){
    function innerRender() {
        const {schools} = store.getState();

        renderParallelSet('#parallelSets', schools);
    }

    innerRender();
    store.subscribe(innerRender);
}

function renderParallelSet(selector, schools){
    d3v3.select(selector).select("svg").remove();

    var svg = d3v3.select(selector).append("svg")
      .attr("width", chart.width())
      .attr("height", chart.height());

    // d3.select(selector).select("svg").remove();
    //
    // var vis = d3.select("#content").append("svg")
    //   .attr("width", chart.width())
    //   .attr("height", chart.height());

    var filteredCategories = getFilteredCategories();

    chart.dimensions(filteredCategories);

    const chartData = schools.reduce((list, school) => {
        list.push({
            Agua: extractAgua(school),
            Energia: extractEnergia(school),
            Lixo: extractLixo(school),
            Esgoto: extractEsgoto(school),
        });

        return list;
    }, []);

    console.log(chartData);

    svg.datum(chartData).call(chart);

    // d3.json('./escolas2015.json', (schools) => {
    //     var entries = schools.entries;
    //
    //     var dataset = [];
    //     Object.keys(entries).forEach((id) => {
    //         var entry = entries[id];
    //         var element = {
    //             Merenda : extractMerenda(entry.alimentacao_escolar),
    //             Internet : extractInternet(entry.acesso_internet),
    //             Energia : extractEnergia(entry.energia),
    //             Esgoto : extractEsgoto(entry.esgoto),
    //             Agua : extractAgua(entry.agua),
    //             Lixo : extractLixo(entry.lixo),
    //             Funcionarios : extractFuncionarios(entry.total_funcionarios)
    //         };
    //         dataset.push(element);
    //     });
    //
    //     vis.datum(dataset).call(chart);
    // });
}

function getFilteredCategories(){
    return ['Agua', 'Lixo', 'Esgoto', 'Energia'];
}

function extractEnergia(school) {
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

function extractAgua(school) {
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

function extractEsgoto(school) {
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

function extractLixo(school) {
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