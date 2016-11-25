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

  schoolDetails.selectAll("*").remove();

  schoolDetails.append("div").html(moreDetails(school));

  var students = school.get('students');
  if(students)
    renderStudentsDetails(students);

  //renderStudentsDetailsOverTime(school);
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
    <h5>${rank || 'Sem nota'}</h5>
  </div>
  <div>
    <h5>${nome}</h5>
    <p><strong>Endereço: </strong>${endereco}</p>
    <p><strong>Contato: </strong>${email}</p>
    <p>Quantidade de salas existentes: ${quantidade_salas_existentes || '0'}</p>
    <p>Quantida de computadores para alunos: ${comp_alunos | '0'}</p>
    <p>${acesso_internet} acesso a internet</p>
    <p>Quantidade de funcionários: ${total_funcionarios | '0'}</p>
  </div>
</div>`;

  return layout;
}

function renderStudentsDetails(students) {
  var schoolDetails = d3.select("#mapDetails");

  var width = 400;
  var height = 250;

  var g = schoolDetails.append("svg")
    .attr("id", "studentDetailsPiechart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0," + height + ") scale(1,-1)");

  g.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "black")
  .style("stroke-width", 1)
  .style("fill", "none");

  var studentTypeQt = {};

  for(var i = 0; i < students.size; i++) {
    var type = students.get(i).get("situacao");

    if(studentTypeQt.hasOwnProperty(type)) {
      var value = studentTypeQt[type];
      studentTypeQt[type] = value + 1;
    } else {
      studentTypeQt[type] = 1;
    }
  }

  var data = [];
  var keys = [];
  var situations = {"RN": "Reprovado por nota", "AP": "Aprovado", "R": "Retido", "D": "Desistiu"};

  Object.keys(studentTypeQt).forEach((key) => {
    data.push(studentTypeQt[key]);
    keys.push(key);
  });

  //piechat
  var colorScale = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"];

  var arc = d3.arc().innerRadius(0).outerRadius(70);

  var pie = d3.pie().value(function(d) {return d;});

  var selection = d3.select("#studentDetailsPiechart").select("g").selectAll("path").data(pie(data));

  selection.enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", function(d,i) {
    return colorScale[i];
  })
  .attr("transform", "translate(" + 130 + "," + height/2 + ")");

  for(var i = 0; i < keys.length; i++) {
  //Object.keys(studentTypeQt).forEach((key) => {
    g.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .attr("transform", "translate(" + 250 + ", " + (height - ((i+1)*20)) + ")")
    .attr("fill", colorScale[i]);

    schoolDetails.select("svg").append("text")
    .attr("x", 0)
    .attr("y", 0)
    .text(function(d) {
      if(situations.hasOwnProperty(keys[i]))
        return situations[keys[i]];
      else
        return keys[i];
    })
    .attr("transform", "translate(" + 265 + ", " + ((i+1)*20) + ")");
  };
}
