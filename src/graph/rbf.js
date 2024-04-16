import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry as getOccurrenceForContaminantEntry,
} from "../util/graph.js";
import { DataTableHeader, MeanFlag } from "../const.js";
import { getTranslations } from "../translation/translation.js";
import {
  formatNumber,
  formatPercent,
  getAgeSexDisplay,
  getConsumptionUnit,
  getExposureUnit,
  getUserModifiedValueText,
} from "../util/data.js";

/**
 * Take in TDS data and return data which has been strictly filtered and formatted 
 * for use when comparing results by food
 * 
 * Returns:
 * - An object with the following properties:
 *  - Food composite code
 *    - ageSexGroup
 *    - composite
 *    - compositeDesc
 *    - consumptionMeanFlag
 *    - contaminantUnit
 *    - exposure
 *    - foodGroup
 *    - meanConsumption
 *    - meanOccurence
 *    - percentExposure
 *    - percentExposureForFoodGroup
 *    - percentUnderLod
 *  // other food-composite codes
 */
export function getRbf(tdsData, filters) {
  const foodGroupExposures = {};
  const rbfData = {};

  let sumExposures = 0;
  Object.keys(tdsData.consumption).forEach((foodGroup) => {
    foodGroupExposures[foodGroup] = 0;
    Object.keys(tdsData.consumption[foodGroup]).forEach((composite) => {
      const consumption = tdsData.consumption[foodGroup][composite].find(
        (row) => filters.ageSexGroups.includes(row.ageSexGroup),
      );
      if (!consumption) return;

      rbfData[composite] = {
        ageSexGroup: consumption.ageSexGroup,
        composite,
        compositeDesc: consumption.compositeDesc,
        consumptionMeanFlag: filters.usePerPersonPerDay
          ? consumption.meanFlagForPerPersonPerDay
          : consumption.meanFlagForPerKgBWPerDay,
        contaminantUnit: "",
        foodGroup,
      };

      let numContaminants = 0;
      let sumContaminants = 0;
      let numContaminantUnderLod = 0;

      filters.years.forEach((year) => {
        tdsData.contaminant[year].forEach((contaminant) => {
          if (contaminant.compositeInfo.includes(composite)) {
            rbfData[composite].contaminantUnit = contaminant.units;

            numContaminants++;
            sumContaminants += getOccurrenceForContaminantEntry(
              contaminant,
              filters,
            );

            if (contaminant.occurrence < contaminant.lod) {
              numContaminantUnderLod++;
            }
          }
        });
      });
      const meanConsumption = filters.usePerPersonPerDay
        ? consumption.meanGramsPerPersonPerDay
        : consumption.meanGramsPerKgBWPerDay;

      const occurrence = sumContaminants / numContaminants || 0;

      const exposure = getContaminantExposure(
        meanConsumption,
        occurrence,
        filters,
        consumption.age,
      );
      sumExposures += exposure;

      rbfData[composite] = {
        ...rbfData[composite],
        meanOccurrence: occurrence,
        exposure,
        meanConsumption,
        percentUnderLod: (numContaminantUnderLod / numContaminants) * 100 || 0,
      };
      foodGroupExposures[foodGroup] += exposure;
    });
  });

  Object.values(rbfData).forEach((row) => {
    const percentExposure = (row.exposure / sumExposures) * 100 || 0;
    row.percentExposure = percentExposure;
    row.percentExposureForFoodGroup = foodGroupExposures[row.foodGroup];
  });

  return rbfData;
}

/**
 * Take in data formatted for comparing results by food (see function above) and format it to a data table format
 * 
 * Returns:
 * - An array of objects adhering to the contract specified in the displayDataTable function of dataTableComponent.js 
 */
export function formatRbfToDataTable(rbfData, filters) {
  const dataTableData = Object.values(rbfData).map((row) => {
    const compositeInfo = getCompositeInfo(row);

    return {
      [DataTableHeader.CHEMICAL]: filters.chemical,
      [DataTableHeader.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
      [DataTableHeader.FOOD_GROUP]: row.foodGroup,
      [DataTableHeader.COMPOSITE]: compositeInfo,
      [DataTableHeader.PERCENT_EXPOSURE]: formatPercent(row.percentExposure),
      [DataTableHeader.EXPOSURE]: formatNumber(row.exposure, filters),
      [DataTableHeader.EXPOSURE_UNIT]: getExposureUnit(
        row.contaminantUnit,
        filters,
      ),
      [DataTableHeader.YEARS]: filters.years.join(", "),
      [DataTableHeader.PERCENT_UNDER_LOD]: formatPercent(row.percentUnderLod),
      [DataTableHeader.TREATMENT]: filters.lod,
      [DataTableHeader.MODIFIED]: filters.override.list
        .filter((override) => override.composite.includes(row.composite))
        .map((override) => getUserModifiedValueText(override)).join("; "),
      [DataTableHeader.FLAGGED]:
        row.consumptionMeanFlag == MeanFlag.FLAGGED ? compositeInfo : "",
      [DataTableHeader.SUPPRESSED]:
        row.consumptionMeanFlag == MeanFlag.SUPPRESSED ? compositeInfo : "",
    };
  });

  return dataTableData;
}

/**
 * Take in data formatted for comparing results by food and format it to sunburst data
 * 
 * Returns:
 * - An object adhering to the contract specified in sunburst.js 
 */
export function formatRbfToSunburst(rbfData, filters, colorMapping) {
  const sunburstData = { title: filters.chemical, children: [] };

  Object.values(rbfData).forEach((row) => {
    sunburstData.children.push({
      color: colorMapping[row.foodGroup].color,
      value: row.percentExposure,
      sortBy: filters.sortByFood
        ? [row.percentExposure]
        : [row.percentExposureForFoodGroup, row.percentExposure],

      title: row.percentExposure < 1 ? " " : getCompositeInfo(row),
      info:
        row.compositeDesc +
        " (" +
        row.composite +
        ")\n" +
        getTranslations().graphs.info.exposure +
        ": " +
        formatNumber(row.exposure, filters) +
        " " +
        getExposureUnit(row.contaminantUnit, filters) +
        "\n" +
        getTranslations().graphs.info.percentExposure +
        ": " +
        formatPercent(row.percentExposure) +
        "\n" +
        getTranslations().graphs.info.occurrence +
        ": " +
        formatNumber(row.meanOccurrence, filters) +
        " " +
        row.contaminantUnit +
        "\n" +
        getTranslations().graphs.info.foodConsumption +
        ": " +
        getConsumptionUnit(row.meanConsumption, filters),
    });
  });

  return sunburstData;
}
