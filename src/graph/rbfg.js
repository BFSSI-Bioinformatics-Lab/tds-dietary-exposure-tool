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
  SetTools,
  TableTools
} from "../util/data.js";
import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry,
} from "../util/graph.js";
import { getBreakdownDistribWebStr, getBreakdownWebStr, groupContaminantsByChecmical } from "../data/dataTranslator.js";


// getChemicalRbfg(tdsData, filters): Retrieves the data for results by age-sex group
//  for a particular chemical
function getChemicalRbfg(tdsData, filters) {
  const rbfgData = {};
  filters.ageSexGroups.forEach((ageSexGroup) => (rbfgData[ageSexGroup] = {}));

  Object.keys(tdsData.consumption).forEach((foodGroup) => {
    filters.ageSexGroups.forEach((ageSexGroup) => {
      rbfgData[ageSexGroup][foodGroup] = {
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

        contaminantsTested: new Set(),
        compositesTested: new Set()
      }
    });

    Object.keys(tdsData.consumption[foodGroup]).forEach((composite) => {
      const consumptions = tdsData.consumption[foodGroup][composite].filter(
        (row) => filters.ageSexGroups.includes(row.ageSexGroup),
      );
      if (consumptions.length == 0) return;

      consumptions.forEach((consumption) => {
        const consumptionMeanFlag = filters.usePerPersonPerDay ? consumption.meanFlagForPerPersonPerDay : consumption.meanFlagForPerKgBWPerDay;
        const compositeInfo = getCompositeInfo(consumption);
        const rbfgDataRow = rbfgData[consumption.ageSexGroup][foodGroup];

        if (consumptionMeanFlag == MeanFlag.SUPPRESSED) {
          rbfgDataRow.consumptionsSuppressed.push(compositeInfo);

        } else if (consumptionMeanFlag == MeanFlag.FLAGGED) {
          rbfgDataRow.consumptionsFlagged.push(compositeInfo);

        } else if (consumptionMeanFlag == MeanFlag.SUPPRESSED_HIGH_CV) {
          rbfgDataRow.consumptionsSuppressed.push(compositeInfo);
          rbfgDataRow.consumptionsSuppressedWithHighCv.push(compositeInfo);
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
                rbfgDataRow.contaminantsTested.add(contaminant.id);
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

        if (compositeTested) {
          rbfgDataRow.numCompositesTested += compositeTested;
          rbfgDataRow.compositesTested.add(composite);
        }

        rbfgDataRow.exposure += exposure;
        rbfgDataRow.numContaminantsTested += numContaminantsTested;
      });
    });
  });

  return rbfgData;
}

function getRbfgAggregates(rbfgData, tdsData, filters) {

  // retrieve the sum of the exposures for each age/sex group
  const sumExposures = {};
  TableTools.forGroup(rbfgData, ["chemical", "ageSexGroup"], (keys, values) => {
    const ageSexGroup = keys.ageSexGroup;

    if (sumExposures[ageSexGroup] == undefined) sumExposures[ageSexGroup] = 0;
    sumExposures[ageSexGroup] += Object.values(values.ageSexGroup).reduce((acc, b) => acc + b.exposure, 0);
  });

  // filter the data for only the relevant food groups
  if (filters.filteredFoodGroups.size > 0) {
    TableTools.forGroup(rbfgData, ["chemical", "ageSexGroup", "foodGroup"], (keys, values) => {
      if (!filters.filteredFoodGroups.has(keys.foodGroup)) {
        delete rbfgData[keys.chemical][keys.ageSexGroup][keys.foodGroup];
      }
    });
  }

  // get the total unique number of composites for a particular food group  
  const composites = {};
  TableTools.forGroup(tdsData.consumption, ["foodGroup", "composite"], (keys, values) => {
    if (composites[keys.foodGroup] == undefined) composites[keys.foodGroup] = new Set();
    composites[keys.foodGroup].add(keys.composite);
  });

  // get the number of contaminants tested
  const contaminantsTested = {};
  TableTools.forGroup(rbfgData, ["chemical", "ageSexGroup", "foodGroup"], (keys, values) => {
    const row = values.foodGroup;

    if (contaminantsTested[keys.ageSexGroup] == undefined) contaminantsTested[keys.ageSexGroup] = {};
    if (contaminantsTested[keys.ageSexGroup][keys.foodGroup] == undefined) contaminantsTested[keys.ageSexGroup][keys.foodGroup] = new Set();

    SetTools.union(contaminantsTested[keys.ageSexGroup][keys.foodGroup], row.contaminantsTested, false);
  });

  TableTools.forGroup(rbfgData, ["chemical", "ageSexGroup", "foodGroup"], (keys, values) => {
    const row = values.foodGroup;
    const sumExposure = sumExposures[keys.ageSexGroup];
    const numComposites = composites[keys.foodGroup].size;
    const numContaminantsTested = contaminantsTested[keys.ageSexGroup][keys.foodGroup].size;

    row.composites = composites[keys.foodGroup];
    row.percentExposure = (row.exposure / sumExposure) * 100 || 0;
    row.percentUnderLod = (row.numContaminantsUnderLod / numContaminantsTested) * 100 || 0;
    row.percentNotTested = ((numComposites - row.compositesTested.size) / numComposites) * 100;
    row.percentTested = row.compositesTested.size / numComposites *  100;
  });

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
  if (!(Object.values(Translation.translate("tdsData.values.total", {returnObjects: true})).includes(filters.chemical))) {
    result = getChemicalRbfg(tdsData, filters);
    result = getRbfgAggregates({[filters.chemical]: result}, tdsData, filters);
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
  result = getRbfgAggregates(result, tdsData, filters);
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
  const isTotalChemical = Object.values(Translation.translate("tdsData.values.total", {returnObjects: true})).includes(filters.chemical);

  if (!isTotalChemical) {
    rbfgData = {[filters.chemical]: rbfgData};
  }

  const totalCompositesTested = {};
  const totalComposites = {};

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

        if (totalCompositesTested[row.foodGroup] == undefined) totalCompositesTested[row.foodGroup] = new Set();
        if (totalComposites[row.foodGroup] == undefined) totalComposites[row.foodGroup] = new Set();

        SetTools.union(totalCompositesTested[row.foodGroup], row.compositesTested, false);
        SetTools.union(totalComposites[row.foodGroup], row.composites, false);

        let dataTableRow = foodGroupRow[row.ageSexGroup];
        if (dataTableRow == undefined) {
          foodGroupRow[row.ageSexGroup] = {
            [DataTableHeader.CHEMICAL]: filters.chemical,
            [DataTableHeader.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
            [DataTableHeader.FOOD_GROUP]: row.foodGroup,
            [DataTableHeader.PERCENT_EXPOSURE]: {[chemical]: row.percentExposure},
            [DataTableHeader.EXPOSURE]: {[chemical]: row.exposure},
            [DataTableHeader.EXPOSURE_UNIT]: {[chemical]: getExposureUnit(row.contaminantUnit, filters)},
            [DataTableHeader.YEARS]: new Set(row.years),
            [DataTableHeader.PERCENT_NOT_TESTED]: {[chemical]: row.percentNotTested},
            [DataTableHeader.PERCENT_UNDER_LOD]: {[chemical]: row.percentUnderLod},
            [DataTableHeader.TREATMENT]: filters.lod,
            [DataTableHeader.MODIFIED]: filters.override.list.filter((override) => override.foodGroup == row.foodGroup).map((override) => getUserModifiedValueText(override, row.contaminantUnit)).join("; "),
            [DataTableHeader.FLAGGED]: new Set(row.consumptionsFlagged),
            [DataTableHeader.SUPPRESSED]: new Set(row.consumptionsSuppressed),
            [DataTableHeader.INCLUDED_SUPPRESSED]: new Set(filters.useSuppressedHighCvValues ? row.consumptionsSuppressedWithHighCv : []),
            foodGroup: row.foodGroup
          };

          dataTableRow = foodGroupRow[row.ageSexGroup];

          if (!dataTableRow[DataTableHeader.MODIFIED]) {
            dataTableRow[DataTableHeader.MODIFIED] = Translation.translate("not applicable");
          }

          return;
        }

        dataTableRow.foodGroup = row.foodGroup;
        dataTableRow[DataTableHeader.PERCENT_EXPOSURE][chemical] = row.percentExposure;
        dataTableRow[DataTableHeader.EXPOSURE][chemical] = row.exposure;
        dataTableRow[DataTableHeader.EXPOSURE_UNIT][chemical] = getExposureUnit(row.contaminantUnit, filters);
        SetTools.union(dataTableRow[DataTableHeader.YEARS], new Set(row.years), false);
        dataTableRow[DataTableHeader.PERCENT_NOT_TESTED][chemical] = row.percentNotTested;
        dataTableRow[DataTableHeader.PERCENT_UNDER_LOD][chemical] = row.percentUnderLod;
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
    if (!isTotalChemical) {
      row[DataTableHeader.EXPOSURE] = formatNumber(row[DataTableHeader.EXPOSURE][filters.chemical], filters);
      row[DataTableHeader.PERCENT_EXPOSURE] = DictTools.toWebStr(row[DataTableHeader.PERCENT_EXPOSURE], (key, val) => formatPercent(val));
      row[DataTableHeader.PERCENT_NOT_TESTED] = DictTools.toWebStr(row[DataTableHeader.PERCENT_NOT_TESTED], (key, val) => formatPercent(val));
      row[DataTableHeader.PERCENT_UNDER_LOD] = DictTools.toWebStr(row[DataTableHeader.PERCENT_UNDER_LOD], (key, val) => formatPercent(val));

    } else {
      row[DataTableHeader.EXPOSURE] = getBreakdownDistribWebStr({breakDown: row[DataTableHeader.EXPOSURE], 
                                                                 formatValFunc: (key, val) => Translation.translateScientificNum(val),
                                                                 totalFormatPercentFunc: (val) => Translation.translate("total"),
                                                                 filter: (key, val) => val.value != 0});

      row[DataTableHeader.PERCENT_EXPOSURE] = getBreakdownWebStr({breakDown: row[DataTableHeader.PERCENT_EXPOSURE], 
                                                                  formatValFunc: (key, val) => formatPercent(val),
                                                                  totalFormatPercentFunc: (val) => Translation.translate("total"),
                                                                  filter: (key, val) => val != 0});

      row[DataTableHeader.PERCENT_NOT_TESTED] = getBreakdownWebStr({breakDown: row[DataTableHeader.PERCENT_NOT_TESTED], 
                                                                    formatValFunc: (key, val) => formatPercent(val), 
                                                                    getTotalVal: (breakDown) => (totalComposites[row.foodGroup].size - totalCompositesTested[row.foodGroup].size) / totalComposites[row.foodGroup].size * 100,
                                                                    totalFormatPercentFunc: (val) => Translation.translate("total"),
                                                                    filter: (key, val) => val != 0});

      row[DataTableHeader.PERCENT_UNDER_LOD] = getBreakdownWebStr({breakDown: row[DataTableHeader.PERCENT_UNDER_LOD], 
                                                                   formatValFunc: (key, val) => formatPercent(val),
                                                                   totalFormatPercentFunc: (val) => Translation.translate("total"),
                                                                   filter: (key, val) => val != 0});
    }

    row[DataTableHeader.EXPOSURE_UNIT] = DictTools.toWebStr(row[DataTableHeader.EXPOSURE_UNIT], null, true);

    row[DataTableHeader.YEARS] = Array.from(row[DataTableHeader.YEARS]).join(", ");
    row[DataTableHeader.FLAGGED] = Array.from(row[DataTableHeader.FLAGGED]).join("; ");
    row[DataTableHeader.SUPPRESSED] = Array.from(row[DataTableHeader.SUPPRESSED]).join("; ");
    row[DataTableHeader.INCLUDED_SUPPRESSED] = Array.from(row[DataTableHeader.INCLUDED_SUPPRESSED]).join("; ");
  }

  return result;
}

function getRbfgGraphInfo(filters, exposure, ageSexGroup, foodGroup, contaminantUnit) {
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

  const isTotalChemical = Object.values(Translation.translate("tdsData.values.total", {returnObjects: true})).includes(filters.chemical);
  if (!isTotalChemical) {
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
            info: getRbfgGraphInfo(filters, exposure, ageSexGroup, foodGroup, contaminantUnit)
          }
          return;
        }

        graphDataEntry.value += exposure;
        graphDataEntry.info = getRbfgGraphInfo(filters, exposure, ageSexGroup, foodGroup, contaminantUnit);
      });
    });
  }

  for (const foodGroup in graphData) {
    stackedBarData.children = stackedBarData.children.concat(Object.values(graphData[foodGroup]));
  }

  return stackedBarData;
}
