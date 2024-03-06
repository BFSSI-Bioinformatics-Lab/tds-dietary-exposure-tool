import {
  contaminentFiles,
  consumptionFiles,
  YearMin,
  YearMax,
  GraphTypes,
  MeanFlag,
} from "../config.js";
import { readCSV } from "./dataLoader.js";
import {
  getAgeSexGroupInfoForConsumptionEntry,
  getCompositeDescForConsumptionEntry,
  getCompositeForConsumptionEntry,
  getCompositeInfoForContaminentEntry,
  getMeanFlagForConsumptionEntry,
  getYearForContaminentEntry,
} from "../util/data.js";
import {
  getActiveFilters,
  getSelectedGraphType,
} from "../ui/filterComponent.js";

/**
 *
 * Load Total Diet Study Data into a known structured format
 *
 * Returns:
 * - An object containing TDS data in a structured format with the following properties:
 *   - contaminant
 *     - chemicalGroup
 *       - chemical
 *         - year: Array of contaminant entries for a specific chemical group, chemical, and year
 *           - chemicalGroup
 *           - chemical
 *           - year
 *           - compositeInfo: The sample code and product description could both contain the food composite.
 *                            They should both be checked when linking consumption and contaminent.
 *                            These values will be concatenated and stored in compositeInfo.
 *           - occurrence
 *           - units
 *           - lod: When the occurence value is 0, the user may be able to adjust that value based upon the Level of Detection (LOD).
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
 *
 */
export async function getTDSData() {
  const data = {
    contaminent: {},
    consumption: {},
  };

  // Fill contaminent data
  for (const file of contaminentFiles) {
    const raw = (await readCSV(file)).rows;
    const chemicalGroup = raw[0]["Analyte Group"]; // A given file will only be for a specific chemical group
    data.contaminent[chemicalGroup] ??= {};
    raw.forEach((row) => {
      const year = getYearForContaminentEntry(row);
      if (year < YearMin || year > YearMax) {
        return;
      }

      const chemical = row["Analyte Name"];

      data.contaminent[chemicalGroup][chemical] ??= {};
      data.contaminent[chemicalGroup][chemical][year] ??= [];

      data.contaminent[chemicalGroup][chemical][year].push({
        chemicalGroup,
        chemical,
        year,
        compositeInfo: getCompositeInfoForContaminentEntry(row),
        occurence: Number(row["Result Value"]),
        units: row["Units of measurement"],
        lod: Number(row["LOD"] || row["MDL"]),
      });
    });
  }

  let currentFoodGroup = null;

  // Prepare consumption data with food groups and relative composites
  (await readCSV(consumptionFiles.desc)).rows.forEach((row) => {
    const foodDescription = row["Composite Description (TDS_FC_Label)"];
    if (!foodDescription) {
      // Entry is a food group if other entires are empty (the way the data is formatted)
      currentFoodGroup = row["Composite Code (TDS_FC_Code)"];
      data.consumption[currentFoodGroup] = {};
    } else {
      // Entry is a food composite mapping for the current food group (until the next food group is encountered)
      const composite = row["Composite Code (TDS_FC_Code)"].toUpperCase();
      data.consumption[currentFoodGroup][composite] = [];
    }
  });

  // Fill consumption data
  (await readCSV(consumptionFiles.perPerson)).rows.forEach((row) => {
    // Only considering data surveyed for all people
    if (row["Population_group"] != "All people") {
      return;
    }

    const composite = getCompositeForConsumptionEntry(row);

    // Find which entry in the consumption data has the composite
    for (const foodGroup of Object.keys(data.consumption)) {
      if (data.consumption[foodGroup][composite]) {
        const [ageSexGroup, age, sex] = getAgeSexGroupInfoForConsumptionEntry(
          row["population"],
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
            row["TDS_FC_label"],
          ),
          foodGroup,
          meanFlagForPerKgBWPerDay: MeanFlag.NONE,
          meanGramsPerKgBWPerDay: 0, // Fill in in the next function
          meanFlagForPerPersonPerDay: getMeanFlagForConsumptionEntry(
            row["Mean_flag"],
          ),
          meanGramsPerPersonPerDay:
            Number(row["Mean_grams_per_person_per_day"]) || 0,
          sex,
        });
        break; // There is only one place this composite can go
      }
    }
  });

  // Fill the consumption data with values for mean grams per kg bw per day (these values located in different file)
  (await readCSV(consumptionFiles.perKgBw)).rows.forEach((row) => {
    if (row["Population_group"] != "All people") {
      return;
    }

    const composite = getCompositeForConsumptionEntry(row);

    // Must use the age-sex group to find the matching entry in the data for this row
    const [ageSexGroup, _, __] = getAgeSexGroupInfoForConsumptionEntry(
      row["population"],
    );

    // Find which entry in the consumption data has the composite
    for (const foodGroup of Object.keys(data.consumption)) {
      if (data.consumption[foodGroup][composite]) {
        data.consumption[foodGroup][composite].forEach((r) => {
          if (r.ageSexGroup == ageSexGroup) {
            r.meanGramsPerKgBWPerDay =
              Number(row["Mean_grams_per_kilogrambodyweight_per_day"]) || 0;

            r.meanFlagForPerKgBWPerDay = getMeanFlagForConsumptionEntry(
              row["Mean_flag"],
            );
          }
        });
      }
    }
  });

  return data;
}

/**
 *
 * Load all consumption data into a raw format and filters based on the current filters.
 * This function is useful for downloading raw data for a specific graph (the data must be in raw format but still needs to be filtered).
 *
 * Returns:
 * - A promise that resolves to an array of objects, where each entry represents a file
 *   - rows: Array of raw data for consumption
 *   - filename: Formatted filename
 *
 */
export async function getRawFilteredConsumptionData() {
  const filters = getActiveFilters();

  let filtered = [];

  for (const fileInfo of [
    {
      file: consumptionFiles.perPerson,
      filename: "Food Consumption per Person per Day",
    },
    {
      file: consumptionFiles.perKgBw,
      filename: "Food Consumption per Kg Bodyweight per Day",
    },
  ]) {
    let data = {};
    data.rows = (await readCSV(fileInfo.file)).rows.filter((row) => {
      const [ageSexGroup, age, _] = getAgeSexGroupInfoForConsumptionEntry(
        row["population"],
      );
      return (
        row["Population_group"] == "All people" &&
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
 *
 * Load all contaminant data into a raw format and filter based on the current filters.
 * This function is useful for downloading raw data for a specific graph.
 * The data must be in raw format but still needs to be filtered.
 *
 * Returns:
 * - A promise that resolves to an array of objects, where each entry represents a file
 *   - rows: Array of raw data for contaminants
 *   - filename: Formatted filename
 *
 */
export async function getRawFilteredContaminentData() {
  const filters = getActiveFilters();

  let filtered = [];

  for (const file of contaminentFiles) {
    let data = {};
    let rows = (await readCSV(file)).rows;
    const chemicalGroup = rows[0]["Analyte Group"];
    if (chemicalGroup != filters.chemicalGroup) {
      continue;
    }
    data.rows = rows.filter(
      (row) =>
        row["Analyte Name"] == filters.chemical &&
        filters.years.includes(getYearForContaminentEntry(row)),
    );
    data.filename = filters.chemicalGroup + " - " + filters.chemical;
    filtered.push(data);
    break;
  }

  return filtered;
}
