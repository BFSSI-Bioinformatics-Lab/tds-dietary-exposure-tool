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
  DictTools,
  TableTools
} from "../util/data.js";
import { breakDownFormatNumbers, getBreakdownDistribution, getBreakdownDistribWebStr, getBreakdownWebStr, groupContaminantsByChecmical } from "../data/dataTranslator.js";


// getChemicalRbasg(tdsData, filters): Retrieves the data for results by age-sex group
//  for a particular chemical
function getChemicalRbasg(tdsData, filters) {
  const rbasgData = {};
  const domain = filters.showByAgeSexGroup
    ? filters.ageGroups
    : filters.years;

  domain.forEach((entry) => {
    // Entry is either age-group or year
    rbasgData[entry] = {};
    Object.keys(sexGroups).forEach((sex) => {
      const rbasgDataRow = rbasgData[entry][sex] = {
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

        contaminantsTested: new Set()
      };

      rbasgData[entry][sex] = rbasgDataRow;

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
            rbasgDataRow.ageSexGroup = consumption.ageSexGroup;

            const consumptionMeanFlag = filters.usePerPersonPerDay
              ? consumption.meanFlagForPerPersonPerDay
              : consumption.meanFlagForPerKgBWPerDay;
            const compositeInfo = getCompositeInfo(consumption);
            if (consumptionMeanFlag == MeanFlag.SUPPRESSED) {
              rbasgDataRow.consumptionsSuppressed.push(compositeInfo);
            } else if (consumptionMeanFlag == MeanFlag.FLAGGED) {
              rbasgDataRow.consumptionsFlagged.push(compositeInfo);
            } else if (consumptionMeanFlag == MeanFlag.SUPPRESSED_HIGH_CV) {
              rbasgDataRow.consumptionsSuppressed.push(compositeInfo);
              rbasgDataRow.consumptionsSuppressedWithHighCv.push(compositeInfo);
            }

            let numContaminantsTested = 0;
            let sumContaminants = 0;
            let compositeFound = 0;

            const years = filters.showByAgeSexGroup ? filters.years : [entry];
            years.forEach((year) => {
              if (tdsData.contaminant[year] == undefined) return;

              tdsData.contaminant[year].forEach((contaminant) => {
                if (!contaminant.compositeInfo.includes(composite)) return;

                rbasgDataRow.contaminantUnit = contaminant.units;
                if (filters.lod != LODs.Exclude || contaminant.occurrence != 0) {
                  numContaminantsTested++;
                }

                sumContaminants += getOccurrenceForContaminantEntry(
                  contaminant,
                  filters,
                  entry,
                );

                rbasgDataRow.numContaminantsTested++;
                rbasgDataRow.contaminantsTested.add(contaminant.id);

                if (contaminant.occurrence < contaminant.lod) {
                  rbasgDataRow.numContaminantsUnderLod++;
                }

                compositeFound = 1;
              });
            });

            rbasgDataRow.numCompositesTested += compositeFound;

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

            rbasgDataRow.exposure += exposure;
          });
        });
      });
    });
  });

  return rbasgData;
}

function getRbasgAggregates(rbasgData, tdsData) {

  // get the total unique number of composites
  const composites = new Set();
  TableTools.forGroup(tdsData.consumption, ["foodGroup", "composite"], (keys, values) => {
    if (composites.has(keys.composite)) return;
    composites.add(keys.composite);
  });

  // get the number of contaminants tested
  const contaminantsTested = {};
  TableTools.forGroup(rbasgData, ["chemical", "entry", "sex"], (keys, values) => {
    const row = values.sex;

    if (contaminantsTested[keys.entry] == undefined) contaminantsTested[keys.entry] = {};
    if (contaminantsTested[keys.entry][keys.sex] == undefined) contaminantsTested[keys.entry][keys.sex] = new Set();

    SetTools.union(contaminantsTested[keys.entry][keys.sex], row.contaminantsTested, false);
  });

  const numComposites = composites.size;

  TableTools.forGroup(rbasgData, ["chemical", "entry", "sex"], (keys, values) => {
    const row = values.sex;
    row.percentNotTested = ((numComposites - row.numCompositesTested) / numComposites) * 100;
    row.percentUnderLod = ((row.numContaminantsUnderLod / contaminantsTested[keys.entry][keys.sex].size) * 100) || 0;
  });

  return rbasgData;
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
    let result = getChemicalRbasg(tdsData, filters);
    result = getRbasgAggregates({[filters.chemical]: result}, tdsData);
    return result[filters.chemical];
  }

  const allContaminants = tdsData.contaminant;
  const groupedContaminants = groupContaminantsByChecmical(tdsData.contaminant);
  let resultByChemicals = {};
  const currentFilters = structuredClone(filters);


  for (const chemical in groupedContaminants) {
    currentFilters.chemical = chemical;
    tdsData.contaminant = groupedContaminants[chemical];
    resultByChemicals[chemical] = getChemicalRbasg(tdsData, currentFilters);
  }

  tdsData.contaminant = allContaminants;
  resultByChemicals = getRbasgAggregates(resultByChemicals, tdsData);
  return resultByChemicals;
}

/**
 * Take in data formatted for comparing results by age-sex group (see function above) and format it to a data table format
 *
 * Returns:
 * - An array of objects adhering to the contract specified in the displayDataTable function of dataTableComponent.js
 */
export function formatRbsagToDataTable(rbasgData, filters) {
  let dataTableData = {};
  const isRadionuclide = filters.chemicalGroup.trim() == Translation.translate("tdsData.values.radionuclides");
  const isTotalRadionuclide = filters.chemical == Translation.translate("tdsData.values.totalRadionuclides");

  if (!isTotalRadionuclide) {
    rbasgData = {[filters.chemical]: rbasgData}
  }

  for (const chemical in rbasgData) {
    const chemicalRbasgData = rbasgData[chemical];

    Object.values(chemicalRbasgData).forEach((ageSexGroup) => {
      Object.values(ageSexGroup).forEach((row) => {
        if (!row.ageSexGroup) {
          return;
        }

        const dataTableRow = dataTableData[row.ageSexGroup];
        if (dataTableRow == undefined) {
          dataTableData[row.ageSexGroup] = {
            [DataTableHeader.CHEMICAL]: filters.chemical,
            [DataTableHeader.AGE_SEX_GROUP]: getAgeSexDisplay(row.ageSexGroup),
            [DataTableHeader.EXPOSURE]: {[chemical]: row.exposure},
            [DataTableHeader.EXPOSURE_UNIT]: {[chemical]: getExposureUnit(row.contaminantUnit, filters)},
            [DataTableHeader.YEARS]: new Set(row.years),
            [DataTableHeader.PERCENT_NOT_TESTED]: {[chemical]: row.percentNotTested},
            [DataTableHeader.PERCENT_UNDER_LOD]: {[chemical]: row.percentUnderLod},
            [DataTableHeader.TREATMENT]: filters.lod,
            [DataTableHeader.MODIFIED]: filters.override.list.map((override) => getUserModifiedValueText(override, row.contaminantUnit)).join("; "),
            [DataTableHeader.FLAGGED]: new Set(row.consumptionsFlagged),
            [DataTableHeader.SUPPRESSED]: new Set(row.consumptionsSuppressed),
            [DataTableHeader.INCLUDED_SUPPRESSED]: new Set(filters.useSuppressedHighCvValues ? row.consumptionsSuppressedWithHighCv : [])
          }
          return;
        }

        dataTableRow[DataTableHeader.EXPOSURE][chemical] = row.exposure;
        dataTableRow[DataTableHeader.EXPOSURE_UNIT][chemical] = getExposureUnit(row.contaminantUnit, filters);
        SetTools.union(dataTableRow[DataTableHeader.YEARS], new Set(row.years), false);
        dataTableRow[DataTableHeader.PERCENT_NOT_TESTED][chemical] = row.percentNotTested;
        dataTableRow[DataTableHeader.PERCENT_UNDER_LOD][chemical] = row.percentUnderLod;
        SetTools.union(dataTableRow[DataTableHeader.FLAGGED], new Set(row.consumptionsFlagged), false);
        SetTools.union(dataTableRow[DataTableHeader.SUPPRESSED], new Set(row.consumptionsSuppressed), false);
        SetTools.union(dataTableRow[DataTableHeader.INCLUDED_SUPPRESSED], new Set(filters.useSuppressedHighCvValues ? row.consumptionsSuppressedWithHighCv : []));
      });
    });
  }

  dataTableData = Object.values(dataTableData);
  for (const row of dataTableData) {
    if (!isTotalRadionuclide) {
      row[DataTableHeader.EXPOSURE] = formatNumber(row[DataTableHeader.EXPOSURE][filters.chemical], filters);
      row[DataTableHeader.PERCENT_NOT_TESTED] = DictTools.toWebStr(row[DataTableHeader.PERCENT_NOT_TESTED]);
      row[DataTableHeader.PERCENT_UNDER_LOD] = DictTools.toWebStr(row[DataTableHeader.PERCENT_UNDER_LOD]);
    } else {
      row[DataTableHeader.EXPOSURE] = getBreakdownDistribWebStr({breakDown: row[DataTableHeader.EXPOSURE], formatValFunc: (key, val) => Translation.translateScientificNum(val)});
      row[DataTableHeader.PERCENT_NOT_TESTED] = getBreakdownWebStr({breakDown: row[DataTableHeader.PERCENT_NOT_TESTED], formatValFunc: (key, val) => formatPercent(val)});
      row[DataTableHeader.PERCENT_UNDER_LOD] = getBreakdownWebStr({breakDown: row[DataTableHeader.PERCENT_UNDER_LOD], formatValFunc: (key, val) => formatPercent(val)});
    }

    row[DataTableHeader.EXPOSURE_UNIT] = DictTools.toWebStr(row[DataTableHeader.EXPOSURE_UNIT]);

    row[DataTableHeader.YEARS] = Array.from(row[DataTableHeader.YEARS]).join(", ");
    row[DataTableHeader.FLAGGED] = Array.from(row[DataTableHeader.FLAGGED]).join("; ");
    row[DataTableHeader.SUPPRESSED] = Array.from(row[DataTableHeader.SUPPRESSED]).join("; ");
    row[DataTableHeader.INCLUDED_SUPPRESSED] = Array.from(row[DataTableHeader.INCLUDED_SUPPRESSED]).join("; ");
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

  const contaminantUnit = Object.values(Object.values(Object.values(rbasgData)[0])[0])[0].contaminantUnit;
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
