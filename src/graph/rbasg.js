import {
  DataTableHeader,
  GraphTypes,
  LODs,
  MeanFlag,
  RbasgDomainFormat,
  sexGroups,
  getTranslations,
  Translation
} from "../const.js";
import {
  getCompositeInfo,
  getContaminantExposure,
  getOccurrenceForContaminantEntry,
} from "../util/graph.js";
import {
  formatNumber,
  formatPercent,
  getAgeAndSex,
  getAgeSexDisplay,
  getExposureUnit,
  getUserModifiedValueText,
  SetTools,
} from "../util/data.js";


// getChemicalRbasg(tdsData, filters): Retrieves the data for results by age-sex group
//  for a particular chemical
function getChecmicalRbasg(tdsData, filters) {
  const rbasgData = {};
  const domain = filters.showByAgeSexGroup
    ? filters.ageGroups
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
        consumptionsSuppressedWithHighCv: [],
        percentUnderLod: 0,
        numContaminantsTested: 0,
        numCompositesTested: 0,
        numContaminantsUnderLod: 0,
      };
      Object.keys(tdsData.consumption).forEach((foodGroup) => {
        Object.keys(tdsData.consumption[foodGroup]).forEach((composite) => {
          const consumptions = tdsData.consumption[foodGroup][composite].filter(
            (row) => {
              return filters.ageSexGroups.includes(row.ageSexGroup) &&
              (filters.showByAgeSexGroup ? entry == row.age : true) &&
              sex == row.sex
            }
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
            } else if (consumptionMeanFlag == MeanFlag.SUPPRESSED_HIGH_CV) {
              rbasgData[entry][sex].consumptionsSuppressed.push(compositeInfo);
              rbasgData[entry][sex].consumptionsSuppressedWithHighCv.push(
                compositeInfo,
              );
            }

            let numContaminantsTested = 0;
            let sumContaminants = 0;
            let compositeFound = 0;

            const years = filters.showByAgeSexGroup ? filters.years : [entry];
            years.forEach((year) => {
              if (tdsData.contaminant[year] == undefined) return;

              tdsData.contaminant[year].forEach((contaminant) => {
                if (!contaminant.compositeInfo.includes(composite)) return;

                rbasgData[entry][sex].contaminantUnit = contaminant.units;
                if (filters.lod != LODs.Exclude || contaminant.occurrence != 0) {
                  numContaminantsTested++;
                }

                sumContaminants += getOccurrenceForContaminantEntry(
                  contaminant,
                  filters,
                  entry,
                );

                rbasgData[entry][sex].numContaminantsTested++;

                if (contaminant.occurrence < contaminant.lod) {
                  rbasgData[entry][sex].numContaminantsUnderLod++;
                }

                compositeFound = 1;
              });
            });

            rbasgData[entry][sex].numCompositesTested += compositeFound;

            const meanOccurrence = sumContaminants / numContaminantsTested || 0;

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
              meanOccurrence,
              filters,
              consumption.age,
            );

            rbasgData[entry][sex].exposure += exposure;
          });
        });
      });

      const numComposites = Object.values(tdsData.consumption).reduce(
        (acc, row) => acc + Object.values(row).length,
        0,
      );

      rbasgData[entry][sex].percentUnderLod =
        (rbasgData[entry][sex].numContaminantsUnderLod /
          rbasgData[entry][sex].numContaminantsTested) *
          100 || 0;

      rbasgData[entry][sex].percentNotTested =
        ((numComposites - rbasgData[entry][sex].numCompositesTested) /
          numComposites) *
        100;
    });
  });

  return rbasgData;
}

// groupContaminantsByChemical(contaminant): Groups the contaminants by their chemicals
function groupContaminantsByChecmical(contaminant) {
  const result = {};

  for (const year in contaminant) {
    for (const row of contaminant[year]) {
      const chemical = row.chemical;
      if (result[chemical] == undefined) result[chemical] = {};
      if (result[chemical][year] == undefined) result[chemical][year] = [];

      result[chemical][year].push(row);
    }
  }

  return result;
}

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
 *      - consumptionsSuppressedWithHighCv: array of food composite descriptions
 *      - contaminantUnit
 *      - exposure
 *      - numContaminantsTested
 *      - numCompositesTested
 *      - numContaminantsUnderLod
 *      - percentUnderLod
 *      - years: array of years the calculations are for
 *    // Other sexes
 *  // Other age groups
 */
export function getRbasg(tdsData, filters) {
  if (filters.chemical != Translation.translate("tdsData.values.totalRadionuclides")) {
    return getChecmicalRbasg(tdsData, filters);
  }

  const allContaminants = tdsData.contaminant;
  const groupedContaminants = groupContaminantsByChecmical(tdsData.contaminant);
  const resultByChemicals = {};
  const currentFilters = structuredClone(filters);


  for (const chemical in groupedContaminants) {
    currentFilters.chemical = chemical;
    tdsData.contaminant = groupedContaminants[chemical];
    resultByChemicals[chemical] = getChecmicalRbasg(tdsData, currentFilters);
  }

  tdsData.contaminant = allContaminants;
  return resultByChemicals;
}

/**
 * Take in data formatted for comparing results by age-sex group (see function above) and format it to a data table format
 *
 * Returns:
 * - An array of objects adhering to the contract specified in the displayDataTable function of dataTableComponent.js
 */
export function formatRbsagToDataTable(rbasgData, filters) {
  const dataTableData = [];

  if (filters.chemical != Translation.translate("tdsData.values.totalRadionuclides")) {
    rbasgData = {[filters.chemical]: rbasgData}
  }

  for (const chemical in rbasgData) {
    const chemicalRbasgData = rbasgData[chemical];

    Object.values(chemicalRbasgData).forEach((ageSexGroup) => {
      Object.values(ageSexGroup).forEach((row) => {
        if (!row.ageSexGroup) {
          return;
        }

        dataTableData.push({
          [DataTableHeader.CHEMICAL]: chemical,
          [DataTableHeader.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
          [DataTableHeader.EXPOSURE]: formatNumber(row.exposure, filters),
          [DataTableHeader.EXPOSURE_UNIT]: getExposureUnit(
            row.contaminantUnit,
            filters,
          ),
          [DataTableHeader.YEARS]: row.years.join(", "),
          [DataTableHeader.PERCENT_NOT_TESTED]: formatPercent(
            row.percentNotTested,
          ),
          [DataTableHeader.PERCENT_UNDER_LOD]: formatPercent(row.percentUnderLod),
          [DataTableHeader.TREATMENT]: filters.lod,
          [DataTableHeader.MODIFIED]: filters.override.list
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
  }

  return dataTableData;
}


function getRbasgGraphInfo(filters, exposure, entry, sexDisplay, exposureUnit) {
  return  Translation.translate("graphs.info.exposure") + ": " +
          formatNumber(exposure, filters) + " " +
          exposureUnit + "\n" +
          Translation.translate(filters.showByAgeSexGroup ? "graphs.info.ageSexGroup" : "graphs.info.year") + ": " +
          (filters.showByAgeSexGroup ? entry + " " + sexDisplay : entry);
}

/**
 * Take in data formatted for comparing results by age-sex group and format it to grouped bar data
 *
 * Returns:
 * - An object adhering to the contract specified in groupedBar.js
 */
export function formatRbasgToGroupedBar(rbasgData, filters, colorMapping) {
  if ($.isEmptyObject(rbasgData)) return {};

  if (filters.chemical != Translation.translate("tdsData.values.totalRadionuclides")) {
    rbasgData = {[filters.chemical]: rbasgData}
  }

  const contaminantUnit = Object.values(Object.values(rbasgData)[0])[0].contaminantUnit;
  const exposureUnit = getExposureUnit(contaminantUnit, filters);

  const groupedBarData = {
    children: [],
    titleY: `${
      getTranslations().graphs[GraphTypes.RBASG].range
    } (${exposureUnit})`,
    titleX:
      getTranslations().graphs[GraphTypes.RBASG].domain[
        filters.showByAgeSexGroup
          ? RbasgDomainFormat.AGESEX
          : RbasgDomainFormat.YEAR
      ],
  };

  const graphData = {};

  for (const chemical in rbasgData) {
    const chemicalRbasgData = rbasgData[chemical];

    Object.keys(chemicalRbasgData).forEach((entry) => {
      Object.keys(chemicalRbasgData[entry]).forEach((sex) => {
        const row = chemicalRbasgData[entry][sex];
        const sexDisplay = getTranslations().misc.sexGroups[sex];

        const graphDataId = `${entry}${sex}`;
        const graphDataEntry = graphData[graphDataId];

        if (graphDataEntry == undefined) {
          graphData[graphDataId] = {
            entry: entry,
            group: sexDisplay,
            value: row.exposure,
            color: colorMapping[sex].color,
            info: getRbasgGraphInfo(filters, row.exposure, entry, sexDisplay, exposureUnit)
          }
          return;
        }

        graphDataEntry.value += row.exposure;
        graphDataEntry.info = getRbasgGraphInfo(filters, graphDataEntry.value, entry, sexDisplay, exposureUnit);
      });
    });
  }

  groupedBarData.children = Object.values(graphData);
  return groupedBarData;
}
