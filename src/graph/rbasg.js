import {
  DataTableHeader,
  GraphTypes,
  MeanFlag,
  RbasgDomainFormat,
  sexGroups,
} from "../const.js";
import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry,
} from "../util/graph.js";
import { getTranslations } from "../translation/translation.js";
import {
  formatNumber,
  formatPercent,
  getAgeSexDisplay,
  getExposureUnit,
  getUserModifiedValueText,
} from "../util/data.js";

/**
 * Take in filtered TDS data and return data which has been strictly filtered and formatted
 * for use when comparing results by age-sex group
 *
 * Returns:
 * - An object with the following properties:
 *  - Age group
 *    - Sex group
 *      - ageSexGroup
 *      - consumptionsFlagged: array of food composite descriptons
 *      - consumptionsSuppressed: array of food composite descriptons
 *      - contaminantUnit
 *      - exposure
 *      - numContaminants
 *      - numContaminantsUnderLod
 *      - percentUnderLod
 *      - years: array of years the calculations are for
 *    // Other sexes
 *  // Other age groups
 */
export function getRbasg(tdsData, filters) {
  const rbasgData = {};

  const domain = filters.showByAgeSexGroup
    ? filters.ageSexGroups
    : filters.years;

  domain.forEach((entry) => {
    // Entry is either age-group or year
    rbasgData[entry] = {};
    Object.keys(sexGroups).forEach((sex) => {
      rbasgData[entry][sex] = {
        exposure: 0,
        contaminantUnit: "",
        ageSexGroup: "",
        years: filters.showByAgeSexGroup ? filters.years : [entry],
        consumptionsSuppressed: [],
        consumptionsFlagged: [],
        percentUnderLod: 0,
        numContaminants: 0,
        numContaminantsUnderLod: 0,
      };
      Object.keys(tdsData.consumption).forEach((foodGroup) => {
        Object.keys(tdsData.consumption[foodGroup]).forEach((composite) => {
          const consumptions = tdsData.consumption[foodGroup][composite].filter(
            (row) =>
              filters.ageSexGroups.includes(row.age) &&
              (filters.showByAgeSexGroup ? entry == row.age : true) &&
              sex == row.sex,
          );

          if (consumptions.length == 0) return;

          consumptions.forEach((consumption) => {
            rbasgData[entry][sex].ageSexGroup = consumption.ageSexGroup;

            const consumptionMeanFlag = filters.usePerPersonPerDay
              ? consumption.meanFlagForPerPersonPerDay
              : consumption.meanFlagForPerKgBWPerDay;
            const compositeInfo = getCompositeInfo(consumption);
            if (consumptionMeanFlag == MeanFlag.SUPPRESSED) {
              rbasgData[entry][sex].consumptionsSuppressed.push(compositeInfo);
            } else if (consumptionMeanFlag == MeanFlag.FLAGGED) {
              rbasgData[entry][sex].consumptionsFlagged.push(compositeInfo);
            }

            let numContaminants = 0;
            let sumContaminants = 0;

            const years = filters.showByAgeSexGroup ? filters.years : [entry];
            years.forEach((year) => {
              tdsData.contaminant[year].forEach((contaminant) => {
                if (contaminant.compositeInfo.includes(composite)) {
                  rbasgData[entry][sex].contaminantUnit = contaminant.units;
                  numContaminants++;
                  sumContaminants += getOccurrenceForContaminantEntry(
                    contaminant,
                    filters,
                    entry,
                  );
                  rbasgData[entry][sex].numContaminants++;
                  if (contaminant.occurrence < contaminant.lod) {
                    rbasgData[entry][sex].numContaminantsUnderLod++;
                  }
                }
              });
            });
            const meanOccurrence = sumContaminants / numContaminants || 0;
            const exposure = getContaminantExposure(
              filters.usePerPersonPerDay
                ? consumption.meanGramsPerPersonPerDay
                : consumption.meanGramsPerKgBWPerDay,
              meanOccurrence,
              filters,
              consumption.age,
            );

            rbasgData[entry][sex].exposure += exposure;
          });
        });
      });

      rbasgData[entry][sex].percentUnderLod =
        (rbasgData[entry][sex].numContaminantsUnderLod /
          rbasgData[entry][sex].numContaminants) *
        100 || 0;
    });
  });

  return rbasgData;
}

/**
 * Take in data formatted for comparing results by age-sex group (see function above) and format it to a data table format
 *
 * Returns:
 * - An array of objects adhering to the contract specified in the displayDataTable function of dataTableComponent.js
 */
export function formatRbsagToDataTable(rbasgData, filters) {
  const dataTableData = [];

  Object.values(rbasgData).forEach((ageSexGroup) => {
    Object.values(ageSexGroup).forEach((row) => {
      if (!row.ageSexGroup) {
        return;
      }
      dataTableData.push({
        [DataTableHeader.CHEMICAL]: filters.chemical,
        [DataTableHeader.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
        [DataTableHeader.EXPOSURE]: formatNumber(row.exposure, filters),
        [DataTableHeader.EXPOSURE_UNIT]: getExposureUnit(
          row.contaminantUnit,
          filters,
        ),
        [DataTableHeader.YEARS]: row.years.join(", "),
        [DataTableHeader.PERCENT_UNDER_LOD]: formatPercent(row.percentUnderLod),
        [DataTableHeader.TREATMENT]: filters.lod,
        [DataTableHeader.MODIFIED]: filters.override.list
          .map((override) =>
            getUserModifiedValueText(
              override,
              row.contaminantUnit,
            ),
          )
          .join("; "),
        [DataTableHeader.FLAGGED]: row.consumptionsFlagged.join("; "),
        [DataTableHeader.SUPPRESSED]: row.consumptionsSuppressed.join("; "),
      });
    });
  });
  return dataTableData;
}

/**
 * Take in data formatted for comparing results by age-sex group and format it to grouped bar data
 *
 * Returns:
 * - An object adhering to the contract specified in groupedBar.js
 */
export function formatRbasgToGroupedBar(rbasgData, filters, colorMapping) {
  const contaminantUnit = Object.values(Object.values(rbasgData)[0])[0]
    .contaminantUnit;

  const groupedBarData = {
    children: [],
    titleY: `${getTranslations().graphs[GraphTypes.RBASG].range
      } (${getExposureUnit(contaminantUnit, filters)})`,
    titleX:
      getTranslations().graphs[GraphTypes.RBASG].domain[
      filters.showByAgeSexGroup
        ? RbasgDomainFormat.AGESEX
        : RbasgDomainFormat.YEAR
      ],
  };

  Object.keys(rbasgData).forEach((entry) => {
    Object.keys(rbasgData[entry]).forEach((sex) => {
      const row = rbasgData[entry][sex];
      const sexDisplay = getTranslations().tdsData.values[sex];
      groupedBarData.children.push({
        entry: entry,
        group: sexDisplay,
        value: row.exposure,
        color: colorMapping[sex].color,
        info:
          getTranslations().graphs.info.exposure +
          ": " +
          formatNumber(row.exposure, filters) +
          " " +
          getExposureUnit(contaminantUnit, filters) +
          "\n" +
          (filters.showByAgeSexGroup
            ? getTranslations().graphs.info.ageSexGroup
            : getTranslations().graphs.info.year) +
          ": " +
          (filters.showByAgeSexGroup ? entry + " " + sexDisplay : entry),
      });
    });
  });

  return groupedBarData;
}
