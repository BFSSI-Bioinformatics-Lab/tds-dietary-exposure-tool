import { ConsumptionUnits, MeanFlag, ageGroups, sexGroups } from "../config.js";
import { getTranslations } from "../translation/translation.js";

/**
 *
 * Return domain specific age-sex group, age group, and sex group from age-sex group found in raw consumption entry
 *
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
    if (ageSexGroup[i] == "F") {
      sex = sexGroups.F;
    }
    if (ageSexGroup[i] == "M") {
      sex = sexGroups.M;
    }
  }
  if (!sex) {
    sex = sexGroups.B;
  }

  return [getAgeSex(age, sex), age, sex];
}

/**
 *
 * Return domain specific age-sex group from domain specific age group and sex group
 *
 */
export function getAgeSex(age, sex) {
  return age + " " + sex;
}

/**
 *
 * Return domain specific age group and sex group from domain-specific age-sex group (the opposite of the function getAgeSex)
 *
 */
export function getAgeAndSex(ageSexGroup) {
  return ageSexGroup.split(" ");
}

/*
 *
 * Function used to format numbers when displaying to users. Used throughout the application.
 *
 */
export function formatNumber(number, filters) {
  const precision = filters?.chemicalGroup === "Radionuclides" ? 6 : 2;
  const roundedNumber = Number.parseFloat(number).toFixed(precision);

  if (parseFloat(roundedNumber) === 0) {
    return "0";
  } else {
    return parseFloat(roundedNumber).toLocaleString();
  }
}

/*
 *
 * Function used to format percents when displaying to users. Used throughout the application.
 *
 */
export function formatPercent(percent) {
  return parseFloat(percent.toFixed(2)).toLocaleString() + "%";
}

export function getExposureUnit(contaminentUnit, filters) {
  if (!contaminentUnit) {
    return getTranslations().misc.na;
  }
  if (filters.chemicalGroup == "Radionuclides") {
    return "mSv/year";
  }
  return (
    contaminentUnit.split("/")[0] +
    getTranslations().misc.consumptionUnitShort[
    filters.usePerPersonPerDay
      ? ConsumptionUnits.PERSON
      : ConsumptionUnits.KGBW
    ]
  );
}

export function getConsumptionUnit(graphEntry, filters) {
  return (
    formatNumber(graphEntry.meanConsumption) +
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
 *
 * Return year for raw contaminent entry
 *
 */
export function getYearForContaminentEntry(row) {
  const year = new Date(row["Sample Collection Date"] + "T12:00:00")
    .getFullYear()
    .toString();
  // Edge-cases discovered in data...
  if (row["Project Code"].includes("2015A")) {
    return "2014";
  }
  if (row["Project Code"] == "BCS.TDS2014.DEHP") {
    return "2014";
  }
  return year;
}

/**
 *
 * Return composite info for raw contaminent entry
 *
 */
export function getCompositeInfoForContaminentEntry(row) {
  let info = row["Sample Code"] + row["Product Description"];
  if (info.includes("JJ02")) {
    // Edge-case with data that was discovered
    info = "JJ15";
  }
  return info;
}

/**
 *
 * Under some circumstances, the LOD or MDL value is misrepresenting and should never be used.
 * This function checks if this is the case.
 *
 */
export function lodOrMdlIsValid(chemicalGroup) {
  if (chemicalGroup == "Radionuclides") {
    return false;
  }
  return true;
}

/**
 *
 * Return composite description for description found in raw consumption entry
 *
 */
export function getCompositeDescForConsumptionEntry(desc) {
  return (desc.charAt(0).toUpperCase() + desc.slice(1)).replace(/_/g, ", ");
}

/**
 *
 * Return mean flag found in raw consumption entry
 *
 */
export function getMeanFlagForConsumptionEntry(meanFlag) {
  return meanFlag == "E"
    ? MeanFlag.FLAGGED
    : meanFlag == "F"
      ? MeanFlag.SUPPRESSED
      : MeanFlag.NONE;
}

/**
 *
 * Return composite (code) for raw consumption entry
 *
 */
export function getCompositeForConsumptionEntry(row) {
  return row["TDS_FC_Code"];
}
