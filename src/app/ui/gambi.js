import { actionCreators as schoolFilterActions } from '../state/actions/schoolFilters';
import { actionCreators as studentFilterActions } from '../state/actions/studentFilters';

window.openDropdown = function(e) {
  var elementClassList = document.getElementById(e.id).classList;
  closeDropdowns();
  if(!elementClassList.contains('show'))
    elementClassList.toggle("show");
}

window.onclick = function(e) {
  if(!e.target.matches('.dropbtn') && !e.target.matches('.filter-checkbox')) {
    closeDropdowns();
  }
}

window.filterChanged = function(e) {
  if(e.classList.contains('dependencia'))
    store.dispatch(schoolFilterActions.toggleSchoolFilter("depedencias." + e.value));
  // if(e.classList.contains('servico'))
  //   store.dispatch(schoolFilterActions.toggleSchoolFilter("servicos." + e.value));
  // if(e.classList.contains('nota'))
  //   store.dispatch(schoolFilterActions.toggleSchoolFilter(e.value));
  // if(e.classList.contains('grau'))
  //   store.dispatch(studentFilterActions.toggleSchoolFilter("graus." + e.value));
  // if(e.classList.contains('turno'))
  //   store.dispatch(studentFilterActions.toggleSchoolFilter("turnos." + e.value));
};

window.closeDropdowns = function() {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  for (var d = 0; d < dropdowns.length; d++) {
    var openDropdown = dropdowns[d];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
}
