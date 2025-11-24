import {
  getContaminantFiles,
  YearMin,
  YearMax,
  MeanFlag,
  DataColumn,
  ConsumptionUnits,
  getConsumptionFiles,
  PFASGroupings,
  getTranslations,
  Translation
} from "../const.js";
import { readCSV } from "./dataLoader.js";
import { formatDownloadName } from "./dataDownloader.js";
import {
  getAgeSexGroupInfoForConsumptionEntry,
  getCompositeDescForConsumptionEntry,
  getCompositeForConsumptionEntry,
  getCompositeInfoForContaminantEntry,
  getMeanFlagForConsumptionEntry,
  getOccurrenceForContaminantEntry,
  getUnitForContaminantEntry,
  getYearForContaminantEntry,
  DictTools,
  formatNumber,
  formatPercent
} from "../util/data.js";
import { getActiveFilters } from "../ui/filter.js";

/**
 * An object containing TDS data in a structured format with the following properties:
 *   - contaminant
 *     - chemicalGroup
 *       - chemical
 *         - year: Array of contaminant entries for a specific chemical group, chemical, and year
 *           - chemicalGroup
 *           - chemical
 *           - year
 *           - compositeInfo: The sample code and product description could both contain the food composite.
 *                            They should both be checked when linking consumption and contaminant.
 *                            These values will be concatenated and stored in compositeInfo.
 *           - occurrence
 *           - units
 *           - lod: When the occurrence value is 0, the user may be able to adjust that value based upon the Level of Detection (LOD).
 *                  If the LOD is null, use the MDL.
 *         // ... (more years)
 *       // ... (more chemicals)
 *     // ... (more chemical groups)
 *
 *   - consumption
 *     - foodGroup
 *       - composite: Array of consumption entries for a specific food group and food composite.
 *         - age
 *         - ageSexGroup
 *         - composite: The code for a given food composite. For example: "FF04".
 *                      Many foods can fall into one food composite. Every food composite belongs to a unique food group.
 *         - compositeDesc: The human-readable form of a composite. For example: "Cake".
 *         - foodGroup: Example: "Breads & Grains"
 *         - meanFlagForPerKgBWPerDay
 *         - meanGramsPerKgBWPerDay
 *         - meanFlagForPerPersonPerDay
 *         - meanGramsPerPersonPerDay
 *         - sex
 *       // ... (more composites)
 *     // ... (more food groups)
 */
export let tdsData;

/**
 *
 * Load Total Diet Study Data into a known structured format
 *
 */
export async function loadTdsData() {
  const data = {
    contaminant: {},
    consumption: {},
  };

  // Fill contaminant data
  for (const file of getContaminantFiles()) {
    const raw = (await readCSV(file))?.rows;
    const chemicalGroup =
      raw[0][getTranslations().tdsData.headers[DataColumn.CHEMICAL_GROUP]]; // A given file will only be for a specific chemical group
    data.contaminant[chemicalGroup] ??= {};
    raw.forEach((row) => {
      const year = getYearForContaminantEntry(row);
      if (year < YearMin || year > YearMax) {
        return;
      }

      const chemical =
        row[getTranslations().tdsData.headers[DataColumn.CHEMICAL]];

      data.contaminant[chemicalGroup][chemical] ??= {};
      data.contaminant[chemicalGroup][chemical][year] ??= [];

      data.contaminant[chemicalGroup][chemical][year].push({
        chemicalGroup,
        chemical,
        year,
        compositeInfo: getCompositeInfoForContaminantEntry(row),
        occurrence: getOccurrenceForContaminantEntry(row),
        units: getUnitForContaminantEntry(
          row[getTranslations().tdsData.headers[DataColumn.UNIT]],
        ),
        lod: Number(
          row[getTranslations().tdsData.headers[DataColumn.LOD]] ||
            row[getTranslations().tdsData.headers[DataColumn.MDL]],
        ),
      });
    });
  }

  let currentFoodGroup = null;

  // Prepare consumption data with food groups and relative composites
  (await readCSV(getConsumptionFiles().desc)).rows.forEach((row) => {
    const compositeDescription =
      row[getTranslations().tdsData.headers[DataColumn.MAPPING_COMPOSITE_DESC]];
    const compositeContent =
      row[
        getTranslations().tdsData.headers[DataColumn.MAPPING_COMPOSITE_CONTENT]
      ];
    const composite =
      row[
        getTranslations().tdsData.headers[DataColumn.MAPPING_COMPOSITE_CODE]
      ].toUpperCase();
    if (!compositeDescription && !compositeContent) {
      // Entry is a food group if other entries are empty (just the way the data is formatted)
      currentFoodGroup =
        row[
          getTranslations().tdsData.headers[DataColumn.MAPPING_COMPOSITE_CODE]
        ];
      data.consumption[currentFoodGroup] = {};
    } else if (composite) {
      // Entry is a food composite mapping for the current food group (until the next food group is encountered)
      if (composite != "PP11" && composite != "PP13") {
        data.consumption[currentFoodGroup][composite] = [];
      }
    }
  });

  // Fill consumption data from for mean grams per person per day
  (await readCSV(getConsumptionFiles().perPerson)).rows.forEach((row) => {
    // Only considering data surveyed for all people
    if (
      row[getTranslations().tdsData.headers[DataColumn.POPULATION_GROUP]] !=
      getTranslations().tdsData.values.allPeople
    ) {
      return;
    }

    const composite = getCompositeForConsumptionEntry(row);

    // Find which entry in the consumption data has the composite
    for (const foodGroup of Object.keys(data.consumption)) {
      if (data.consumption[foodGroup][composite]) {
        const [ageSexGroup, age, sex] = getAgeSexGroupInfoForConsumptionEntry(
          row[getTranslations().tdsData.headers[DataColumn.POPULATION]],
        );
        if (
          data.consumption[foodGroup][composite].find(
            (otherConsumption) => otherConsumption.ageSexGroup == ageSexGroup,
          )
        ) {
          break; // Don't double count rows for a given age-sex group
        }
        const meanGramsPerPersonPerDay =
          Number(
            row[getTranslations().tdsData.headers[DataColumn.MEAN_G_PPPD]],
          ) || 0;
        data.consumption[foodGroup][composite].push({
          age,
          ageSexGroup,
          composite,
          compositeDesc: getCompositeDescForConsumptionEntry(
            row[getTranslations().tdsData.headers[DataColumn.COMPOSITE_DESC]],
          ),
          foodGroup,
          meanFlagForPerKgBWPerDay: MeanFlag.NONE,
          meanGramsPerKgBWPerDay: 0, // Fill in in the next function
          meanFlagForPerPersonPerDay: getMeanFlagForConsumptionEntry(
            row[getTranslations().tdsData.headers[DataColumn.MEAN_FLAG]],
            meanGramsPerPersonPerDay,
          ),
          meanGramsPerPersonPerDay,
          sex,
        });
        break; // There is only one place this composite can go
      }
    }
  });

  // Fill the consumption data with values for mean grams per kg bw per day (these values located in different file)
  (await readCSV(getConsumptionFiles().perKgBw)).rows.forEach((row) => {
    if (
      row[getTranslations().tdsData.headers[DataColumn.POPULATION_GROUP]] !=
      getTranslations().tdsData.values.allPeople
    ) {
      return;
    }

    const composite = getCompositeForConsumptionEntry(row);

    // Must use the age-sex group to find the matching entry in the data for this row
    const [ageSexGroup, _, __] = getAgeSexGroupInfoForConsumptionEntry(
      row[getTranslations().tdsData.headers[DataColumn.POPULATION]],
    );

    // Find which entry in the consumption data has the composite
    for (const foodGroup of Object.keys(data.consumption)) {
      if (data.consumption[foodGroup][composite]) {
        data.consumption[foodGroup][composite].forEach((consumptionRow) => {
          if (consumptionRow.ageSexGroup == ageSexGroup) {
            const meanGramsPerKgBWPerDay =
              Number(
                row[
                  getTranslations().tdsData.headers[DataColumn.MEAN_G_PKGBWPD]
                ],
              ) || 0;
            consumptionRow.meanGramsPerKgBWPerDay = meanGramsPerKgBWPerDay;
            consumptionRow.meanFlagForPerKgBWPerDay =
              getMeanFlagForConsumptionEntry(
                row[getTranslations().tdsData.headers[DataColumn.MEAN_FLAG]],
                meanGramsPerKgBWPerDay,
              );
          }
        });
      }
    }
  });

  // Create additional PFAS groupings

  const pfasData = data.contaminant[getTranslations().tdsData.values.PFAS];
  if (pfasData) {
    Object.keys(PFASGroupings).forEach((pfasGrouping) => {
      pfasData[getTranslations().tdsData.values.PFASGroupings[pfasGrouping]] =
        {};
      const pfasGroupingData =
        pfasData[getTranslations().tdsData.values.PFASGroupings[pfasGrouping]];

      Object.keys(pfasData)
        .filter((pfas) =>
          getTranslations().tdsData.values.PFASMapping[pfasGrouping].includes(
            pfas,
          ),
        )
        .forEach((pfas) => {
          Object.keys(pfasData[pfas]).forEach((year) => {
            pfasGroupingData[year] ??= [];
            pfasData[pfas][year].forEach((pfasContaminant) => {
              let pfasGroupingDataForContaminant = pfasGroupingData[year].find(
                (pfasGroupingContaminant) =>
                  pfasGroupingContaminant.compositeInfo ==
                  pfasContaminant.compositeInfo,
              );
              if (pfasGroupingDataForContaminant) {
                pfasGroupingDataForContaminant.occurrence +=
                  pfasContaminant.occurrence;
                pfasGroupingDataForContaminant.lod += pfasContaminant.lod;
              } else {
                pfasGroupingData[year].push({
                  ...pfasContaminant,
                  chemicalGroup:
                    getTranslations().tdsData.values.PFASGroupings[
                      pfasGrouping
                    ],
                });
              }
            });
          });
        });
    });
  }

  tdsData = data;
}

/**
 * Load all consumption data into a raw format and filters based on the current filters.
 * This function is useful for downloading raw data for a specific graph (the data must be in raw format but still needs to be filtered).
 *
 * Returns:
 * - A promise that resolves to an array of objects, where each entry represents a file
 *   - rows: Array of raw data for consumption
 *   - filename: Formatted filename
 */
export async function getRawFilteredConsumptionData() {
  const filters = getActiveFilters();
  const ageSexGroups = new Set(filters.ageSexGroups);
  const tdsAllPeople = Translation.translate("tdsData.values.allPeople");

  let filtered = [];

  for (const fileInfo of [
    {
      file: getConsumptionFiles().perPerson,
      filename:
        getTranslations().dataTable.exportNames[ConsumptionUnits.PERSON],
    },
    {
      file: getConsumptionFiles().perKgBw,
      filename: getTranslations().dataTable.exportNames[ConsumptionUnits.KGBW],
    },
  ]) {
    let data = {};
    data.rows = (await readCSV(fileInfo.file)).rows.filter((row) => {
      const [ageSexGroup, age, _] = getAgeSexGroupInfoForConsumptionEntry(
        row[getTranslations().tdsData.headers[DataColumn.POPULATION]],
      );

      const populationGroup = row[getTranslations().tdsData.headers[DataColumn.POPULATION_GROUP]];
      const isAllPeople = populationGroup == tdsAllPeople;

      if (!isAllPeople) return false;
      return ageSexGroups.has(ageSexGroup);
    });

    data.filename = fileInfo.filename;
    data.csvFilename = formatDownloadName(data.filename);
    filtered.push(data);
  }

  return filtered;
}

/**
 * Load all contaminant data into a raw format and filter based on the current filters.
 * This function is useful for downloading raw data for a specific graph.
 * The data must be in raw format but still needs to be filtered.
 *
 * Returns:
 * - A promise that resolves to an array of objects, where each entry represents a file
 *   - rows: Array of raw data for contaminants
 *   - filename: Formatted filename
 */
export async function getRawFilteredContaminantData() {
  const filters = getActiveFilters();

  let data = {
    filename: filters.chemicalGroup + " - " + filters.chemical,
    rows: [],
    csvFilename: ""
  };

  for (const file of getContaminantFiles()) {
    let rows = (await readCSV(file)).rows;
    const chemicalGroup =
      rows[0][getTranslations().tdsData.headers[DataColumn.CHEMICAL_GROUP]];
    if (chemicalGroup != filters.chemicalGroup) {
      continue;
    }

    const pfasGrouping = Object.keys(PFASGroupings).find(
      (grouping) =>
        getTranslations().tdsData.values.PFASGroupings[grouping] ==
        filters.chemical,
    );

    rows
      .filter((row) => {
        const chemical =
          row[getTranslations().tdsData.headers[DataColumn.CHEMICAL]];

        if (pfasGrouping) {
          return (
            getTranslations().tdsData.values.PFASMapping[pfasGrouping].includes(
              chemical,
            ) && filters.years.includes(getYearForContaminantEntry(row))
          );
        } else {
          return (
            row[getTranslations().tdsData.headers[DataColumn.CHEMICAL]] ==
              filters.chemical &&
            filters.years.includes(getYearForContaminantEntry(row))
          );
        }
      })
      .forEach((row) => data.rows.push(row));
  }

  data.csvFilename = formatDownloadName(data.filename);
  return [data];
}


// groupContaminantsByChemical(contaminant): Groups the contaminants by their chemicals
export function groupContaminantsByChecmical(contaminant) {
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

// breakDownFormatNumbers(breakDown, filters): Formats all the values in some breakdown in a table cell to numbers
export function breakDownFormatNumbers(breakDown, filters) {
    for (const key in breakDown) {
      breakDown[key] = formatNumber(breakDown[key], filters);
    }

    return breakDown;
}

// getBreakdownDistribution(breakdown): Retrieves the distribution from some breakdown in some cell of a table
export function getBreakdownDistribution(breakDown) {
    let distribution = DictTools.getDistribution(breakDown);
    for (const chemical in distribution) {
      distribution[chemical] = formatPercent(distribution[chemical] *  100);
    }

    return DictTools.merge([breakDown, distribution], {0: "value", 1: "distribution"});
}

// getBreakdownWebStr(breakdown, includeTotal): Retrieves the string representation of some breakdown in some cell of a table
export function getBreakdownWebStr({breakDown, includeTotal = true, formatValFunc = null, totalFormatValFunc = null,
                                    sort = -1, limit = 5, filter = null, getBreakdownVal = null, getTotalVal = null,
                                    totalFormatPercentFunc = null}) {
  if (formatValFunc == null) {
    formatValFunc = (key, val) => val;
  }

  if (totalFormatValFunc === null) {
    totalFormatValFunc = formatValFunc;
  } else if (totalFormatValFunc === undefined) {
    totalFormatValFunc = (key, val) => val;
  }

  if (totalFormatPercentFunc === null) {
    totalFormatPercentFunc = (val) => `(${val}%)`;
  }

  if (getBreakdownVal == null) {
    getBreakdownVal = (dict, key) => dict[key];
  }

  if (filter == null) {
    filter = (key, val) => true;
  }

  let newBreakdown = undefined;
  let breakDownKeys = null;

  // sorting
  if (sort != 0 || limit !== null) {
    breakDownKeys = Object.keys(breakDown);

    if (sort != 0) {
      const compareFn = (sort >= 0) ? (keyA, keyB) => getBreakdownVal(breakDown, keyA) - getBreakdownVal(breakDown, keyB) : (keyA, keyB) => getBreakdownVal(breakDown, keyB) - getBreakdownVal(breakDown, keyA)
      breakDownKeys.sort(compareFn);
    }
  }

  const breakDownFormatted = breakDownKeys !== null;

  // limit entries
  if (breakDownFormatted && limit !== null) {
    breakDownKeys = breakDownKeys.slice(0, limit);
  }

  // create the new processed breakdown
  if (breakDownFormatted) {
    newBreakdown = new Map();
    for (const key of breakDownKeys) {
      const breakDownVal = breakDown[key];
      if (!filter(key, breakDownVal)) continue;

      newBreakdown.set(key, breakDownVal);
    }
  } else {
    newBreakdown = new Map(Object.entries(breakDown).filter((key, val) => filter(key, val)));
  }

  let result = DictTools.mapToWebStr(newBreakdown, formatValFunc);
  if (!includeTotal) return result;

  let totalValue = 0;
  if (getTotalVal !== null) {
    totalValue = getTotalVal(breakDown);
  } else {
    for (const key in breakDown) {
      totalValue += getBreakdownVal(breakDown, key);
    }
  }

  totalValue = totalFormatValFunc("total", totalValue);
  const totalLine = (newBreakdown.size > 0) ?  Translation.translate("dataTable.breakDownTotal", {totalVal: totalValue, totalPercent: totalFormatPercentFunc(100)}) : `${totalValue}`;
  return `<b>${totalLine}</b><br>${result}`;
}

// getBreakdownDistribWebStr(breakDown, getDistribution, includeTotal, formatValFunc): Retrieves the string representation of a breakdown and its distribution
//  for some cell of a table
export function getBreakdownDistribWebStr({breakDown, getDistribution = true, includeTotal = true, formatValFunc = null, sort = -1, limit = 5, 
                                           filter = null, getTotalVal = null, totalFormatValFunc = null, totalFormatPercentFunc = null}) {
  if (getDistribution) {
    breakDown = getBreakdownDistribution(breakDown);
  }

  if (formatValFunc == null) {
    formatValFunc = (key, val) => val;
  }

  const distribFormatFunc = (key, currentData) => `${formatValFunc(key, currentData.value)} (${currentData.distribution})`;
  const getBreakdownVal = (dict, key) => dict[key].value;

  if (totalFormatValFunc == null) {
    totalFormatValFunc = (key, val) => formatValFunc(key, val);
  }

  return getBreakdownWebStr({breakDown: breakDown, includeTotal: includeTotal, formatValFunc: distribFormatFunc, 
                             sort: sort, limit: limit, filter: filter, getBreakdownVal: getBreakdownVal, totalFormatValFunc: totalFormatValFunc, 
                             getTotalVal: getTotalVal, totalFormatValFunc: totalFormatValFunc, totalFormatPercentFunc: totalFormatPercentFunc});
}
