import {
  getCompositeInfo,
  getContaminentExposure,
  getOccurrenceForContaminentEntry as getOccurrenceForContaminentEntry,
} from "../util/graph.js";
import { ConsumptionUnits, MeanFlag } from "../config.js";
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
 * Take in TDS data and return data which has been strictly filtered and formatted for use when comparing food composites
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
        contaminentUnit: "",
        foodGroup,
      };

      let numContaminents = 0;
      let sumContaminents = 0;
      let numContaminentUnderLod = 0;

      filters.years.forEach((year) => {
        tdsData.contaminent[year].forEach((contaminent) => {
          if (contaminent.compositeInfo.includes(composite)) {
            rbfData[composite].contaminentUnit = contaminent.units;

            numContaminents++;
            sumContaminents += getOccurrenceForContaminentEntry(
              contaminent,
              filters,
            );

            if (contaminent.occurrence < contaminent.lod) {
              numContaminentUnderLod++;
            }
          }
        });
      });
      const meanConsumption = filters.usePerPersonPerDay
        ? consumption.meanGramsPerPersonPerDay
        : consumption.meanGramsPerKgBWPerDay;

      const occurrence = sumContaminents / numContaminents || 0;

      const exposure = getContaminentExposure(
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
        percentUnderLod: (numContaminentUnderLod / numContaminents) * 100 || 0,
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
 * Take in data formatted for comparing food composites and format it to data table format
 */
export function formatRbfToDataTable(rbfData, filters) {
  const headers = getTranslations().dataTable.headers;

  const dataTableData = Object.values(rbfData).map((row) => {
    const compositeInfo = getCompositeInfo(row);

    return {
      [headers.chemical]: filters.chemical,
      [headers.ageSexGroup]: getAgeSexDisplay(row.ageSexGroup),
      [headers.foodGroup]: row.foodGroup,
      [headers.composite]: compositeInfo,
      [headers.percentExposure]: formatPercent(row.percentExposure),
      [headers.exposure]: formatNumber(row.exposure, filters),
      [headers.exposureUnit]: getExposureUnit(row.contaminentUnit, filters),
      [headers.years]: filters.years.join(", "),
      [headers.percentUnderLod]: formatPercent(row.percentUnderLod),
      [headers.treatment]: filters.lod,
      [headers.modified]: filters.override.list
        .filter((override) => override.composite.includes(row.composite))
        .map((override) => getUserModifiedValueText(override)),
      [headers.flagged]:
        row.consumptionMeanFlag == MeanFlag.FLAGGED ? compositeInfo : "",
      [headers.suppressed]:
        row.consumptionMeanFlag == MeanFlag.SUPPRESSED ? compositeInfo : "",
    };
  });

  return dataTableData;
}

/**
 * Take in data formatted for comparing food composites and format it to sunburst data
 */
export function formatRbfToSunburst(rbfData, filters, colorMapping) {
  const sunburstData = { title: filters.chemical, children: [] };

  Object.values(rbfData).forEach((row) => {
    sunburstData.children.push({
      color: colorMapping[row.foodGroup],
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
        getExposureUnit(row.contaminentUnit, filters) +
        "\n" +
        getTranslations().graphs.info.percentExposure +
        ": " +
        formatPercent(row.percentExposure) +
        "\n" +
        getTranslations().graphs.info.occurrence +
        ": " +
        formatNumber(row.meanOccurrence, filters) +
        " " +
        row.contaminentUnit +
        "\n" +
        getTranslations().graphs.info.foodConsumption +
        ": " +
        getConsumptionUnit(row, filters),
    });
  });

  return sunburstData;
}
