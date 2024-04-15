import {
  ConsumptionUnits,
  DataColumn,
  MeanFlag,
  ageGroups,
  sexGroups,
} from "../const.js";
import { getTranslations } from "../translation/translation.js";

/**
 * Return domain specific age-sex group, age group, and sex group from age-sex group found in raw consumption entry
 */
export function getAgeSexGroupInfoForConsumptionEntry(ageSexGroup) {
  // Age
  let age = "";
  for (let i = 0; i < ageSexGroup.length; i++) {
    if (!isNaN(ageSexGroup[i])) {
      while (
        i < ageSexGroup.length &&
        ageSexGroup[i] != " " &&
        (!isNaN(ageSexGroup[i]) ||
          ageSexGroup[i] == "+" ||
          ageSexGroup[i] == "-")
      ) {
        age += ageSexGroup[i];
        i++;
      }
    }
    if (age) break;
  }
  age = ageGroups[age];
  if (!age) {
    console.error("Error getting age group");
  }

  // Sex
  let sex = "";
  for (let i = 0; i < ageSexGroup.length; i++) {
    if (ageSexGroup[i] == getTranslations().tdsData.values[sexGroups.F]) {
      sex = sexGroups.F;
    }
    if (ageSexGroup[i] == getTranslations().tdsData.values[sexGroups.M]) {
      sex = sexGroups.M;
    }
  }
  if (!sex) {
    sex = sexGroups.B;
  }

  return [getAgeSex(age, sex), age, sex];
}

/**
 * Return domain specific age-sex group from domain specific age group and sex group
 */
export function getAgeSex(age, sex) {
  return age + " " + sex;
}

/**
 * Return domain specific age group and sex group from domain-specific age-sex group (the opposite of the function getAgeSex)
 */
export function getAgeAndSex(ageSexGroup) {
  return ageSexGroup.split(" ");
}

/**
 * Return age-sex group for display from domain specific age-sex group
 */
export function getAgeSexDisplay(ageSexGroup) {
  let [age, sex] = getAgeAndSex(ageSexGroup);
  return getAgeSex(age, getTranslations().tdsData.values[sex]);
}

/**
 * Function used to format numbers when displaying to users. Used throughout the application.
 */
export function formatNumber(number, filters) {
  const precision =
    filters?.chemicalGroup === getTranslations().tdsData.values.radionuclides
      ? 6
      : 2;
  const roundedNumber = parseFloat(number).toFixed(precision);

  if (parseFloat(roundedNumber) === 0) {
    return "0";
  } else {
    return parseFloat(roundedNumber).toLocaleString();
  }
}

/**
 * Function used to format percents when displaying to users. Used throughout the application.
 */
export function formatPercent(percent) {
  return parseFloat(percent.toFixed(2)).toLocaleString() + "%";
}

/**
 * Function used to get text to display for a given sandbox override value
 */
export function getOverrideText(override) {
  return override.composite + ": " + formatNumber(override.occurrence);
}

/**
 * Function used to get text to display in data table for user modifications
 */
export function getUserModifiedValueText(override) {
  return (
    override.composite +
    "-" +
    getTranslations().dataTable.values.occurrence +
    "=" +
    formatNumber(override.occurrence)
  );
}

/**
 * Return contaminant unit for display
 */
export function getExposureUnit(contaminantUnit, filters) {
  if (!contaminantUnit) {
    return getTranslations().misc.na;
  }
  if (filters.chemicalGroup == getTranslations().tdsData.values.radionuclides) {
    return "mSv/year";
  }
  return (
    contaminantUnit.split("/")[0] +
    getTranslations().misc.consumptionUnitShort[
    filters.usePerPersonPerDay
      ? ConsumptionUnits.PERSON
      : ConsumptionUnits.KGBW
    ]
  );
}

/**
 * Return consumption unit for a given mean consumption for display
 */
export function getConsumptionUnit(meanConsumption, filters) {
  return (
    formatNumber(meanConsumption) +
    " " +
    getTranslations().misc.gramsShort +
    getTranslations().misc.consumptionUnitShort[
    filters.usePerPersonPerDay
      ? ConsumptionUnits.PERSON
      : ConsumptionUnits.KGBW
    ]
  );
}

/**
 * Return year for raw contaminant entry
 */
export function getYearForContaminantEntry(row) {
  const year =
    "20" +
    row[getTranslations().tdsData.headers[DataColumn.COLLECTION_DATE]].split(
      "/",
    )[2];
  // Edge-cases discovered in data...
  if (
    row[getTranslations().tdsData.headers[DataColumn.PROJECT_CODE]].includes(
      "2015A",
    )
  ) {
    return "2014";
  }
  if (
    row[getTranslations().tdsData.headers[DataColumn.PROJECT_CODE]] ==
    "BCS.TDS2014.DEHP"
  ) {
    return "2014";
  }
  if (
    row[getTranslations().tdsData.headers[DataColumn.PROJECT_CODE]] ==
    "BCS.TDS2011.Radionuclides"
  ) {
    return "2011";
  }
  return year;
}

/**
 * Return composite info for raw contaminant entry
 */
export function getCompositeInfoForContaminantEntry(row) {
  let info =
    row[getTranslations().tdsData.headers[DataColumn.SAMPLE_CODE]] +
    row[getTranslations().tdsData.headers[DataColumn.PRODUCT_DESC]];
  if (info.includes("JJ02")) {
    // Edge-case with data that was discovered
    info = "JJ15";
  }
  return info;
}

/**
 * Return occurrence for raw contaminant entry
 */
export function getOccurrenceForContaminantEntry(row) {
  let result = Number(
    row[getTranslations().tdsData.headers[DataColumn.RESULT_VALUE]],
  );
  if (row[getTranslations().tdsData.headers[DataColumn.UNIT]] == "µg/g") {
    return result * 1000; // Convert to ng
  }
  return result;
}

/**
 * Return unit for raw contaminant entry unit
 * Some entries of the phthalate di-(2-ethylhexyl) adipate (DEHA) use µg/g.
 */
export function getUnitForContaminantEntry(unit) {
  if (unit == "µg/g") {
    unit = "ng/g";
  }
  return unit;
}

/**
 * Under some circumstances, the LOD or MDL value is misrepresenting and should never be used.
 * This function checks if this is the case.
 */
export function lodOrMdlIsValid(chemicalGroup) {
  if (chemicalGroup == getTranslations().tdsData.values.radionuclides) {
    return false;
  }
  return true;
}

/**
 * Return composite description for description found in raw consumption entry
 */
export function getCompositeDescForConsumptionEntry(desc) {
  return (desc.charAt(0).toUpperCase() + desc.slice(1)).replace(/_/g, ", ");
}

/**
 * Return mean flag found in raw consumption entry
 */
export function getMeanFlagForConsumptionEntry(meanFlag) {
  return meanFlag == "E"
    ? MeanFlag.FLAGGED
    : meanFlag == "F"
      ? MeanFlag.SUPPRESSED
      : MeanFlag.NONE;
}

/**
 * Return composite (code) for raw consumption entry
 */
export function getCompositeForConsumptionEntry(row) {
  return row[getTranslations().tdsData.headers[DataColumn.COMPOSITE_CODE]];
}
