import {
  ConsumptionUnits,
  GraphTypes,
  MeanFlag,
  RbfgRangeFormat,
  ageGroups,
} from "../config.js";
import {
  formatNumber,
  formatPercent,
  getAgeAndSex,
  getExposureUnit,
} from "../util/data.js";
import {
  getCompositeInfo,
  getContaminentExposure,
  getOccurenceForContaminentEntry,
} from "../util/graph.js";
import { getTranslations } from "../translation/translation.js";

/**
 *
 * Take in TDS data and return data which has been strictly filtered and formatted for use when comparing food groups
 *
 */
export function getRbfg(tdsData, filters) {
  const rbfgData = {};
  filters.ageSexGroups.forEach((ageSexGroup) => (rbfgData[ageSexGroup] = {}));

  Object.keys(tdsData.consumption).forEach((foodGroup) => {
    filters.ageSexGroups.forEach(
      (ageSexGroup) =>
      (rbfgData[ageSexGroup][foodGroup] = {
        ageSexGroup,
        consumptionsSuppressed: [],
        consumptionsFlagged: [],
        contaminentUnit: Object.values(tdsData.contaminent)[0][0].units, // All occurences use the same value for a given chemical group
        exposure: 0,
        foodGroup,
        percentUnderLod: 0,
        numContaminents: 0,
        numContaminentsUnderLod: 0,
      }),
    );

    Object.keys(tdsData.consumption[foodGroup]).forEach((composite) => {
      const consumptions = tdsData.consumption[foodGroup][composite].filter(
        (row) => filters.ageSexGroups.includes(row.ageSexGroup),
      );
      if (consumptions.length == 0) return;

      consumptions.forEach((consumption) => {
        const consumptionMeanFlag = filters.usePerPersonPerDay
          ? consumption.meanFlagForPerPersonPerDay
          : consumption.meanFlagForPerKgBWPerDay;
        const compositeInfo = getCompositeInfo(consumption);
        if (consumptionMeanFlag == MeanFlag.SUPPRESSED) {
          rbfgData[consumption.ageSexGroup][
            foodGroup
          ].consumptionsSuppressed.push(compositeInfo);
        } else if (consumptionMeanFlag == MeanFlag.FLAGGED) {
          rbfgData[consumption.ageSexGroup][foodGroup].consumptionsFlagged.push(
            compositeInfo,
          );
        }

        let numContaminents = 0;
        let sumContaminents = 0;

        filters.years.forEach((year) => {
          tdsData.contaminent[year].forEach((contaminent) => {
            if (contaminent.compositeInfo.includes(composite)) {
              numContaminents++;
              sumContaminents += getOccurenceForContaminentEntry(
                contaminent,
                filters,
              );
              if (contaminent.occurence < contaminent.lod) {
                rbfgData[consumption.ageSexGroup][foodGroup]
                  .numContaminentsUnderLod++;
              }
            }
          });
        });
        const occurence = sumContaminents / numContaminents || 0;
        const exposure = getContaminentExposure(
          filters.usePerPersonPerDay
            ? consumption.meanGramsPerPersonPerDay
            : consumption.meanGramsPerKgBWPerDay,
          occurence,
          filters,
          consumption.age,
        );

        rbfgData[consumption.ageSexGroup][foodGroup].exposure += exposure;
        rbfgData[consumption.ageSexGroup][foodGroup].numContaminents +=
          numContaminents;
      });
    });
  });

  Object.keys(rbfgData).forEach((ageSexGroup) => {
    const sumExposures = Object.values(rbfgData[ageSexGroup]).reduce(
      (a, b) => a + b.exposure,
      0,
    );
    Object.values(rbfgData[ageSexGroup]).forEach((row) => {
      row.percentExposure = (row.exposure / sumExposures) * 100 || 0;
      row.percentUnderLod =
        (row.numContaminentsUnderLod / row.numContaminents) * 100 || 0;
    });
  });

  return rbfgData;
}

/**
 *
 * Take in data formatted for comparing food groups and format it to data table format
 *
 *
 */
export function formatRbfgToDataTable(rbfgData, filters) {
  const dataTableData = [];

  const headers = getTranslations().dataTable.headers;

  Object.values(rbfgData).forEach((ageSexGroup) => {
    Object.values(ageSexGroup).forEach((row) => {
      dataTableData.push({
        [headers.chemical]: filters.chemical,
        [headers.ageSexGroup]: row.ageSexGroup,
        [headers.foodGroup]: row.foodGroup,
        [headers.percentExposure]: formatPercent(row.percentExposure),
        [headers.exposure]: formatNumber(row.exposure, filters),
        [headers.exposureUnit]: getExposureUnit(row.contaminentUnit, filters),
        [headers.years]: filters.years.join(", "),
        [headers.percentUnderLod]: formatPercent(row.percentUnderLod),
        [headers.treatment]: filters.lod,
        [headers.flagged]: row.consumptionsFlagged.join("; "),
        [headers.suppressed]: row.consumptionsSuppressed.join("; "),
      });
    });
  });
  return dataTableData;
}

/**
 *
 * Take in data formatted for comparing food groups and format it to stacked bar data
 *
 */
export function formatRbfgToStackedBar(rbfgData, filters, colorMapping) {
  const contaminentUnit = Object.values(Object.values(rbfgData)[0])[0]
    .contaminentUnit;

  const stackedBarData = {
    children: [],
    titleY: `${getTranslations().graphs[GraphTypes.RBFG].range[
      filters.usePercent ? RbfgRangeFormat.PERCENT : RbfgRangeFormat.NUMBER
      ]
      } (${getExposureUnit(contaminentUnit, filters)})`,
    titleX: getTranslations().graphs[GraphTypes.RBFG].domain,
  };

  Object.keys(rbfgData).forEach((ageSexGroup) => {
    Object.keys(rbfgData[ageSexGroup]).forEach((foodGroup) => {
      const [age, sexGroup] = getAgeAndSex(ageSexGroup);
      const exposure =
        (filters.usePercent
          ? rbfgData[ageSexGroup][foodGroup].percentExposure || 0
          : rbfgData[ageSexGroup][foodGroup].exposure) || 0;
      stackedBarData.children.push({
        entry: age + sexGroup[0],
        sortBy: Object.keys(ageGroups).indexOf(ageSexGroup),
        color: colorMapping[foodGroup],
        stack: foodGroup,
        value: exposure,
        info:
          foodGroup +
          " (" +
          ageSexGroup +
          ")\n" +
          getTranslations().graphs[GraphTypes.RBFG].range[
          filters.usePercent
            ? RbfgRangeFormat.PERCENT
            : RbfgRangeFormat.NUMBER
          ] +
          ": " +
          (filters.usePercent
            ? formatPercent(exposure)
            : formatNumber(exposure, filters) +
            " " +
            getExposureUnit(contaminentUnit, filters)),
      });
    });
  });

  return stackedBarData;
}
