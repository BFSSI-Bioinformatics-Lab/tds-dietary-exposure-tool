const consumptionDataDirectory = "./data/food-consumption/";
const contaminentOccurenceDataDirectory = "./data/contaminant-occurence/";

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

export const el = {
  howToUse: {
    container: document.getElementById("how-to-use-container"),
    content: document.getElementById("how-to-use-content"),
  },
  dataInfo: {
    container: document.getElementById("data-info-container"),
    content: document.getElementById("data-info-content"),
  },
  chemicalGroupFilter: document.getElementById("chemical-group-filter-input"),
  chemicalFilter: document.getElementById("chemical-filter-input"),
  yearFilter: document.getElementById("year-filter-input"),
  lodFilter: document.getElementById("lod-filter-input"),
  lodFilterDescription: document.getElementById("lod-filter-description"),
  rbasgSelect: document.getElementById("rbasg-graph-select"),
  rbfgSelect: document.getElementById("rbfg-graph-select"),
  rbfSelect: document.getElementById("rbf-graph-select"),
  rbasgUnitsFilter: document.getElementById("rbasg-units-filter-input"),
  rbasgAgeSexGroupFilter: document.getElementById(
    "rbasg-age-sex-group-filter-input",
  ),
  rbasgDomainFilter: document.getElementById("rbasg-domain-filter-input"),
  rbfgRangeFilter: document.getElementById("rbfg-range-format-filter-input"),
  rbfgAgeSexGroupFilter: document.getElementById(
    "rbfg-age-sex-group-filter-input",
  ),
  rbfAgeSexGroupFilter: document.getElementById(
    "rbf-age-sex-group-filter-input",
  ),

  rbasgGraphContainer: document.getElementById("rbasg-graph-container"),
  rbfgGraphContainer: document.getElementById("rbfg-graph-container"),
  rbfGraphContainer: document.getElementById("rbf-graph-container"),
  rbasgGraphTitle: document.getElementById("rbasg-graph-title"),
  rbfgGraphTitle: document.getElementById("rbfg-graph-title"),
  rbfGraphTitle: document.getElementById("rbf-graph-title"),
  rbasgGraph: document.getElementById("rbasg-graph"),
  rbfgGraph: document.getElementById("rbfg-graph"),
  rbfGraph: document.getElementById("rbf-graph"),

  rbasgLegendContent: document.getElementById("rbasg-legend-content"),
  rbfgLegendContent: document.getElementById("rbfg-legend-content"),
  rbfLegendContent: document.getElementById("rbf-legend-content"),
};
