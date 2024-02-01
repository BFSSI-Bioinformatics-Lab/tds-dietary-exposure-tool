import {
  contaminentOccurenceFileNames,
  foodConsumptionFileNames,
  inputIds,
} from "./const.js";
import {
  normalizeAgeSexGroup,
  resultValueToNanoGramsPerGram,
  sortAgeSexGroup,
  formatFoodCompositeLabel,
} from "./helper.js";

/*
 * CSV Loading
 */

async function readCSV(filepath) {
  try {
    return await d3.csv(filepath);
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

/*
 * Contaminent Occurence Data
 */

export async function getContaminentOcurrenceData() {
  const contaminentOccurenceData = {};

  for (const fileName of contaminentOccurenceFileNames) {
    const data = await readCSV(fileName);
    // First entry in each file can be used to get the chemical group. This will be used for indexing.
    contaminentOccurenceData[data[0]["Analyte Group"]] = data
      .map((row) => {
        return {
          chemicalName: row["Analyte Name"],
          // The sample code and product description could both contain the food composite label.
          // They should both be checked when mapping food consumption data to contaminent occurence data.
          sampleCode: row["Sample Code"],
          productDescription: row["Product Description"],
          year: new Date(row["Sample Collection Date"] + "T12:00:00")
            .getFullYear()
            .toString(),
          // Detected value in ng/g of contaminent (chemicalName) in the food composite (contained in sampleCode or productDescription).
          // This is the value used to calculate dietary exposure.
          resultValue: resultValueToNanoGramsPerGram(
            Number(row["Result Value"]),
            row["Units of measurement"],
          ),
          unitsOfMeasurement: "ng/g",
          // Level of detection - when the result value is 0, the user can filter based on certain LODs.
          lod: resultValueToNanoGramsPerGram(
            Number(row["LOD"] || row["MDL"]),
            row["Units of measurement"],
          ),
        };
      })
      .filter((row) => {
        // Only use data from [2008, 2022].
        return row.year >= 2008 && row.year <= 2022;
      });
  }
  return contaminentOccurenceData;
}

/*
 * Food Consumption Data
 */

export async function getFoodCompositeData() {
  const foodCompositeData = [];
  let currentFoodCompositeGrouping = null;

  (
    await readCSV(foodConsumptionFileNames.compositeDescriptionFileName)
  ).forEach((row) => {
    if (!row["Composite Description (TDS_FC_Label)"]) {
      // Entry is a food composite grouping if other entires are empty
      currentFoodCompositeGrouping = row["Composite Code (TDS_FC_Code)"];
    } else {
      const compositeCode = row["Composite Code (TDS_FC_Code)"].toUpperCase();
      // Add entry to the current food composite grouping
      foodCompositeData.push({
        // Each food composite code belongs to a grouping
        compositeGrouping: currentFoodCompositeGrouping,
        // Code for food composite.
        compositeCode: compositeCode,
        // Description of food composite.
        compositeLabel: formatFoodCompositeLabel(
          row["Composite Description (TDS_FC_Label)"],
        ),
      });
    }
  });

  return foodCompositeData;
}

export async function getFoodConsumptionData() {
  const foodConsumptionData = (
    await readCSV(foodConsumptionFileNames.foodConsumptionPerPersonFileName)
  ).map((row) => {
    return {
      ageSexGroup: normalizeAgeSexGroup(row["population"]),
      // Used to match consumption data to the contaminent occurrence data.
      foodCompositeCode: row["TDS_FC_Code"],
      // Amount of food composite (foodCompositeCode) consumed by a certain age-sex group (ageSexGroup) per day.
      meanGramsPerPersonPerDay: Number(row["Mean_grams_per_person_per_day"]),
      meanFlag: row["Mean_flag"],
    };
  });
  return foodConsumptionData;
}

/*
 * User Filters
 */

export function getAvailableFilters(
  foodConsumptionData,
  contaminentOccurenceData,
  chemicalGroup,
) {
  // Get the available filters for the user based on the inputted chemical group.

  const chemicalGroups = Object.keys(contaminentOccurenceData).sort();
  // Default to first chemical group if none is chosen.
  if (!chemicalGroup) chemicalGroup = chemicalGroups[0];

  // Filters for contaminent occurence data.
  const uniqueChemicals = new Set();
  const uniqueYears = new Set();
  // Filters for food consumption data.
  const uniqueAgeSexGroups = new Set();

  contaminentOccurenceData[chemicalGroup].forEach((row) => {
    uniqueChemicals.add(row.chemicalName);
    uniqueYears.add(row.year);
  });

  foodConsumptionData.forEach((row) => {
    uniqueAgeSexGroups.add(row.ageSexGroup);
  });

  return {
    chemicalGroups: chemicalGroups,
    chemicalNames: Array.from(uniqueChemicals).sort(),
    years: Array.from(uniqueYears).sort(),
    // Level of detection - when the result value is 0, the user can filter based on certain LODs.
    lods: ["0", "1/2 LOD", "LOD", "Exclude"],
    ageSexGroups: Array.from(uniqueAgeSexGroups).sort(sortAgeSexGroup),
    dataFormat: ["Switch To Numbers", "Switch To Percentages"],
    units: ["ng per Kg Bodyweight"],
    categoryFormat: ["Show By Year", "Show By Age-Sex"],
  };
}

export function getCurrentAppliedFilters() {
  return {
    chemicalGroup: document.getElementById(inputIds.chemicalGroupInputId).value,
    chemicalName: document.getElementById(inputIds.chemicalInputId).value,
    years: Array.from(
      document.getElementById(inputIds.yearInputId).selectedOptions,
    ).map((option) => option.value),
    lod: document.getElementById(inputIds.lodInputId).value,
    ageSexGroup: document.getElementById(inputIds.ageSexGroupInputId).value,
  };
}

export function filterContaminentOccurenceData(
  currentFilters,
  contaminentOccurenceData,
) {
  return contaminentOccurenceData[currentFilters.chemicalGroup]
    .filter((row) => {
      return (
        row.chemicalName === currentFilters.chemicalName &&
        currentFilters.years.includes(row.year) &&
        // If the user selected LOD is "exclude" and the result value is 0, then don't consider this entry for future calculations.
        // Sometimes the LOD in the entry is also 0. In this case, nothing will change.
        (row.resultValue != 0 ||
          currentFilters.lod != "Exclude" ||
          row.lod == 0)
      );
    })
    .map((row) => {
      return {
        ...row,
        resultValue:
          row.resultValue > 0
            ? row.resultValue
            : currentFilters.lod == "1/2 LOD"
              ? row.lod / 2
              : currentFilters.lod == "LOD"
                ? row.lod
                : row.resultValue,
      };
    });
}

export function filterFoodConsumptionData(currentFilters, foodConsumptionData) {
  return foodConsumptionData.filter((row) => {
    return row.ageSexGroup === currentFilters.ageSexGroup;
  });
}
