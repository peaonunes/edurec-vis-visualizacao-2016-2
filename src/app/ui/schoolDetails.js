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
  var schoolDetails = d3.select("#schoolDetails");

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

function renderStudentsDetails(students) {
  var schoolDetails = d3.select("#schoolDetails");

  var width = 300;
  var height = 200;

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

  Object.keys(studentTypeQt).forEach((key) => {
    data.push(studentTypeQt[key]);
  });
  
  //piechat
  var colorScale = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"];

  var arc = d3.arc().innerRadius(0).outerRadius(50);

  var pie = d3.pie().value(function(d) {return d;});

  var selection = d3.select("#studentDetailsPiechart").select("g").selectAll("path").data(pie(data));

  selection.enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", function(d,i) {
    return colorScale[i];
  })
  .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
}
