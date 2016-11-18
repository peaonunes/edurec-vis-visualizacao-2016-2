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
    .attr("id", "studentDetailsHistogram")
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

}
