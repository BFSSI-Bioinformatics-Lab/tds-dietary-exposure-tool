import {
  contaminentOccurenceFileNames,
  foodConsumptionFileNames,
} from "./const.js";
import { getAge, getSex, sortAgeSexGroup } from "./helper.js";

import { readCSV } from "./data.js";
import { getTranslation } from "./translation.js";

export async function loadTdsData() {
  const tdsData = {
    contaminentOccurenceData: {},
    consumptionData: {},
    sets: {
      ageSexGroups: [],
      ageGroups: [],
      sexGroups: [],
      lods: Object.values(getTranslation("lod-filter-options")),
    },
  };

  const uniqueAgeSexGroups = new Set();
  const uniqueAgeGroups = new Set();
  const uniqueSexGroups = new Set();

  const contaminentOccurenceData = {};

  for (const fileName of contaminentOccurenceFileNames) {
    const data = await readCSV(fileName);
    const chemicalGroup = data[0]["Analyte Group"];
    contaminentOccurenceData[chemicalGroup] =
      contaminentOccurenceData[chemicalGroup] || {};
    data.forEach((row, i) => {
      const chemicalName = row["Analyte Name"];
      const year = new Date(row["Sample Collection Date"] + "T12:00:00")
        .getFullYear()
        .toString();

      if (year < 2008 || year > 2022) {
        return;
      }

      contaminentOccurenceData[chemicalGroup][chemicalName] =
        contaminentOccurenceData[chemicalGroup][chemicalName] || {};

      contaminentOccurenceData[chemicalGroup][chemicalName][year] =
        contaminentOccurenceData[chemicalGroup][chemicalName][year] || [];

      contaminentOccurenceData[chemicalGroup][chemicalName][year].push({
        chemicalGroup,
        chemicalName,
        year,
        // The sample code and product description could both contain the food composite label.
        // They should both be checked when mapping food consumption data to contaminent occurence data.
        sampleCode: row["Sample Code"],
        productDescription: row["Product Description"],
        // Detected value in ng/g of contaminent (chemicalName) in the food composite (contained in sampleCode or productDescription).
        // This is the value used to calculate dietary exposure.
        resultValue: Number(row["Result Value"]),
        unitsOfMeasurement: row["Units of measurement"],
        // Level of detection - when the result value is 0, the user can filter based on certain LODs.
        lod: Number(row["LOD"] || row["MDL"]),
      });
    });
  }

  tdsData.contaminentOccurenceData = contaminentOccurenceData;

  const consumptionData = {};
  let currentFoodGroup = null;

  (
    await readCSV(foodConsumptionFileNames.compositeDescriptionFileName)
  ).forEach((row) => {
    const foodDescription = row["Composite Description (TDS_FC_Label)"];
    if (!foodDescription) {
      // Entry is a food group if other entires are empty
      currentFoodGroup = row["Composite Code (TDS_FC_Code)"];
      consumptionData[currentFoodGroup] = {};
    } else {
      const foodCompositeCode =
        row["Composite Code (TDS_FC_Code)"].toUpperCase();
      consumptionData[currentFoodGroup][foodCompositeCode] = [];
    }
  });

  for (const row of await readCSV(
    foodConsumptionFileNames.foodConsumptionPerPersonFileName,
  )) {
    if (row["Population_group"] != "All people") {
      break;
    }
    const foodCompositeCode = row["TDS_FC_Code"];
    const age = getAge(row["population"]);
    const sex = getSex(row["population"]);
    const ageSexGroup = age + " " + sex;
    uniqueAgeGroups.add(age);
    uniqueSexGroups.add(sex);
    uniqueAgeSexGroups.add(ageSexGroup);
    for (const foodGroup of Object.keys(consumptionData)) {
      if (consumptionData[foodGroup][foodCompositeCode]) {
        consumptionData[foodGroup][foodCompositeCode].push({
          foodGroup,
          foodCompositeCode,
          foodCompositeDescription: (
            row["TDS_FC_label"].charAt(0).toUpperCase() +
            row["TDS_FC_label"].slice(1)
          ).replace(/_/g, ", "),
          age,
          sex,
          ageSexGroup,
          meanGramsPerPersonPerDay:
            Number(row["Mean_grams_per_person_per_day"]) || 0,
          meanGramsPerKgBWPerDay: 0,
          meanFlag: row["Mean_flag"],
        });
        break;
      }
    }
  }

  for (const row of await readCSV(
    foodConsumptionFileNames.foodConsumptionPerKgBwFileName,
  )) {
    if (row["Population_group"] != "All people") {
      break;
    }
    const ageSexGroup =
      getAge(row["population"]) + " " + getSex(row["population"]);
    const foodCompositeCode = row["TDS_FC_Code"];
    for (const foodGroup of Object.keys(consumptionData)) {
      if (consumptionData[foodGroup][foodCompositeCode]) {
        for (const consumptionRow of consumptionData[foodGroup][
          foodCompositeCode
        ]) {
          if (consumptionRow.ageSexGroup == ageSexGroup) {
            consumptionRow.meanGramsPerKgBWPerDay =
              Number(row["Mean_grams_per_kilogrambodyweight_per_day"]) || 0;
            break;
          }
        }
      }
    }
  }

  tdsData.consumptionData = consumptionData;

  tdsData.sets.ageSexGroups =
    Array.from(uniqueAgeSexGroups).sort(sortAgeSexGroup);
  tdsData.sets.ageGroups = Array.from(uniqueAgeGroups).sort(sortAgeSexGroup);
  tdsData.sets.sexGroups = Array.from(uniqueSexGroups).sort();

  return tdsData;
}
