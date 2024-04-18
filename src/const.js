import { getAgeSex } from "./util/data.js";

export const language = {
  EN: "EN",
  FR: "FR",
};

export let userLanguage =
  navigator.language.split("-")[0] == "fr" ? language.FR : language.EN;

export const toggleUserLanguage = () =>
  (userLanguage = userLanguage == language.EN ? language.FR : language.EN);

const consumptionFile = {
  [language.EN]: Object.assign(
    {},
    ...Object.entries({
      desc: "6.-compositedescription_en_2008-2022tds_fct_cchs2015.csv",
      perKgBw:
        "2.-2008-2022-tds-food-consumption-data-table-per-kgbw-all-persons-and-consumers-only_en.csv",
      perPerson:
        "3.-2008-2022-tds-food-consumption-data-table-per-person-all-persons-and-consumers-only_en.csv",
    }).map(([key, value]) => ({
      [key]: "./data/consumption/en/" + value,
    })),
  ),
  [language.FR]: Object.assign(
    {},
    ...Object.entries({
      desc: "6.-compositedescription_fr_2008-2022tds_fct_cchs2015.csv",
      perKgBw:
        "2.-2008-2022-tds-food-consumption-data-table-per-kgbw-all-persons-and-consumers-only_fr.csv",
      perPerson:
        "3.-2008-2022-tds-food-consumption-data-table-per-person-all-persons-and-consumers-only_fr.csv",
    }).map(([key, value]) => ({
      [key]: "./data/consumption/fr/" + value,
    })),
  ),
};

export const getConsumptionFiles = () => consumptionFile[userLanguage];

const contaminantFile = {
  [language.EN]: [
    "Total Diet Study Bisphenol A (BPA) results 2008-2012, 2016.csv",
    "Total Diet Study DEHA & Phthalates results 2011, 2013, 2014.csv",
    "Total Diet Study Mycotoxin results 2008-2009.csv",
    "Total Diet Study Polychlorinated Biphenyls (PCB) results 1992-2015.csv",
    "Total Diet Study Radionuclides results 2000-2020.csv",
    "Total Diet Study Radionuclides results 2021.csv",
    "Total Diet Study Radionuclides results 2022.csv",
    "Total Diet Study Trace Elements results 1993-2018.csv",
    "Total Diet Study Volatile Organic Compounds (VOCs) results 2015.csv",
    "2016 PFAS TDS_Public CANLINE Export w acronyms 2024-04-17.csv",
    "2017 PFAS TDS_Public CANLINE Export w acronyms 2024-04-17.csv",
  ].map((file) => "./data/contaminant/en/" + file),
  [language.FR]: [
    "2017 PFAS TDS_FR_Public CANLINE Export w acronyms 2024-04-17.csv",
    "2016 PFAS TDS_FR_Public CANLINE Export w acronyms 2024-04-17.csv",
    "Radionuclide TDS 2022 public French(Export).csv",
    "Radionuclides TDS 2021 public French(Export).csv",
    "Trace Elements TDS 1993-2018 public French(Export).csv",
  ].map((file) => "./data/contaminant/fr/" + file),
};

export const getContaminantFiles = () => contaminantFile[userLanguage];

export const DataType = {
  CONSUMPTION: "CONSUMPTION",
  CONTAMINANT: "CONTAMINANT",
};

export const DataColumn = {
  /* Consumption */
  MAPPING_COMPOSITE_DESC: "MAPPING_COMPOSITE_DESC",
  MAPPING_COMPOSITE_CODE: "MAPPING_COMPOSITE_CODE",
  MAPPING_COMPOSITE_CONTENT: "MAPPING_COMPOSITE_CONTENT",
  POPULATION: "POPULATION",
  POPULATION_GROUP: "POPULATION_GROUP",
  COMPOSITE_DESC: "COMPOSITE_DESC",
  COMPOSITE_CODE: "COMPOSITE_CODE",
  MEAN_FLAG: "MEAN_FLAG",
  MEAN_G_PPPD: "MEAN_G_PPPD",
  MEAN_G_PKGBWPD: "MEAN_G_PKGBWPD",
  /* Contaminant */
  CHEMICAL_GROUP: "CHEMICAL_GROUP",
  CHEMICAL: "CHEMICAL",
  COLLECTION_DATE: "COLLECTION_DATE",
  PROJECT_CODE: "PROJECT_CODE",
  SAMPLE_CODE: "SAMPLE_CODE",
  PRODUCT_DESC: "PRODUCT_DESC",
  RESULT_VALUE: "RESULT_VALUE",
  UNIT: "UNIT",
  LOD: "LOD",
  MDL: "MDL",
};

export const ConsumptionUnits = {
  PERSON: "PERSON",
  KGBW: "KGBW",
};

export const RbasgDomainFormat = {
  AGESEX: "AGESEX",
  YEAR: "YEAR",
};

export const RbfgRangeFormat = {
  PERCENT: "PERCENT",
  ABSOLUTE: "ABSOLUTE",
};

export const RbfSortByFormat = {
  FOOD: "FOOD",
  GROUP: "GROUP",
};

export const GraphTypes = {
  RBASG: "RBASG",
  RBFG: "RBFG",
  RBF: "RBF",
};

export const DataTableHeader = {
  CHEMICAL: "CHEMICAL",
  AGE_SEX_GROUP: "AGE_SEX_GROUP",
  FOOD_GROUP: "FOOD_GROUP",
  COMPOSITE: "COMPOSITE",
  PERCENT_EXPOSURE: "PERCENT_EXPOSURE",
  EXPOSURE: "EXPOSURE",
  EXPOSURE_UNIT: "EXPOSURE_UNIT",
  YEARS: "YEARS",
  PERCENT_NOT_TESTED: "PERCENT_NOT_TESTED",
  PERCENT_UNDER_LOD: "PERCENT_UNDER_LOD",
  TREATMENT: "TREATMENT",
  MODIFIED: "MODIFIED",
  FLAGGED: "FLAGGED",
  SUPPRESSED: "SUPPRESSED",
};

export const SortByDir = {
  DESC: "DESC",
  ASC: "ASC",
};

export const MeanFlag = {
  NONE: "NONE",
  FLAGGED: "FLAGGED",
  SUPPRESSED: "SUPPRESSED",
};

export const YearMax = 2022; // The maximum year the tool will consider for data
export const YearMin = 2008;

export const ageGroups = {
  "1+": "1+",
  "1-18": "1-18",
  "19+": "19+",
  "1-3": "1-3",
  "4-8": "4-8",
  "9-13": "9-13",
  "14-18": "14-18",
  "19-30": "19-30",
  "31-50": "31-50",
  "51-70": "51-70",
  "71+": "71+",
};

export const sexGroups = {
  B: "B",
  F: "F",
  M: "M",
};

export const suppressedAgeSexGroups = [
  getAgeSex(ageGroups["1-3"], sexGroups.F),
  getAgeSex(ageGroups["1-3"], sexGroups.M),
  getAgeSex(ageGroups["4-8"], sexGroups.F),
  getAgeSex(ageGroups["4-8"], sexGroups.M),
];

export const ageSexGroups = Object.keys(ageGroups).reduce((result, ageKey) => {
  Object.keys(sexGroups).forEach((sexKey) => {
    const ageSexGroup = getAgeSex(ageKey, sexKey);
    if (!suppressedAgeSexGroups.includes(ageSexGroup)) {
      result[ageSexGroup] = ageSexGroup;
    }
  });
  return result;
}, {});

export const LODs = {
  0: "0",
  "1/2 LOD": "1/2 LOD",
  LOD: "LOD",
  Exclude: "Exclude",
};

export const PFASGroupings = {
  TOTAL_PFAS: "TOTAL_PFAS",
  TOTAL_PFCA: "TOTAL_PFCA",
  TOTAL_PFS: "TOTAL_PFS",
  TOTAL_PFOSA: "TOTAL_PFOSA",
  LC_PFCA: "LC_PFCA",
  LC_PFS: "LC_PFS",
  SC_PFCA: "SC_PFCA",
  SC_PFS: "SC_PFS",
};

// Ingestion Dose Coefficient (used for radionuclides)
export const IDCs = {
  "Americium-241": {
    1: 0.00037,
    5: 0.00027,
    10: 0.00022,
    15: 0.0002,
    "1-18": 0.00024647,
    Adult: 0.0002,
  },
  "Bismuth-212": {
    1: 0.0000018,
    5: 0.00000087,
    10: 0.0000005,
    15: 0.00000033,
    "1-18": 0.00000071,
    Adult: 0.00000026,
  },
  "Bismuth-214": {
    1: 0.00000074,
    5: 0.00000036,
    10: 0.00000021,
    15: 0.00000014,
    "1-18": 0.0000003,
    Adult: 0.00000011,
  },
  "Cesium-134": {
    1: 0.000016,
    5: 0.000013,
    10: 0.000014,
    15: 0.000019,
    "1-18": 0.00001541,
    Adult: 0.000019,
  },
  "Cesium-137": {
    1: 0.000012,
    5: 0.0000096,
    10: 0.00001,
    15: 0.000013,
    "1-18": 0.000011,
    Adult: 0.000013,
  },
  "Cobalt-57": {
    1: 0.0000016,
    5: 0.00000089,
    10: 0.00000058,
    15: 0.00000037,
    "1-18": 0.00000073,
    Adult: 0.00000021,
  },
  "Cobalt-60": {
    1: 0.000027,
    5: 0.000017,
    10: 0.000011,
    15: 0.0000079,
    "1-18": 0.00001374,
    Adult: 0.0000034,
  },
  "Iodine-131": {
    1: 0.00018,
    5: 0.0001,
    10: 0.000052,
    15: 0.000034,
    "1-18": 0.00007588,
    Adult: 0.000022,
  },
  "Lead-210": {
    1: 0.0036,
    5: 0.0022,
    10: 0.0019,
    15: 0.0019,
    "1-18": 0.00218824,
    Adult: 0.00069,
  },
  "Lead-212": {
    1: 0.000063,
    5: 0.000033,
    10: 0.00002,
    15: 0.000013,
    "1-18": 0.00002682,
    Adult: 0.000006,
  },
  "Lead-214": {
    1: 0.000001,
    5: 0.00000052,
    10: 0.00000031,
    15: 0.0000002,
    "1-18": 0.00000042,
    Adult: 0.00000014,
  },
  "Potassium-40": {
    1: 0.000042,
    5: 0.000021,
    10: 0.000013,
    15: 0.0000076,
    "1-18": 0.00001718,
    Adult: 0.0000062,
  },

  "Radium-226": {
    1: 0.00062,
    5: 0.00096,
    10: 0.0008,
    15: 0.0015,
    "1-18": 0.00097176,
    Adult: 0.00028,
  },
};

// Map each age group to the age group used for IDC mapping
export const ageGroupToIDCAgeGroup = {
  "1+": "Adult",
  "1-3": "1",
  "1-18": "1-18",
  "4-8": "5",
  "9-13": "10",
  "14-18": "15",
  "19+": "Adult",
  "19-30": "Adult",
  "31-50": "Adult",
  "51-70": "Adult",
  "71+": "Adult",
};
