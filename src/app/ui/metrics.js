var schools = [
    {
        "nome": "ESCOLA MUNICIPAL IRMA TEREZINHA BATISTA - ANEXO I",
        "rank": 80,
        "address": "R. dos Craveiros, 273 - Campina do Barreto, Recife - PE, 52121-370, Brazil",
        "email": "EM.TEREZINHABATISTA@EDUCARECIFE.COM.BR",
        "lat": -8.014138299999999,
        "lng": -34.8813573,
        "students": [
          {
            "nome": "camila",
            "SITU": "AP"
          },
          {
            "nome": "peao",
            "SITU": "RN"
          },
          {
            "nome": "jesus",
            "SITU": "MO"
          }
        ]
   },
   {
       "nome": "ESCOLA MUNICIPAL IRMA TEREZINHA BATISTA - ANEXO I",
       "rank": 80,
       "address": "R. dos Craveiros, 273 - Campina do Barreto, Recife - PE, 52121-370, Brazil",
       "email": "EM.TEREZINHABATISTA@EDUCARECIFE.COM.BR",
       "lat": -8.014138299999999,
       "lng": -34.8813573,
       "students": [
         {
           "nome": "camila",
           "SITU": "AP"
         },
         {
           "nome": "peao",
           "SITU": "AP"
         }
       ]
  }
];

export function calculateSchoolGrade() {
  for(var i = 0; i < schools.length; i++) {
    var school = schools[i];
    var students = school.students;
    var ap = 0;
    var total = 0;
    for(var j = 0; j < students.length; j++) {
      var student = students[j];
      if(student.SITU == student_situations.AP)
        ap++;
      if(student_situations.hasOwnProperty(student.SITU))
        total++;
    }
    schools[i]["grade"] = (ap / total) * 100;
  }
  return schools;
}

var student_situations = {
  "AP": "AP",
  "RN": "RN",
  "D": "D",
  "RT": "RT",
  "RF": "RF"
}
