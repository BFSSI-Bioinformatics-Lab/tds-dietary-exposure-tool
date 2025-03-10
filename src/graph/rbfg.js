import {
  DataTableHeader,
  GraphTypes,
  LODs,
  MeanFlag,
  RbfgRangeFormat,
  ageGroups,
  getTranslations
} from "../const.js";
import {
  formatNumber,
  formatPercent,
  getAgeAndSex,
  getAgeSexDisplay,
  getExposureUnit,
  getUserModifiedValueText,
} from "../util/data.js";
import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry,
} from "../util/graph.js";

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
        } else if (consumptionMeanFlag == MeanFlag.SUPPRESSED_HIGH_CV) {
          rbfgData[consumption.ageSexGroup][
            foodGroup
          ].consumptionsSuppressed.push(compositeInfo);
          rbfgData[consumption.ageSexGroup][
            foodGroup
          ].consumptionsSuppressedWithHighCv.push(compositeInfo);
        }

        let numContaminantsTested = 0;
        let compositeTested = 0;
        let sumContaminantsTested = 0;

        filters.years.forEach((year) => {
          tdsData.contaminant[year].forEach((contaminant) => {
            if (contaminant.compositeInfo.includes(composite)) {
              if (filters.lod != LODs.Exclude || contaminant.occurrence != 0) {
                numContaminantsTested++;
              }
              sumContaminantsTested += getOccurrenceForContaminantEntry(
                contaminant,
                filters,
              );
              compositeTested = 1;
              if (contaminant.occurrence < contaminant.lod) {
                rbfgData[consumption.ageSexGroup][foodGroup]
                  .numContaminantsUnderLod++;
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
        rbfgData[consumption.ageSexGroup][foodGroup].numContaminantsTested +=
          numContaminantsTested;
        rbfgData[consumption.ageSexGroup][foodGroup].numCompositesTested +=
          compositeTested;
      });
    });
  });

  Object.keys(rbfgData).forEach((ageSexGroup) => {
    const sumExposures = Object.values(rbfgData[ageSexGroup]).reduce(
      (acc, b) => acc + b.exposure,
      0,
    );
    Object.values(rbfgData[ageSexGroup]).forEach((row) => {
      row.percentExposure = (row.exposure / sumExposures) * 100 || 0;
      row.percentUnderLod =
        (row.numContaminantsUnderLod / row.numContaminantsTested) * 100 || 0;
      const numComposites = Object.values(
        tdsData.consumption[row.foodGroup],
      ).length;
      row.percentNotTested =
        ((numComposites - row.numCompositesTested) / numComposites) * 100;
    });
  });

  return rbfgData;
}

/**
 * Take in data formatted for comparing results by food group (see function above) and format it to a data table format
 *
 * Returns:
 * - An array of objects adhering to the contract specified in the displayDataTable function of dataTableComponent.js
 */
export function formatRbfgToDataTable(rbfgData, filters) {
  const dataTableData = [];

  Object.values(rbfgData).forEach((ageSexGroup) => {
    Object.values(ageSexGroup).forEach((row) => {
      dataTableData.push({
        [DataTableHeader.CHEMICAL]: filters.chemical,
        [DataTableHeader.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
        [DataTableHeader.FOOD_GROUP]: row.foodGroup,
        [DataTableHeader.PERCENT_EXPOSURE]: formatPercent(row.percentExposure),
        [DataTableHeader.EXPOSURE]: formatNumber(row.exposure, filters),
        [DataTableHeader.EXPOSURE_UNIT]: getExposureUnit(
          row.contaminantUnit,
          filters,
        ),
        [DataTableHeader.YEARS]: filters.years.join(", "),
        [DataTableHeader.PERCENT_NOT_TESTED]: formatPercent(
          row.percentNotTested,
        ),
        [DataTableHeader.PERCENT_UNDER_LOD]: formatPercent(row.percentUnderLod),
        [DataTableHeader.TREATMENT]: filters.lod,
        [DataTableHeader.MODIFIED]: filters.override.list
          .filter((override) => override.foodGroup == row.foodGroup)
          .map((override) =>
            getUserModifiedValueText(override, row.contaminantUnit),
          )
          .join("; "),
        [DataTableHeader.FLAGGED]: row.consumptionsFlagged.join("; "),
        [DataTableHeader.SUPPRESSED]: row.consumptionsSuppressed.join("; "),
        [DataTableHeader.INCLUDED_SUPPRESSED]: filters.useSuppressedHighCvValues
          ? row.consumptionsSuppressedWithHighCv.join("; ")
          : [],
      });
    });
  });
  return dataTableData;
}

/**
 * Take in data formatted for comparing results by food group and format it to stacked bar data
 *
 * Returns:
 * - An object adhering to the contract specified in stackedBar.js
 */
export function formatRbfgToStackedBar(rbfgData, filters, colorMapping) {
  const contaminantUnit = Object.values(Object.values(rbfgData)[0])[0]
    .contaminantUnit;

  const stackedBarData = {
    children: [],
    titleY: `${
      getTranslations().graphs[GraphTypes.RBFG].range[
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
        entry: age + sexGroup,
        sortBy: Object.keys(ageGroups).indexOf(ageSexGroup),
        color: colorMapping[foodGroup].color,
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
