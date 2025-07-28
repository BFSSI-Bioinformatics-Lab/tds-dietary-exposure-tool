import {
  ConsumptionUnits,
  DataColumn,
  MeanFlag,
  ageGroups,
  browserLanguage,
  sexGroups,
  getTranslations,
  ageGroups1To8,
  Translation
} from "../const.js";


// NumberTool: Tools for handling with numbers
export class NumberTool {
  // isNumber(num): Checks if 'num' is a number
  static isNumber(num) {
      return !Number.isNaN(num);
  }

  // isNegativeNumber(num): Checks if 'num' is a negative number
  static isNegative(num) {
      return (this.isNumber(num) && num < 0);
  }

  // isNonNegativeNumber(num): Checks if 'num' is a non-negative number
  static isNonNegativeNumber(num) {
      return (this.isNumber(num) && num >= 0);
  }

  // isInteger(num): Checks if 'num' is an integer
  static isInteger(num) {
      return Number.isInteger(num);
  }

  // isNonNegativeInteger: Checks if 'num' is a non-negative integer
  static isNonNegativeInteger(num) {
      return (this.isNonNegativeNumber(num) && Number.isInteger(parseFloat(num)));
  }

  // hasCond(): Checks if there exists a number that satisfies condition 'cond'
  static hasCond(cond) {
      let result = false;
      for (var i = 1; i < arguments.length; ++i) {
          result ||= cond(arguments[i]);
      }

      return result;
  }

  // hasNegative(): Checks if there exists a negative number in the arguments
  static hasNegative() {
      return this.hasCond(this.isNegative);
  }

  // hasNonNegative(): Checks if there exists a non-negative number in the arguments
  static hasNonNegative() {
      return this.hasCond(this.isNonNegativeNumber);
  }
}


// DictTool: Tools for handling dictionaries
export class DictTool {

  // getMapSorted(dict, compareFn): Retrieves a corresponding map
  //  to the sorted dictionarys
  static getMapSorted(dict, compareFn) {
    const keys = Object.keys(dict);
    keys.sort((item1, item2) => compareFn(item1, item2, dict));

    const result = new Map();
    for (const key of keys) {
      result.set(key, dict[key]);
    }

    return result;
  }
}


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
    if (ageSexGroup[i] == getTranslations().misc.sexGroups[sexGroups.F]) {
      sex = sexGroups.F;
    }
    if (ageSexGroup[i] == getTranslations().misc.sexGroups[sexGroups.M]) {
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
  return ageSexGroup.split(" ", 2);
}

// getSexDisplay: Retrieves the display for a particular sex
export function getSexDisplay(sex, age) {
  if (sex != sexGroups.B) return Translation.translate(`misc.sexGroups.${sex}`);
  if (ageGroups1To8.has(age)) return Translation.translate(`misc.sexGroups.Both1To8`);
  return Translation.translate(`misc.sexGroups.Both9Plus`);
}

/**
 * Return age-sex group for display from domain specific age-sex group
 */
export function getAgeSexDisplay(ageSexGroup) {
  let [age, sex] = getAgeAndSex(ageSexGroup);
  return getAgeSex(age, getTranslations().misc.sexGroups[sex]);
}

/**
 * Function used to format numbers when displaying to users. Used throughout the application.
 */
export function formatNumber(number, filters, precision) {
  precision = precision
    ? precision
    : filters?.chemicalGroup === getTranslations().tdsData.values.radionuclides
    ? 7
    : 4;
  const roundedNumber = number.toFixed(precision);

  if (roundedNumber == 0) {
    return "0";
  } else {
    return parseFloat(roundedNumber).toLocaleString(browserLanguage());
  }
}

/**
 * Function used to format percents when displaying to users. Used throughout the application.
 */
export function formatPercent(percent) {
  return parseFloat(percent.toFixed(2)).toLocaleString(browserLanguage()) + "%";
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
export function getUserModifiedValueText(override, contaminantUnit) {
  return (
    override.composite +
    "-" +
    getTranslations().dataTable.values.occurrence +
    "=" +
    formatNumber(override.occurrence) +
    " " +
    contaminantUnit
  );
}

/**
 * Return contaminant exposure unit for display
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
  const rowYear =
    row[getTranslations().tdsData.headers[DataColumn.COLLECTION_DATE]];
  let year = null;

  const formats = [
    { pattern: /(\d{4})-(\d{2})-(\d{2})/, parts: ["year", "month", "day"] }, // YYYY-MM-DD
    {
      pattern: /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
      parts: ["month", "day", "year"],
    }, // MM/DD/YYYY, MM/DD/YY, M/DD/YY, MM/D/YY
    { pattern: /(\d{2})-(\d{2})-(\d{2})/, parts: ["month", "day", "year"] }, // MM-DD-YY
  ];

  for (let format of formats) {
    let match = rowYear.match(format.pattern);
    if (match) {
      let yearIndex = format.parts.indexOf("year");
      if (yearIndex != -1) {
        year = parseInt(match[yearIndex + 1]);
        if (year < 100) {
          year += 2000;
        }
      }
      break;
    }
  }

  if (!year) {
    console.error("Invalid year found in data: " + rowYear);
  }

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
  return year.toString();
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
export function getMeanFlagForConsumptionEntry(meanFlag, meanConsumption) {
  return meanFlag == "E"
    ? MeanFlag.FLAGGED
    : meanFlag == "F"
    ? meanConsumption == 0
      ? MeanFlag.SUPPRESSED
      : MeanFlag.SUPPRESSED_HIGH_CV
    : meanFlag == "FF"
    ? MeanFlag.SUPPRESSED_HIGH_CV
    : MeanFlag.NONE;
}

/**
 * Return composite (code) for raw consumption entry
 */
export function getCompositeForConsumptionEntry(row) {
  return row[getTranslations().tdsData.headers[DataColumn.COMPOSITE_CODE]];
}
