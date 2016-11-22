d3.select("body").append("h1").text("Podemos fazer isso para os dados categoricos de agua, esgoto etc.");

let headers = ["Internet", "Energia", "Esgoto", "Agua", "Lixo", "Merenda", "Funcionarios"];
let chart = d3.parsets();

function setUp() {
    renderCheckboxes();
    renderParallel();
}

function renderCheckboxes() {
    d3.select("#parallelSets")
        .select("#options")
        .attr("style", "width: "+chart.width()+"; height: 30px; border-left-style: solid; background-color: #333; padding-top:10px");

    d3.select("#parallelSets")
        .select("#options")
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
            .attr("onClick", "renderParallel()");
}

function renderParallel() {

    d3.select("#content").select("svg").remove();

    var vis = d3.select("#content").append("svg")
        .attr("width", chart.width())
        .attr("height", chart.height());

    var filteredCategories = getFilteredCategories();

    chart.dimensions(filteredCategories);

    d3.json('./escolas2015.json', (schools) => {
        var entries = schools.entries;

        var dataset = [];
        Object.keys(entries).forEach((id) => {
            var entry = entries[id];
            var element = {
                Merenda : extractMerenda(entry.alimentacao_escolar),
                Internet : extractInternet(entry.acesso_internet),
                Energia : extractEnergia(entry.energia),
                Esgoto : extractEsgoto(entry.esgoto),
                Agua : extractAgua(entry.agua),
                Lixo : extractLixo(entry.lixo),
                Funcionarios : extractFuncionarios(entry.total_funcionarios)
            };
            dataset.push(element);
        });

        vis.datum(dataset).call(chart);
    });
}

function getFilteredCategories(){
    var filtered = [];
    for(var i = 0 ; i < headers.length ; i++){
        var checkbox = document.getElementById(headers[i]);
        if (checkbox.checked)
            filtered.push(headers[i]);
    }
    return filtered;
}

function extractMerenda(value) {
    if (value != 1)
        return "Não possui"
    else
        return "Possui"
}

function extractFuncionarios(value) {
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

function extractInternet(value) {
    if(value != 1)
        return "Sem internet";
    else
        return "Com internet";
}

function extractEnergia(value) {
    if (value.inexistente)
        return "Inexistente";
    else if (value.rede_publica)
        return "Rede pública";
    else if (value.gerador)
        return "Gerador";
    else
        return "Outros";
}

function extractAgua(value) {
    if (value.inexistente)
        return "Inexistente";
    else if (value.rede_publica)
        return "Rede pública";
    else if (value.poco_artesiano)
        return "Poço artesiano";
    else if (value.cacimba)
        return "Cacimba";
    else if (value.fonte)
        return "Fonte";
    else
        return "Outros";
}

function extractEsgoto(value) {
    if (value.inexistente)
        return "Inexistente";
    else if (value.rede_publica)
        return "Rede pública";
    else if (value.fossa)
        return "Fossa";
    else
        return "Outros";
}

function extractLixo(value) {
    if (value.recicla)
        return "Recicla";
    else if (value.coleta_periodica)
        return "Coleta periódica";
    else if (value.queima)
        return "Queima";
    else if (value.enterra)
        return "Enterra";
    else
        return "Outros";
}

setUp();
