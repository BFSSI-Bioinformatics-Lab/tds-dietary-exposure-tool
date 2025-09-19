import {
  DataTableHeader,
  GraphTypes,
  LODs,
  MeanFlag,
  RbfgRangeFormat,
  ageGroups,
  getTranslations,
  Translation
} from "../const.js";
import {
  DictTools,
  formatNumber,
  formatPercent,
  getAgeAndSex,
  getAgeSexDisplay,
  getExposureUnit,
  getUserModifiedValueText,
  SetTools
} from "../util/data.js";
import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry,
} from "../util/graph.js";
import { breakDownFormatNumbers, getBreakdownDistribution, groupContaminantsByChecmical } from "../data/dataTranslator.js";


// getChemicalRbfg(tdsData, filters): Retrieves the data for results by age-sex group
//  for a particular chemical
function getChemicalRbfg(tdsData, filters) {
  const rbfgData = {};
  filters.ageSexGroups.forEach((ageSexGroup) => (rbfgData[ageSexGroup] = {}));

  Object.keys(tdsData.consumption).forEach((foodGroup) => {
    filters.ageSexGroups.forEach(
      (ageSexGroup) =>
        (rbfgData[ageSexGroup][foodGroup] = {
          ageSexGroup,
          consumptionsSuppressed: [],
          consumptionsFlagged: [],
          consumptionsSuppressedWithHighCv: [],
          contaminantUnit:
            Object.values(tdsData.contaminant).length != 0
              ? Object.values(tdsData.contaminant)[0][0].units
              : null, // All occurrences use the same value for a given chemical group
          exposure: 0,
          foodGroup,
          percentUnderLod: 0,
          numContaminantsTested: 0,
          numCompositesTested: 0,
          numContaminantsUnderLod: 0,
        }),
    );

    Object.keys(tdsData.consumption[foodGroup]).forEach((composite) => {
      const consumptions = tdsData.consumption[foodGroup][composite].filter(
        (row) => filters.ageSexGroups.includes(row.ageSexGroup),
      );
      if (consumptions.length == 0) return;

      consumptions.forEach((consumption) => {
        const consumptionMeanFlag = filters.usePerPersonPerDay ? consumption.meanFlagForPerPersonPerDay : consumption.meanFlagForPerKgBWPerDay;
        const compositeInfo = getCompositeInfo(consumption);

        if (consumptionMeanFlag == MeanFlag.SUPPRESSED) {
          rbfgData[consumption.ageSexGroup][foodGroup].consumptionsSuppressed.push(compositeInfo);

        } else if (consumptionMeanFlag == MeanFlag.FLAGGED) {
          rbfgData[consumption.ageSexGroup][foodGroup].consumptionsFlagged.push(compositeInfo);

        } else if (consumptionMeanFlag == MeanFlag.SUPPRESSED_HIGH_CV) {
          rbfgData[consumption.ageSexGroup][foodGroup].consumptionsSuppressed.push(compositeInfo);
          rbfgData[consumption.ageSexGroup][foodGroup].consumptionsSuppressedWithHighCv.push(compositeInfo);
        }

        let numContaminantsTested = 0;
        let compositeTested = 0;
        let sumContaminantsTested = 0;

        filters.years.forEach((year) => {
          if (tdsData.contaminant[year] == undefined) return;

          tdsData.contaminant[year].forEach((contaminant) => {
            if (contaminant.compositeInfo.includes(composite)) {
              if (filters.lod != LODs.Exclude || contaminant.occurrence != 0) {
                numContaminantsTested++;
              }

              sumContaminantsTested += getOccurrenceForContaminantEntry(contaminant, filters);
              compositeTested = 1;

              if (contaminant.occurrence < contaminant.lod) {
                rbfgData[consumption.ageSexGroup][foodGroup].numContaminantsUnderLod++;
              }
            }
          });
        });

        const occurrence = sumContaminantsTested / numContaminantsTested || 0;

        let meanConsumption = filters.usePerPersonPerDay
          ? consumption.meanGramsPerPersonPerDay
          : consumption.meanGramsPerKgBWPerDay;

        const meanFlag = filters.usePerPersonPerDay
          ? consumption.meanFlagForPerPersonPerDay
          : consumption.meanFlagForPerKgBWPerDay;

        meanConsumption =
          meanFlag == MeanFlag.SUPPRESSED
            ? 0
            : meanFlag == MeanFlag.SUPPRESSED_HIGH_CV
            ? filters.useSuppressedHighCvValues
              ? meanConsumption
              : 0
            : meanConsumption;

        const exposure = getContaminantExposure(
          meanConsumption,
          occurrence,
          filters,
          consumption.age,
        );

        rbfgData[consumption.ageSexGroup][foodGroup].exposure += exposure;
        rbfgData[consumption.ageSexGroup][foodGroup].numContaminantsTested += numContaminantsTested;
        rbfgData[consumption.ageSexGroup][foodGroup].numCompositesTested += compositeTested;
      });
    });
  });

  if (filters.filteredFoodGroups.size == 0) return rbfgData;
  
  for (const ageSexGroup in rbfgData) {
    const foodGroupData = rbfgData[ageSexGroup];

    for (const foodGroup in foodGroupData) {
      if (!filters.filteredFoodGroups.has(foodGroup)) {
        delete foodGroupData[foodGroup];
      }
    }
  }

  return rbfgData;
}

function getRbfgAggregates(rbfgData, tdsData) {
  const sumExposures = {};

  // retrieve the sum of the exposures
  for (const chemical in rbfgData) {
    const chemicalRbfgData = rbfgData[chemical];
    
    for (const ageSexGroup in chemicalRbfgData) {
      if (sumExposures[ageSexGroup] == undefined) sumExposures[ageSexGroup] = 0;
      sumExposures[ageSexGroup] += Object.values(chemicalRbfgData[ageSexGroup]).reduce((acc, b) => acc + b.exposure, 0);
    }
  }

  for (const chemical in rbfgData) {
    const chemicalRbfgData = rbfgData[chemical];

    for (const ageSexGroup in chemicalRbfgData) {
      const ageChemicalRbfgData = chemicalRbfgData[ageSexGroup];

      for (const foodGroup in ageChemicalRbfgData) {
        const row = ageChemicalRbfgData[foodGroup];
        const sumExposure = sumExposures[ageSexGroup];
        row.percentExposure = (row.exposure / sumExposure) * 100 || 0;
        row.percentUnderLod = (row.numContaminantsUnderLod / row.numContaminantsTested) * 100 || 0;

        const numComposites = Object.values(tdsData.consumption[row.foodGroup]).length;
        row.percentNotTested = ((numComposites - row.numCompositesTested) / numComposites) * 100;
      }
    }
  }

  return rbfgData;
}

/**
 * Take in TDS data and return data which has been strictly filtered and formatted
 * for use when comparing results by food group
 *
 * Returns:
 * - An object with following properties:
 *  - Age-sex group
 *    - Food group
 *      - ageSexGroup
 *      - consumptionsFlagged: array of food composite descriptons
 *      - consumptionsSuppressed: array of food composite descriptons
 *      - consumptionsSuppressedWithHighCv: array of food composite descriptions
 *      - contaminantUnit
 *      - exposure
 *      - foodGroup
 *      - numContaminantsTested
 *      - numCompositesTested
 *      - numContaminantsUnderLod
 *      - percentExposure
        - percentNotTested
 *      - percentUnderLod
 *    // other food groups
 *  // other age-sex groups
 */
export function getRbfg(tdsData, filters) {
  let result = {};
  if (filters.chemical != Translation.translate("tdsData.values.totalRadionuclides")) {
    result = getChemicalRbfg(tdsData, filters);
    result = getRbfgAggregates({[filters.chemical]: result}, tdsData);
    return result[filters.chemical];
  }

  const allContaminants = tdsData.contaminant;
  const groupedContaminants = groupContaminantsByChecmical(tdsData.contaminant);
  const currentFilters = structuredClone(filters);

  for (const chemical in groupedContaminants) {
    currentFilters.chemical = chemical;
    tdsData.contaminant = groupedContaminants[chemical];
    result[chemical] = getChemicalRbfg(tdsData, currentFilters);
  }

  tdsData.contaminant = allContaminants;
  result = getRbfgAggregates(result, tdsData);
  return result;
}

/**
 * Take in data formatted for comparing results by food group (see function above) and format it to a data table format
 *
 * Returns:
 * - An array of objects adhering to the contract specified in the displayDataTable function of dataTableComponent.js
 */
export function formatRbfgToDataTable(rbfgData, filters) {
  const dataTableData = {};
  const isRadionuclide = filters.chemicalGroup.trim() == Translation.translate("tdsData.values.radionuclides");
  const isTotalRadionuclide = filters.chemical == Translation.translate("tdsData.values.totalRadionuclides");

  if (!isTotalRadionuclide) {
    rbfgData = {[filters.chemical]: rbfgData};
  }

  for (const chemical in rbfgData) {
    const chemicalRbfgData = rbfgData[chemical];

    Object.values(chemicalRbfgData).forEach((ageSexGroup) => {
      Object.values(ageSexGroup).forEach((row) => {
        if (!row.ageSexGroup) return;

        let foodGroupRow = dataTableData[row.foodGroup];
        if (foodGroupRow == undefined) {
          foodGroupRow = {};
          dataTableData[row.foodGroup] = foodGroupRow;
        }

        const dataTableRow = foodGroupRow[row.ageSexGroup];
        if (dataTableRow == undefined) {
          foodGroupRow[row.ageSexGroup] = {
            [DataTableHeader.CHEMICAL]: filters.chemical,
            [DataTableHeader.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
            [DataTableHeader.FOOD_GROUP]: row.foodGroup,
            [DataTableHeader.PERCENT_EXPOSURE]: {[chemical]: formatPercent(row.percentExposure)},
            [DataTableHeader.EXPOSURE]: {[chemical]: row.exposure},
            [DataTableHeader.EXPOSURE_UNIT]: {[chemical]: getExposureUnit(row.contaminantUnit, filters)},
            [DataTableHeader.YEARS]: new Set(row.years),
            [DataTableHeader.PERCENT_NOT_TESTED]: {[chemical]: formatPercent(row.percentNotTested)},
            [DataTableHeader.PERCENT_UNDER_LOD]: {[chemical]: formatPercent(row.percentUnderLod)},
            [DataTableHeader.TREATMENT]: filters.lod,
            [DataTableHeader.MODIFIED]: filters.override.list.filter((override) => override.foodGroup == row.foodGroup).map((override) => getUserModifiedValueText(override, row.contaminantUnit)).join("; "),
            [DataTableHeader.FLAGGED]: new Set(row.consumptionsFlagged),
            [DataTableHeader.SUPPRESSED]: new Set(row.consumptionsSuppressed),
            [DataTableHeader.INCLUDED_SUPPRESSED]: new Set(filters.useSuppressedHighCvValues ? row.consumptionsSuppressedWithHighCv : [])
          };

          return;
        }

        dataTableRow[DataTableHeader.PERCENT_EXPOSURE][chemical] = formatPercent(row.percentExposure);
        dataTableRow[DataTableHeader.EXPOSURE][chemical] = row.exposure;
        dataTableRow[DataTableHeader.EXPOSURE_UNIT][chemical] = getExposureUnit(row.contaminantUnit, filters);
        SetTools.union(dataTableRow[DataTableHeader.YEARS], new Set(row.years), false);
        dataTableRow[DataTableHeader.PERCENT_NOT_TESTED][chemical] = formatPercent(row.percentNotTested);
        dataTableRow[DataTableHeader.PERCENT_UNDER_LOD][chemical] = formatPercent(row.percentUnderLod);
        SetTools.union(dataTableRow[DataTableHeader.FLAGGED], new Set(row.consumptionsFlagged), false);
        SetTools.union(dataTableRow[DataTableHeader.SUPPRESSED], new Set(row.consumptionsSuppressed), false);
        SetTools.union(dataTableRow[DataTableHeader.INCLUDED_SUPPRESSED], new Set(filters.useSuppressedHighCvValues ? row.consumptionsSuppressedWithHighCv : []));
      });
    });
  }
  
  let result = [];
  for (const foodGroup in dataTableData) {
    result = result.concat(Object.values(dataTableData[foodGroup]));
  }

  for (const row of result) {
    if (!isTotalRadionuclide) {
      row[DataTableHeader.EXPOSURE] = formatNumber(row[DataTableHeader.EXPOSURE][filters.chemical], filters);
    } else {
      row[DataTableHeader.EXPOSURE] = getBreakdownDistribution(row[DataTableHeader.EXPOSURE]);
    }

    row[DataTableHeader.PERCENT_EXPOSURE] = DictTools.toWebStr(row[DataTableHeader.PERCENT_EXPOSURE]);
    row[DataTableHeader.EXPOSURE_UNIT] = DictTools.toWebStr(row[DataTableHeader.EXPOSURE_UNIT]);
    row[DataTableHeader.PERCENT_NOT_TESTED] = DictTools.toWebStr(row[DataTableHeader.PERCENT_NOT_TESTED]);
    row[DataTableHeader.PERCENT_UNDER_LOD] = DictTools.toWebStr(row[DataTableHeader.PERCENT_UNDER_LOD]);

    row[DataTableHeader.YEARS] = Array.from(row[DataTableHeader.YEARS]).join(", ");
    row[DataTableHeader.FLAGGED] = Array.from(row[DataTableHeader.FLAGGED]).join("; ");
    row[DataTableHeader.SUPPRESSED] = Array.from(row[DataTableHeader.SUPPRESSED]).join("; ");
    row[DataTableHeader.INCLUDED_SUPPRESSED] = Array.from(row[DataTableHeader.INCLUDED_SUPPRESSED]).join("; ");
  }

  return result;
}

function getRbfgGraphInfo(filters, exposure, ageSexGroup, foodGroup) {
  return foodGroup + `(${getAgeSexDisplay(ageSexGroup)})\n` +
         Translation.translate(`graphs.${GraphTypes.RBFG}.range.${filters.usePercent ? RbfgRangeFormat.PERCENT : RbfgRangeFormat.NUMBER}`) + ": " +
        (filters.usePercent ? formatPercent(exposure): formatNumber(exposure, filters) + " " + getExposureUnit(contaminantUnit, filters));
}

/**
 * Take in data formatted for comparing results by food group and format it to stacked bar data
 *
 * Returns:
 * - An object adhering to the contract specified in stackedBar.js
 */
export function formatRbfgToStackedBar(rbfgData, filters, colorMapping) {
  if ($.isEmptyObject(rbfgData)) {
    return {};
  }

  const isTotalRadionuclide = filters.chemical == Translation.translate("tdsData.values.totalRadionuclides");
  if (!isTotalRadionuclide) {
    rbfgData = {[filters.chemical]: rbfgData};
  }

  const contaminantUnit = Object.values(Object.values(Object.values(rbfgData)[0])[0])[0].contaminantUnit;
  const stackedBarData = {
    children: [],
    titleY: `${
      getTranslations().graphs[GraphTypes.RBFG].range[
        filters.usePercent ? RbfgRangeFormat.PERCENT : RbfgRangeFormat.NUMBER
      ]
    } (${getExposureUnit(contaminantUnit, filters)})`,
    titleX: getTranslations().graphs[GraphTypes.RBFG].domain,
  };

  const graphData = {};

  for (const chemical in rbfgData) {
    const chemicalRbfgData = rbfgData[chemical];

    Object.keys(chemicalRbfgData).forEach((ageSexGroup) => {
      Object.keys(chemicalRbfgData[ageSexGroup]).forEach((foodGroup) => {
        const [age, sexGroup] = getAgeAndSex(getAgeSexDisplay(ageSexGroup));

        if (graphData[foodGroup] == undefined) {
          graphData[foodGroup] = {};
        }

        const graphDataId = `${age}${sexGroup}`;
        const graphDataEntry = graphData[foodGroup][graphDataId];

        const exposure = (filters.usePercent
            ? chemicalRbfgData[ageSexGroup][foodGroup].percentExposure || 0
            : chemicalRbfgData[ageSexGroup][foodGroup].exposure) || 0;

        if (graphDataEntry == undefined) {
          graphData[foodGroup][graphDataId] = {
            entry: age + sexGroup,
            sortBy: Object.keys(ageGroups).indexOf(ageSexGroup),
            color: colorMapping[foodGroup].color,
            stack: foodGroup,
            value: exposure,
            info: getRbfgGraphInfo(filters, exposure, ageSexGroup, foodGroup)
          }
          return;
        }

        graphDataEntry.value += exposure;
        graphDataEntry.info = getRbfgGraphInfo(filters, exposure, ageSexGroup, foodGroup);
      });
    });
  }

  for (const foodGroup in graphData) {
    stackedBarData.children = stackedBarData.children.concat(Object.values(graphData[foodGroup]));
  }

  return stackedBarData;
}
