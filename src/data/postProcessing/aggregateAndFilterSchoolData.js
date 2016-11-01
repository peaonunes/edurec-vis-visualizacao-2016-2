var path = require('path');
var fs = require('fs');

module.exports = function aggregateAndFilterSchoolData (rawSchoolsData) {
  return rawSchoolsData.reduce((aggregate, schoolData) => {
    const aggregatedData = {
      agua: aggregateWaterSourceData(schoolData),
      energia: aggregateEnergySourceData(schoolData),
      esgoto: aggregateSewerDisposalData(schoolData),
      lixo: aggregateGarbageDisposalData(schoolData),
      dependencias: aggregateDependencyData(schoolData),
    };

    const filteredData = getOnlyDesiredKeys(schoolData);

    aggregate[schoolData['_id']] = Object.assign({}, aggregatedData, filteredData);

    return aggregate;
  }, {});
};

const waterSourceValues = [ 'inexistente', 'rede_publica', 'poco_artesiano', 'cacimba', 'fonte' ];
const aggregateWaterSourceData = aggregateCategoricalData(waterSourceValues, 'agua');

const energySourceValues = [ 'inexistente', 'rede_publica', 'gerador', 'outros' ];
const aggregateEnergySourceData = aggregateCategoricalData(energySourceValues, 'energia');

const sewerDisposalValues = [ 'inexistente', 'rede_publica', 'fossa' ];
const aggregateSewerDisposalData = aggregateCategoricalData(sewerDisposalValues, 'esgoto');

const garbageDisposalValues = [ 'coleta_periodica', 'queima', 'outra_area', 'recicla', 'enterra', 'outros' ];
const aggregateGarbageDisposalData = aggregateCategoricalData(garbageDisposalValues, 'lixo');

const dependencyValues = [
  'laboratorio_informatica',
  'laboratorio_ciencias',
  'aee',
  'cozinha',
  'biblioteca',
  'leitura',
  'parque_infantil',
  'bercario',
  'refeitorio',
  'despensa',
  'almoxarifado',
  'auditorio',
  'area_verde',
  'lavanderia'
];
const aggregateDependencyData = aggregateCategoricalData(dependencyValues, 'dependencia');

function aggregateCategoricalData(categories, prefix = null) {
  const baseString = prefix === null ? '' : `${prefix}_`;

  return function (schoolData) {
    return categories.reduce(function (aggregatedData, category) {
      const valueForCategory = parseInt(schoolData[`${baseString}${category}`]);

      aggregatedData[category] = !!(!isNaN(valueForCategory) && valueForCategory);

      return aggregatedData;
    }, {});
  }
}

const getOnlyDesiredKeys = (() => {
  var desiredKeysFile = path.join(__dirname, '../dataFiles/schoolFields.json');
  var desiredKeys = JSON.parse(fs.readFileSync(desiredKeysFile));

  return (rawSchoolData) => {
    var result = {};

    desiredKeys.forEach((key) => {
      result[key] = rawSchoolData[key];
    });

    return result;
  }
})();