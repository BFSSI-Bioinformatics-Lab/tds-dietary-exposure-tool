import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry as getOccurrenceForContaminantEntry,
} from "../util/graph.js";
import { ConsumptionUnits, DataTableHeaders, MeanFlag } from "../config.js";
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
 * Take in data formatted for comparing food composites and format it to data table format
 */
export function formatRbfToDataTable(rbfData, filters) {
  const dataTableData = Object.values(rbfData).map((row) => {
    const compositeInfo = getCompositeInfo(row);

    return {
      [DataTableHeaders.CHEMICAL]: filters.chemical,
      [DataTableHeaders.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
      [DataTableHeaders.FOOD_GROUP]: row.foodGroup,
      [DataTableHeaders.COMPOSITE]: compositeInfo,
      [DataTableHeaders.PERCENT_EXPOSURE]: formatPercent(row.percentExposure),
      [DataTableHeaders.EXPOSURE]: formatNumber(row.exposure, filters),
      [DataTableHeaders.EXPOSURE_UNIT]: getExposureUnit(
        row.contaminantUnit,
        filters,
      ),
      [DataTableHeaders.YEARS``]: filters.years.join(", "),
      [DataTableHeaders.PERCENT_UNDER_LOD]: formatPercent(row.percentUnderLod),
      [DataTableHeaders.TREATMENT]: filters.lod,
      [DataTableHeaders.MODIFIED]: filters.override.list
        .filter((override) => override.composite.includes(row.composite))
        .map((override) => getUserModifiedValueText(override)),
      [DataTableHeaders.FLAGGED]:
        row.consumptionMeanFlag == MeanFlag.FLAGGED ? compositeInfo : "",
      [DataTableHeaders.SUPPRESSED]:
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
        getConsumptionUnit(row, filters),
    });
  });

  return sunburstData;
}
