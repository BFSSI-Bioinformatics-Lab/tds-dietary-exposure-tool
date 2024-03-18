import {
  ConsumptionUnits,
  GraphTypes,
  MeanFlag,
  RbasgDomainFormat,
  sexGroups,
} from "../config.js";
import {
  getCompositeInfo,
  getContaminentExposure,
  getOccurenceForContaminentEntry,
} from "../util/graph.js";
import { getTranslations } from "../translation/translation.js";
import { formatNumber, formatPercent } from "../util/data.js";

/**
 *
 * Take in TDS data and return data which has been strictly filtered and formatted for use when comparing age-sex groups
 *
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
        contaminentUnits: "",
        ageSexGroup: "",
        years: filters.showByAgeSexGroup ? filters.years : [entry],
        consumptionsSuppressed: [],
        consumptionsFlagged: [],
        percentUnderLod: 0,
        numContaminents: 0,
        numContaminentsUnderLod: 0,
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

            let numContaminents = 0;
            let sumContaminents = 0;

            const years = filters.showByAgeSexGroup ? filters.years : [entry];
            years.forEach((year) => {
              tdsData.contaminent[year].forEach((contaminent) => {
                if (contaminent.compositeInfo.includes(composite)) {
                  rbasgData[entry][sex].contaminentUnits = contaminent.units;
                  numContaminents++;
                  sumContaminents += getOccurenceForContaminentEntry(
                    contaminent,
                    filters,
                    entry,
                  );
                  rbasgData[entry][sex].numContaminents++;
                  if (contaminent.occurence < contaminent.lod) {
                    rbasgData[entry][sex].numContaminentsUnderLod++;
                  }
                }
              });
            });
            const meanOccurence = sumContaminents / numContaminents || 0;
            const exposure = getContaminentExposure(
              filters.usePerPersonPerDay
                ? consumption.meanGramsPerPersonPerDay
                : consumption.meanGramsPerKgBWPerDay,
              meanOccurence,
              consumption,
              filters,
            );

            rbasgData[entry][sex].exposure += exposure;
          });
        });
      });

      rbasgData[entry][sex].percentUnderLod =
        (rbasgData[entry][sex].numContaminentsUnderLod /
          rbasgData[entry][sex].numContaminents) *
        100 || 0;
    });
  });
  return rbasgData;
}

/**
 *
 * Take in data formatted for comparing age-sex groups and format it to data table format
 *
 */
export function formatRbsagToDataTable(data, filters) {
  const dataTableData = [];

  const headers = getTranslations().dataTable.headers;

  Object.values(data).forEach((ageSexGroup) => {
    Object.values(ageSexGroup).forEach((row) => {
      if (!row.ageSexGroup) {
        return;
      }
      dataTableData.push({
        [headers.chemical]: filters.chemical,
        [headers.ageSexGroup]: row.ageSexGroup,
        [headers.exposure]: formatNumber(row.exposure),
        [headers.exposureUnit]:
          row.contaminentUnits.split("/")[0] +
          getTranslations().misc.consumptionUnitsShort[
          filters.usePerPersonPerDay
            ? ConsumptionUnits.PERSON
            : ConsumptionUnits.KGBW
          ],
        [headers.years]: row.years.join(", "),
        [headers.percentUnderLod]: formatPercent(row.percentUnderLod),
        [headers.treatment]: filters.lod,
        [headers.flagged]: row.consumptionsFlagged.join(", "),
        [headers.suppressed]: row.consumptionsSuppressed.join(", "),
      });
    });
  });
  return dataTableData;
}

/**
 *
 * Take in data formatted for comparing age-sex groups and format it to grouped bar data
 *
 */
export function formatRbasgToGroupedBar(rbasgData, filters, colorMapping) {
  const contaminentUnits = Object.values(Object.values(rbasgData)[0])[0]
    .contaminentUnits;
  const consumptionUnits =
    getTranslations().misc.consumptionUnitsShort[
    filters.usePerPersonPerDay
      ? ConsumptionUnits.PERSON
      : ConsumptionUnits.KGBW
    ];
  const groupedBarData = {
    children: [],
    titleY: `${getTranslations().graphs[GraphTypes.RBASG].range} (${contaminentUnits.split("/")[0]
      }${consumptionUnits})`,
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
      groupedBarData.children.push({
        entry: entry,
        group: sex,
        value: row.exposure,
        color: colorMapping[sex],
        info:
          getTranslations().graphs.info.exposure +
          ": " +
          formatNumber(row.exposure) +
          " " +
          contaminentUnits.split("/")[0] +
          consumptionUnits +
          "\n" +
          (filters.showByAgeSexGroup
            ? getTranslations().graphs.info.ageSexGroup
            : getTranslations().graphs.info.year) +
          ": " +
          (filters.showByAgeSexGroup ? entry + " " + sex : entry),
      });
    });
  });

  return groupedBarData;
}
