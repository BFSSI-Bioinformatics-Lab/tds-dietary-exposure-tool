import {
  getCompositeInfo,
  getContaminentExposure,
  getOccurenceForContaminentEntry,
} from "../util/graph.js";
import { ConsumptionUnits, MeanFlag } from "../config.js";
import { getTranslations } from "../translation/translation.js";
import { formatNumber, formatPercent } from "../util/data.js";

/**
 *
 * Take in TDS data and return data which has been strictly filtered and formatted for use when comparing food composites
 *
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
        contaminentUnits: "",
        foodGroup,
      };

      let numContaminents = 0;
      let sumContaminents = 0;
      let numContaminentUnderLod = 0;

      filters.years.forEach((year) => {
        tdsData.contaminent[year].forEach((contaminent) => {
          if (contaminent.compositeInfo.includes(composite)) {
            rbfData[composite].contaminentUnits = contaminent.units;

            numContaminents++;
            sumContaminents += getOccurenceForContaminentEntry(
              contaminent,
              filters,
            );

            if (contaminent.occurence < contaminent.lod) {
              numContaminentUnderLod++;
            }
          }
        });
      });
      const meanConsumption = filters.usePerPersonPerDay
        ? consumption.meanGramsPerPersonPerDay
        : consumption.meanGramsPerKgBWPerDay;

      const occurence = sumContaminents / numContaminents || 0;

      const exposure = getContaminentExposure(
        meanConsumption,
        occurence,
        filters,
        consumption.age,
      );
      sumExposures += exposure;

      rbfData[composite] = {
        ...rbfData[composite],
        meanOccurence: occurence,
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
    row.percentExposureWithFoodGroup =
      foodGroupExposures[row.foodGroup] + percentExposure;
  });

  return rbfData;
}

/**
 *
 * Take in data formatted for comparing food composites and format it to data table format
 *
 */
export function formatRbfToDataTable(data, filters) {
  const dataTableData = Object.values(data).map((row) => {
    const compositeInfo = getCompositeInfo(row);

    const headers = getTranslations().dataTable.headers;

    return {
      [headers.chemical]: filters.chemical,
      [headers.ageSexGroup]: row.ageSexGroup,
      [headers.foodGroup]: row.foodGroup,
      [headers.composite]: compositeInfo,
      [headers.percentExposure]: formatPercent(row.percentExposure),
      [headers.exposure]: formatNumber(row.exposure),
      [headers.exposureUnit]:
        row.contaminentUnits.split("/")[0] +
        getTranslations().misc.consumptionUnitsShort[
        filters.usePerPersonPerDay
          ? ConsumptionUnits.PERSON
          : ConsumptionUnits.KGBW
        ],
      [headers.years]: filters.years.join(", "),
      [headers.percentUnderLod]: formatPercent(row.percentUnderLod),
      [headers.treatment]: filters.lod,
      [headers.flagged]:
        row.consumptionMeanFlag == MeanFlag.FLAGGED ? compositeInfo : "",
      [headers.suppressed]:
        row.consumptionMeanFlag == MeanFlag.SUPPRESSED ? compositeInfo : "",
    };
  });

  return dataTableData;
}

/**
 *
 * Take in data formatted for comparing food composites and format it to sunburst data
 *
 */
export function formatRbfToSunburst(rbfData, filters, colorMapping) {
  const sunburstData = { title: filters.chemical, children: [] };

  Object.values(rbfData).forEach((row) => {
    sunburstData.children.push({
      color: colorMapping[row.foodGroup],
      value: row.percentExposure,
      sortBy: filters.sortByFood
        ? row.percentExposure
        : row.percentExposureWithFoodGroup,

      title: row.percentExposure < 1 ? " " : getCompositeInfo(row),
      info:
        row.compositeDesc +
        " (" +
        row.composite +
        ")\n" +
        getTranslations().graphs.info.exposure +
        ": " +
        formatNumber(row.exposure) +
        " " +
        row.contaminentUnits.split("/")[0] +
        getTranslations().misc.consumptionUnitsShort[
        filters.usePerPersonPerDay
          ? ConsumptionUnits.PERSON
          : ConsumptionUnits.KGBW
        ] +
        "\n" +
        getTranslations().graphs.info.percentExposure +
        ": " +
        formatPercent(row.percentExposure) +
        "\n" +
        getTranslations().graphs.info.occurence +
        ": " +
        formatNumber(row.meanOccurence) +
        " " +
        row.contaminentUnits +
        "\n" +
        getTranslations().graphs.info.foodConsumption +
        ": " +
        formatNumber(row.meanConsumption) +
        " " +
        getTranslations().misc.gramsShort +
        getTranslations().misc.consumptionUnitsShort[
        filters.usePerPersonPerDay
          ? ConsumptionUnits.PERSON
          : ConsumptionUnits.KGBW
        ],
    });
  });

  return sunburstData;
}
