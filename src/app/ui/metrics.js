// export function calculateSchoolGrade(schools) {
//   for(var i = 0; i < schools.length; i++) {
//     var school = schools[i];
//     var students = school.students;
//
//     var ap = 0;
//     var total = 0;
//
//     for(var j = 0; j < students.length; j++) {
//       var student = students[j];
//       if(student.SITU == student_situations.AP)
//         ap++;
//       if(student_situations.hasOwnProperty(student.SITU))
//         total++;
//     }
//     schools[i]["grade"] = (ap / total) * 100;
//   }
//   return schools;
// }
//
// var student_situations = {
//   "AP": "AP",
//   "RN": "RN",
//   "D": "D",
//   "RT": "RT",
//   "RF": "RF"
// };
