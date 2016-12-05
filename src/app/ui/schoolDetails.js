const d3 = require('d3');

export function showSchoolDetails(store) {
  function render() {
    const selectedSchool = store.getState().selectedSchool;
    if(selectedSchool)
      renderSchoolDetails(selectedSchool);
  }

  render();
  store.subscribe(render);
}

function renderSchoolDetails(school) {
  var schoolDetails = d3.select("#mapDetails");

  schoolDetails.style("background-color", "#f5f5f5");
  schoolDetails.style("font-family", "sans-serif");

  schoolDetails.selectAll("*").remove();

  schoolDetails.append("div").html(moreDetails(school));

  var students = school.get('students');
  if(students)
    renderStudentsDetails(students);

  renderIdeb(school);

  schoolDetails.style("border", "1px solid black");
}

function moreDetails(school){
  const rank = school.get('rank');
  const nome = school.get('nome');
  const endereco = school.getIn([ 'endereco', 'address' ]);
  const email = school.get('email');
  const quantidade_salas_existentes = school.get('quantidade_salas_existentes');
  const comp_alunos = school.get('equipamentos_comp_alunos');
  const acesso_internet = (school.get('acesso_internet') == true ? 'Possui' : 'Não possui');
  const total_funcionarios = school.get('total_funcionarios');

  const layout =
`<div>
  <div>
    <table style="padding: 10px">
      <tr style="width: 100%">
        <td style="text-align: left; width : 80%"><strong>${nome}</strong></td>
        <td style="text-align: center; width : 20%">
          <div style="background-color: #fafafa; border: 5px solid #e0e0e0" title="Razão entre a quantidade de alunos aprovados e a quantidade total de alunos da escola">
            <h1 style="color: #616161; padding: 5px">${rank || 'Sem nota'}</h1>
          </div>
        </td>
      </tr>
    </table>
  </div>
  <div style="padding: 10px; font-size: 0.875em;">
    <p><strong>Endereço: </strong>${endereco}</p>
    <p><strong>Contato: </strong>${email}</p>
    </br>
    <p>Quantidade de salas existentes: ${quantidade_salas_existentes || '0'}</p>
    <p>Quantida de computadores para alunos: ${comp_alunos | '0'}</p>
    <p>${acesso_internet} acesso a internet</p>
    <p>Quantidade de funcionários: ${total_funcionarios | '0'}</p>
  </div>
</div>`;

  return layout;
}

function renderPieChart(students) {
  var schoolDetails = d3.select("#mapDetails");

  var width = 400;
  var height = 250;

  var svg = schoolDetails.append("svg")
    .attr("id", "studentDetailsPiechart")
    .attr("width", width)
    .attr("height", height);

  svg.style("background-color", "#fafafa");
  svg.style("margin", "auto");
  svg.style("display", "block");

  var g = svg.append("g")
    .attr("transform", "translate(0," + height + ") scale(1,-1)");

  schoolDetails.append("br");

  g.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "#e0e0e0")
  .style("stroke-width", "5px")
  .style("fill", "none");

  var studentTypeQt = {};

  for(var i = 0; i < students.size; i++) {
    var type = students.get(i).get("situacao");

    if(studentTypeQt.hasOwnProperty(type)) {
      var value = studentTypeQt[type];
      studentTypeQt[type] = value + 1;
    } else if(type == "TR" || type == "TA" || type == "RNTA" || type == "RNTR" || type == "RNTS") {
      studentTypeQt["FR"] = (studentTypeQt.hasOwnProperty("FR") ? studentTypeQt["FR"] + 1 : 1);
    } else if(type == "DERN") {
      studentTypeQt["D"] = (studentTypeQt.hasOwnProperty("D") ? studentTypeQt["D"] + 1 : 1);
    } else {
      studentTypeQt[type] = 1;
    }
  }

  var data = [];
  var keys = [];
  var situations = {"RN": "Reprovado por nota", "AP": "Aprovado", "RT": "Retido", "D": "Desistiu",
                    "R": "Retido", "FR": "Fora da rede", "MO": "Remanejado", "NC": "Nunca compareceu"};

  Object.keys(studentTypeQt).forEach((key) => {
    data.push(studentTypeQt[key]);
    keys.push(key);
  });

  //piechat
  var colorScale = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"];

  var outer = 90;

  var arc = d3.arc().innerRadius(0).outerRadius(outer);

  var pie = d3.pie().value(function(d) {return d;});

  var selection = d3.select("#studentDetailsPiechart").select("g").selectAll("path").data(pie(data));

  //append graph title
  svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(80, 30)")
  .style("font-size", "1em")
  .style("fill", "#212121")
  .text("Situação Anual dos Alunos - 2014");

  //append piechart
  selection.enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", function(d,i) {
    return colorScale[i];
  })
  .attr("transform", "translate(" + 110 + "," + (outer + 20) + ")");

  //append labels
  for(var i = 0; i < keys.length; i++) {
  //Object.keys(studentTypeQt).forEach((key) => {
    g.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .attr("transform", "translate(" + 215 + ", " + (((i+1)*20)) + ")")
    .attr("fill", colorScale[i]);

    schoolDetails.select("svg").append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", "translate(" + 230 + ", " + (height - (i+1)*20) + ")")
    .text(function(d) {
      if(situations.hasOwnProperty(keys[i]))
        return situations[keys[i]] + " - " + studentTypeQt[keys[i]];
      else
        return keys[i] + " - " + studentTypeQt[keys[i]];
    })
    .style("font-size", "0.875em")
    .style("fill", "#424242");
  };
}

function renderIdeb(school) {
  if(!school.has("ideb"))
    return;

  var schoolDetails = d3.select("#mapDetails");

  var width = 400;
  var height = 250;

  var svg = schoolDetails.append("svg")
    .attr("id", "studentDetailsIdeb")
    .attr("width", width)
    .attr("height", height);

  svg.style("background-color", "#fafafa");
  svg.style("margin", "auto");
  svg.style("display", "block");

  var g = svg.append("g")
    .attr("transform", "translate(0," + height + ") scale(1,-1)");

    schoolDetails.append("br");

  g.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "#e0e0e0")
  .style("stroke-width", "5px")
  .style("fill", "none");

  var ideb = school.get("ideb");
  var idebCidade = school.get("idebCidade");

  var maxIdebValue = 10;

  var yScale = d3.scaleLinear().range([0,150]).domain([0, maxIdebValue]);

  var boxWidth = 30;

  var originY = 30;
  var originX = 100;
  var margin = 50;
  var scaleLine = 10;
  var labelLine = 20;

  //render x axis line
  g.append("line")
  .attr("x1", originX)
  .attr("y1", originY)
  .attr("x2", originX + 210)
  .attr("y2", originY)
  .attr("stroke", "black")
  .attr("stroke-width", "1px");

  //append y axis line
  g.append("line")
  .attr("x1", originX)
  .attr("y1", originY)
  .attr("x2", originX)
  .attr("y2", 170)
  .attr("stroke", "black")
  .attr("stroke-width", "1px");

  //append school ideb
  g.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", boxWidth)
  .attr("height", yScale(ideb))
  .attr("transform", "translate(" + (originX + margin) + "," +  originY + ")")
  .attr("fill", "MediumSeaGreen")
  .attr("stroke", "black")
  .attr("stroke-width", "1px");

  //append mark on scale school
  g.append("line")
  .attr("x1", originX - scaleLine / 2)
  .attr("y1", originY + yScale(ideb))
  .attr("x2", originX + scaleLine / 2)
  .attr("y2", originY + yScale(ideb))
  .attr("stroke", "black")
  .attr("stroke-width", "1px");

  //append number mark on scale school
  svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(" + (originX - labelLine*1.5) + "," + (height - originY - yScale(ideb) + 5) + ")")
  .text(ideb.toFixed(1))
  .style("fill", "#212121");

  //appending city ideb
  g.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", boxWidth)
  .attr("height", yScale(idebCidade))
  .attr("transform", "translate(" + (originX + 2*margin + boxWidth) + "," +  originY + ")")
  .attr("fill", "LightSeaGreen")
  .attr("stroke", "black")
  .attr("stroke-width", "1px");

  //append mark on scale city
  g.append("line")
  .attr("x1", originX - scaleLine / 2)
  .attr("y1", originY + yScale(idebCidade))
  .attr("x2", originX + scaleLine / 2)
  .attr("y2", originY + yScale(idebCidade))
  .attr("stroke", "#424242")
  .attr("stroke-width", "1px");

  //append number mark on scale city
  svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(" + (originX - labelLine*1.5) + "," + (height - originY - yScale(idebCidade) + 5) + ")")
  .text(idebCidade.toFixed(1))
  .style("fill", "#212121");

  //append school name and city under
  svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(" + (originX + margin - 5) + "," + (height - originY + 15) + ")")
  .text("Escola")
  .style("fill", "#424242")
  .style("font-size", "0.875em");

  svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(" + (originX + 2*margin + boxWidth - 30) + "," + (height - originY + 15) + ")")
  .text("Média do município")
  .style("fill", "#424242")
  .style("font-size", "0.875em");

  //graph title
  svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(110, 30)")
  .style("font-size", "1em")
  .style("fill", "#212121")
  .text("Avaliação no IDEB - 2013");
}

function renderStudentsDetails(students) {
  renderPieChart(students);
}
