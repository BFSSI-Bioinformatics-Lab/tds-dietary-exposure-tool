import {
  DataTableHeaders,
  GraphTypes,
  MeanFlag,
  RbfgRangeFormat,
  ageGroups,
} from "../config.js";
import {
  formatNumber,
  formatPercent,
  getAgeAndSex,
  getAgeSex,
  getAgeSexDisplay,
  getExposureUnit,
  getUserModifiedValueText,
} from "../util/data.js";
import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry,
} from "../util/graph.js";
import { getTranslations } from "../translation/translation.js";

/**
 * Take in TDS data and return data which has been strictly filtered and formatted for use when comparing food groups
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
        contaminantUnit: Object.values(tdsData.contaminant)[0][0].units, // All occurrences use the same value for a given chemical group
        exposure: 0,
        foodGroup,
        percentUnderLod: 0,
        numContaminants: 0,
        numContaminantsUnderLod: 0,
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

        let numContaminants = 0;
        let sumContaminants = 0;

        filters.years.forEach((year) => {
          tdsData.contaminant[year].forEach((contaminant) => {
            if (contaminant.compositeInfo.includes(composite)) {
              numContaminants++;
              sumContaminants += getOccurrenceForContaminantEntry(
                contaminant,
                filters,
              );
              if (contaminant.occurrence < contaminant.lod) {
                rbfgData[consumption.ageSexGroup][foodGroup]
                  .numContaminantsUnderLod++;
              }
            }
          });
        });
        const occurrence = sumContaminants / numContaminants || 0;
        const exposure = getContaminantExposure(
          filters.usePerPersonPerDay
            ? consumption.meanGramsPerPersonPerDay
            : consumption.meanGramsPerKgBWPerDay,
          occurrence,
          filters,
          consumption.age,
        );

        rbfgData[consumption.ageSexGroup][foodGroup].exposure += exposure;
        rbfgData[consumption.ageSexGroup][foodGroup].numContaminants +=
          numContaminants;
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
        (row.numContaminantsUnderLod / row.numContaminants) * 100 || 0;
    });
  });

  return rbfgData;
}

/**
 * Take in data formatted for comparing food groups and format it to data table format
 */
export function formatRbfgToDataTable(rbfgData, filters) {
  const dataTableData = [];

  Object.values(rbfgData).forEach((ageSexGroup) => {
    Object.values(ageSexGroup).forEach((row) => {
      dataTableData.push({
        [DataTableHeaders.CHEMICAL]: filters.chemical,
        [DataTableHeaders.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
        [DataTableHeaders.FOOD_GROUP]: row.foodGroup,
        [DataTableHeaders.PERCENT_EXPOSURE]: formatPercent(row.percentExposure),
        [DataTableHeaders.EXPOSURE]: formatNumber(row.exposure, filters),
        [DataTableHeaders.EXPOSURE_UNIT]: getExposureUnit(
          row.contaminantUnit,
          filters,
        ),
        [DataTableHeaders.YEARS]: filters.years.join(", "),
        [DataTableHeaders.PERCENT_UNDER_LOD]: formatPercent(
          row.percentUnderLod,
        ),
        [DataTableHeaders.TREATMENT]: filters.lod,
        [DataTableHeaders.MODIFIED]: filters.override.list
          .filter((override) => override.foodGroup == row.foodGroup)
          .map((override) => getUserModifiedValueText(override))
          .join("; "),
        [DataTableHeaders.FLAGGED]: row.consumptionsFlagged.join("; "),
        [DataTableHeaders.SUPPRESSED]: row.consumptionsSuppressed.join("; "),
      });
    });
  });
  return dataTableData;
}

/**
 * Take in data formatted for comparing food groups and format it to stacked bar data
 */
export function formatRbfgToStackedBar(rbfgData, filters, colorMapping) {
  const contaminantUnit = Object.values(Object.values(rbfgData)[0])[0]
    .contaminantUnit;

  const stackedBarData = {
    children: [],
    titleY: `${getTranslations().graphs[GraphTypes.RBFG].range[
      filters.usePercent ? RbfgRangeFormat.PERCENT : RbfgRangeFormat.NUMBER
      ]
      } (${getExposureUnit(contaminantUnit, filters)})`,
    titleX: getTranslations().graphs[GraphTypes.RBFG].domain,
  };

  Object.keys(rbfgData).forEach((ageSexGroup) => {
    Object.keys(rbfgData[ageSexGroup]).forEach((foodGroup) => {
      const [age, sexGroup] = getAgeAndSex(getAgeSexDisplay(ageSexGroup));
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
          getAgeSexDisplay(ageSexGroup) +
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
            getExposureUnit(contaminantUnit, filters)),
      });
    });
  });

  return stackedBarData;
}
