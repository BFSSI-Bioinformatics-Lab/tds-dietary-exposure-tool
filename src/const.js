/*
Data
*/
// Directories
export const consumptionDataDirectory = "./data/food-consumption/";
export const contaminentOccurenceDataDirectory =
  "./data/contaminant-occurence/";

// Consumption data
export const foodConsumptionFileNames = {
  compositeDescriptionFileName:
    consumptionDataDirectory +
    "6.-compositedescription_en_2008-2022tds_fct_cchs2015.csv",
  foodConsumptionPerKgBwFileName:
    consumptionDataDirectory +
    "2.-2008-2022-tds-food-consumption-data-table-per-kgbw-all-persons-and-consumers-only_en.csv",
  foodConsumptionPerPersonFileName:
    consumptionDataDirectory +
    "3.-2008-2022-tds-food-consumption-data-table-per-person-all-persons-and-consumers-only_en.csv",
};

// Contaminent occurence data

export const contaminentOccurenceFileNames = [
  contaminentOccurenceDataDirectory +
  "Total Diet Study Bisphenol A (BPA) results 2008-2012, 2016.csv",
  contaminentOccurenceDataDirectory +
  "Total Diet Study DEHA & Phthalates results 2011, 2013, 2014.csv",
  contaminentOccurenceDataDirectory +
  "Total Diet Study Mycotoxin results 2008-2009.csv",
  contaminentOccurenceDataDirectory +
  "Total Diet Study Polychlorinated Biphenyls (PCB) results 1992-2015.csv",
  contaminentOccurenceDataDirectory +
  "Total Diet Study Radionuclides results 2000-2020.csv",
  contaminentOccurenceDataDirectory +
  "Total Diet Study Trace Elements results 1993-2018.csv",
  contaminentOccurenceDataDirectory +
  "Total Diet Study Volatile Organic Compounds (VOCs) results 2015.csv",
];

/*
HTML
*/

export const headerIds = {
  howToUseButtonId: "how-to-use-button",
  howToUseTextId: "how-to-use-text",
};

// Inputs
export const inputIds = {
  chemicalGroupInputId: "chemical-group-input",
  chemicalInputId: "chemical-input",
  yearInputId: "year-input",
  lodInputId: "lod-input",
  lodRangeId: "lod-range",
  ageSexGroupInputId: "age-sex-group-input",
  dataFormatInputId: "data-format-input",
  unitsInputId: "units-input",
  categoryFormatInputId: "category-format-input",
};

export const inputContainerIds = {
  ageSexGroupInputContainerId: "age-sex-group-container-input",
  dataFormatInputContainerId: "data-format-container-input",
  unitsInputContainerId: "units-container-input",
  categoryFormatInputContainerId: "category-format-container-input",
};

// Graphs
export const graphIds = {
  graphTitleId: "graph-title",

  graphId: "graph",
  graphLegendId: "graph-legend",

  resultsByAgeSexGroupGraphSelectId: "results-by-age-sex-group-graph-select",
  resultsByFoodGroupGraphSelectId: "results-by-food-group-graph-select",
  resultsByFoodGraphSelectId: "results-by-food-graph-select",
};
