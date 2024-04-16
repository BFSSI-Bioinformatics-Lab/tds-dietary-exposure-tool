import {
  getContaminantFiles,
  YearMin,
  YearMax,
  GraphTypes,
  MeanFlag,
  DataType,
  DataColumn,
  ConsumptionUnits,
  getConsumptionFiles,
  PFASGroupings,
} from "../const.js";
import { readCSV } from "./dataLoader.js";
import {
  getAgeSexGroupInfoForConsumptionEntry,
  getCompositeDescForConsumptionEntry,
  getCompositeForConsumptionEntry,
  getCompositeInfoForContaminantEntry,
  getMeanFlagForConsumptionEntry,
  getOccurrenceForContaminantEntry,
  getUnitForContaminantEntry,
  getYearForContaminantEntry,
} from "../util/data.js";
import { getActiveFilters } from "../ui/filter.js";
import { getTranslations } from "../translation/translation.js";

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
 *         - meanFlag
 *         - meanGramsPerKgBWPerDay
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
    if (!compositeDescription && !compositeContent) {
      // Entry is a food group if other entries are empty (just the way the data is formatted)
      currentFoodGroup =
        row[
        getTranslations().tdsData.headers[DataColumn.MAPPING_COMPOSITE_CODE]
        ];
      data.consumption[currentFoodGroup] = {};
    } else {
      // Entry is a food composite mapping for the current food group (until the next food group is encountered)
      const composite =
        row[
          getTranslations().tdsData.headers[DataColumn.MAPPING_COMPOSITE_CODE]
        ].toUpperCase();
      data.consumption[currentFoodGroup][composite] = [];
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
          ),
          meanGramsPerPersonPerDay:
            Number(
              row[getTranslations().tdsData.headers[DataColumn.MEAN_G_PPPD]],
            ) || 0,
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
        data.consumption[foodGroup][composite].forEach((r) => {
          if (r.ageSexGroup == ageSexGroup) {
            r.meanGramsPerKgBWPerDay =
              Number(
                row[
                getTranslations().tdsData.headers[DataColumn.MEAN_G_PKGBWPD]
                ],
              ) || 0;

            r.meanFlagForPerKgBWPerDay = getMeanFlagForConsumptionEntry(
              row[getTranslations().tdsData.headers[DataColumn.MEAN_FLAG]],
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
      return (
        row[getTranslations().tdsData.headers[DataColumn.POPULATION_GROUP]] ==
        getTranslations().tdsData.values.allPeople &&
        filters.ageSexGroups.includes(
          filters.ageSexGroupsIsAgeGroups ? age : ageSexGroup,
        )
      );
    });

    data.filename = fileInfo.filename;
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

  let filtered = [];

  for (const file of getContaminantFiles()) {
    let data = {};
    let rows = (await readCSV(file)).rows;
    const chemicalGroup =
      rows[0][getTranslations().tdsData.headers[DataColumn.CHEMICAL_GROUP]];
    if (chemicalGroup != filters.chemicalGroup) {
      continue;
    }
    data.rows = rows.filter((row) => {
      const chemical =
        row[getTranslations().tdsData.headers[DataColumn.CHEMICAL]];

      const pfasGrouping = Object.keys(PFASGroupings).find(
        (grouping) =>
          getTranslations().tdsData.values.PFASGroupings[grouping] ==
          filters.chemical,
      );

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
    });
    data.filename = filters.chemicalGroup + " - " + filters.chemical;
    filtered.push(data);
    break;
  }

  return filtered;
}
