import { getAgeSex } from "./util/data.js";

export const language = {
  EN: "en",
  FR: "fr",
};

const browserLanguageMap = {
  [language.EN]: "en-CA",
  [language.FR]: "fr-CA",
};

export let userLanguage =
  navigator.language.split("-")[0] == "fr" ? language.FR : language.EN;

export const toggleUserLanguage = () => {
  (userLanguage = userLanguage == language.EN ? language.FR : language.EN);
  i18next.changeLanguage(userLanguage);
}
  

export let browserLanguage = () => browserLanguageMap[userLanguage];

/* Remove feature flag logic once decisions have been made for suppressed values in new data */
const SUPPRESSED_HIGH_CSV_FEATURE_FLAG = false;

const consumptionFile = {
  [language.EN]: Object.assign(
    {},
    ...Object.entries({
      desc: "6.-compositedescription_en_2008-2022tds_fct_cchs2015.csv",
      perKgBw: SUPPRESSED_HIGH_CSV_FEATURE_FLAG
        ? "F-Test data_Food Consumption per kg Bodyweight per Day.csv"
        : "2.-2008-2022-tds-food-consumption-data-table-per-kgbw-all-persons-and-consumers-only_en.csv",
      perPerson: SUPPRESSED_HIGH_CSV_FEATURE_FLAG
        ? "F-Test data_Food Consumption per Person per Day.csv"
        : "3.-2008-2022-tds-food-consumption-data-table-per-person-all-persons-and-consumers-only_en.csv",
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
    "Total Diet Study Bisphenol A (BPA) results 2008-2012, 2016_mean2008.csv",
    "Total Diet Study DEHA & Phthalates results 2011, 2013, 2014.csv",
    "Total Diet Study Mycotoxin results 2008-2009.csv",
    "Total Diet Study Polychlorinated Biphenyls (PCB) results 1992-2015_correctedJJ11.csv",
    "Total Diet Study Radionuclides results 2000-2020.csv",
    "Total Diet Study Radionuclides results 2021.csv",
    "Total Diet Study Radionuclides results 2022.csv",
    "Total Diet Study Radionuclides results 2023.csv",
    "Total Diet Study Trace Elements results 1993-2018.csv",
    "Total Diet Study Volatile Organic Compounds (VOCs) results 2015_fixedGG17PD.csv",
    "2016 PFAS TDS_Public CANLINE Export w acronyms 2024-04-17.csv",
    "2017 PFAS TDS_Public CANLINE Export w acronyms 2024-04-17.csv",
  ].map((file) => "./data/contaminant/en/" + file),
  [language.FR]: [
    "2017 PFAS TDS_FR_Public CANLINE Export w acronyms 2024-04-17.csv",
    "2016 PFAS TDS_FR_Public CANLINE Export w acronyms 2024-04-17.csv",
    "Radionuclide TDS 2022 public French_2024-04-18.csv",
    "TDS Radionuclides 2000-2020 French Public_2024-04-18.csv",
    "Radionuclides TDS 2021 public French_2024-04-18.csv",
    "Trace Elements TDS 1993-2018 public French_correctedPD_2024-04-26.csv",
    "Total Diet Study Polychlorinated Biphenyls (PCB)_French_ results 1992-2015_correctedJJ11.csv",
    "TDS DEHA & phthalates 2011, 2013, 2014 public French.csv",
    "Total Diet Study Volatile Organic Compounds (VOCs)_French_results 2015_fixedGG17PD.csv",
    "Total Diet Study Bisphenol A (BPA) results_French_ 2008-2012, 2016_mean2008.csv",
    "TDS Mycotoxin 2008-2009 public French.csv",
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

export const DefaultPage = GraphTypes.RBASG;

export const GraphLegendTypes = {
  COLOR: "COLOR",
  TEXT: "TEXT",
};

export const DataTableHeader = {
  CHEMICAL: "CHEMICAL",
  AGE_SEX_GROUP: "AGE_SEX_GROUP",
  FOOD_GROUP: "FOOD_GROUP",
  COMPOSITE_NAME: "COMPOSITE",
  PERCENT_EXPOSURE: "PERCENT_EXPOSURE",
  EXPOSURE: "EXPOSURE",
  EXPOSURE_UNIT: "EXPOSURE_UNIT",
  YEARS: "YEARS",
  PERCENT_UNDER_LOD: "PERCENT_UNDER_LOD",
  TREATMENT: "TREATMENT",
  PERCENT_NOT_TESTED: "PERCENT_NOT_TESTED",
  MODIFIED: "MODIFIED",
  FLAGGED: "FLAGGED",
  SUPPRESSED: "SUPPRESSED",
  INCLUDED_SUPPRESSED: "INCLUDED_SUPPRESSED",
};

export const SortByDir = {
  DESC: "DESC",
  ASC: "ASC",
};

export const MeanFlag = {
  NONE: "NONE",
  FLAGGED: "FLAGGED",
  SUPPRESSED: "SUPPRESSED",
  SUPPRESSED_HIGH_CV: "SUPPRESSED_HIGH_CV",
};

export const YearMax = 2023; // The maximum year the tool will consider for data
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

export const ageGroupOrder = {
  [ageGroups["1-3"]]: 0,
  [ageGroups["4-8"]]: 1,
  [ageGroups["9-13"]]: 2,
  [ageGroups["14-18"]]: 3,
  [ageGroups["19-30"]]: 4,
  [ageGroups["31-50"]]: 5,
  [ageGroups["51-70"]]: 6,
  [ageGroups["1-18"]]: 7,
  [ageGroups["1+"]]: 8,
  [ageGroups["19+"]]: 9,
  [ageGroups["71+"]]: 10,
}

export const ageGroups1To8 = new Set([
  ageGroups["1-3"],
  ageGroups["4-8"]
]); 


export const ageSuperGroups = {
  Age1To8: "Age1To8",
  Age9Plus: "Age9Plus"
}

export const ageSuperGroupsByAgeGroup = {
  [ageGroups["1-3"]]: new Set([ageSuperGroups.Age1To8]),
  [ageGroups["4-8"]]: new Set([ageSuperGroups.Age1To8]),
  [ageGroups["9-13"]]: new Set([ageSuperGroups.Age9Plus]),
  [ageGroups["14-18"]]: new Set([ageSuperGroups.Age9Plus]),
  [ageGroups["19-30"]]: new Set([ageSuperGroups.Age9Plus]),
  [ageGroups["31-50"]]: new Set([ageSuperGroups.Age9Plus]),
  [ageGroups["51-70"]]: new Set([ageSuperGroups.Age9Plus]),
  [ageGroups["1-18"]]: new Set([ageSuperGroups.Age1To8, ageSuperGroups.Age9Plus]),
  [ageGroups["1+"]]: new Set([ageSuperGroups.Age1To8, ageSuperGroups.Age9Plus]),
  [ageGroups["19+"]]: new Set([ageSuperGroups.Age9Plus]),
  [ageGroups["71+"]]: new Set([ageSuperGroups.Age9Plus]),
}

export const sexGroups = {
  B: "B",
  F: "F",
  M: "M",
};

export const sexSubGroups = {
  Both1To8: "B1To8",
  Both9Plus: "B9Plus",
  Female: "F",
  Male: "M"
}

export const sexGroupOrder = {
  [sexGroups.B]: 0,
  [sexGroups.F]: 1,
  [sexGroups.M]: 2
}

export const suppressedAgeSexGroups = [
  getAgeSex(ageGroups["1-3"], sexGroups.F),
  getAgeSex(ageGroups["1-3"], sexGroups.M),
  getAgeSex(ageGroups["4-8"], sexGroups.F),
  getAgeSex(ageGroups["4-8"], sexGroups.M),
];

export const ageSexGroups = Object.keys(ageGroups).reduce((result, ageKey) => {
  Object.keys(sexGroups).forEach((sexKey) => {
    let ageSexGroup = getAgeSex(ageKey, sexKey);
    if (suppressedAgeSexGroups.includes(ageSexGroup)) return;
    result[ageSexGroup] = ageSexGroup;
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



// ################## THEMES ##################################

export const ThemeNames = {
  Light: "light",
  Dark: "dark",
  Blue: "blue"
}

export const DefaultTheme = ThemeNames.Light;

export const Themes = {};


// Note: we base the colour theme from Android's Material UI
// https://m2.material.io/develop/android/theming/color
// https://m2.material.io/design/color/the-color-system.html

// See here for Infobase's colour scheme: https://design-system.alpha.canada.ca/en/styles/colour/
Themes[ThemeNames.Light] = {
  fontColour: "#333333",
  background: "#ffffff",
  surface: "#ffffff",
  secondarySurface: "#fbfcf8",
  error: "#ff0000",
  onBackground: "#000000",
  onSurface: "#000000",
  onSecondarySurface: "#000000",
  onError: "#ffffff",
  primary: "#26374a",
  primaryVariant: "#3B4B5C",
  onPrimary: "#ffffff",
  primaryBorderColour: "#7D828B",
  primaryHover: "#444444",
  onPrimaryHover: "#ffffff",
  secondary: "#335075",
  onSecondary: "#ffffff",
  secondaryHover: "#753350",
  onSecondaryHover: "#f2f2f2",
  secondaryBorderColour: "#bbbfc5",
  tertiary: "#d7faff",
  tertiaryBorderColour: "#269abc",
  onTertiary: "#333333",
  link: "#284162",
  headerTitleColor: "#000000",

  detected: "#C5705D",
  notDetected: "#41B3A2",
  notTested: "#cc9900",
  unknown: "#cccccc",

  warningTooltipBackground: "#ffe680",
  warningTooltipBorderColour: "#cc9900"
};

Themes[ThemeNames.Dark] = {
  fontColour: "#ffffff",
  background: "#120E0B",
  surface: "#191919",
  secondarySurface: "#252525",
  error: "#ff0000",
  onBackground: "#ffffff",
  onSurface: "#ffffff",
  onSecondarySurface: "#ffffff",
  onError: "#ffffff",
  primary: "#515F6E",
  primaryVariant: "#626f7c",
  onPrimary: "#ffffff",
  primaryBorderColour: "#d6d8db",
  primaryHover: "#7c7c7c",
  onPrimaryHover: "#ffffff",
  secondary: "#5781b6",
  onSecondary: "#ffffff",
  secondaryHover: "#b65781",
  onSecondaryHover: "#f2f2f2",
  secondaryBorderColour: "#d6d8db",
  tertiary: "#d7faff",
  tertiaryBorderColour: "#269abc",
  onTertiary: "#333333",
  link: "#3e6598",
  headerTitleColor: "#ffffff",

  detected: "#C5705D",
  notDetected: "#41B3A2",
  notTested: "#cc9900",
  unknown: "#cccccc",

  warningTooltipBackground: "#ffe680",
  warningTooltipBorderColour: "#cc9900"
};

// Primary ---> Mountain Haze Theme: https://www.canva.com/colors/color-palettes/mountain-haze/
// Secondary --> Mermaid Lagoon Theme: https://www.canva.com/colors/color-palettes/mermaid-lagoon/
Themes[ThemeNames.Blue] = {
  fontColour: "#333333",
  background: "#ffffff",
  surface: "#ffffff",
  secondarySurface: "#fbfcf8",
  error: "#ff0000",
  onBackground: "#000000",
  onSurface: "#000000",
  onSecondarySurface: "#000000",
  onError: "#ffffff",
  primary: "#738fa7",
  primaryVariant: "#678096",
  onPrimary: "#ffffff",
  primaryBorderColour: "#7D828B",
  primaryHover: "#0c4160",
  onPrimaryHover: "#ffffff",
  secondary: "#0c2d48",
  onSecondary: "#b1d4e0",
  secondaryHover: "#2e8bc0",
  onSecondaryHover: "#c0dce6",
  secondaryBorderColour: "#145da0",
  tertiary: "#d0d0e2",
  tertiaryBorderColour: "#7375a7",
  onTertiary: "#333333",
  link: "#284162",
  headerTitleColor: "#333333",

  detected: "#cc6600",
  notDetected: "#009999",
  notTested: "#666699",
  unknown: "#cccccc",

  warningTooltipBackground: "#ffcc99",
  warningTooltipBorderColour: "#ff9933"
};

// ############################################################
// ################## TRANSLATIONS ############################

// Different id names for the parts of a note:
export const NotePartIds = {
  DoubleLineBreak: "DOUBLELINEBREAK",
  SingleLineBreak: "LINEBREAK",
  Link: "Link"
}

let WebNotesCache = {};

// Translation: Helper class for doing translations
export class Translation {
  static register(resources){
      i18next.use(i18nextBrowserLanguageDetector).init({
          fallbackLng: "en",
          detection: {
              order: ['querystring', 'htmlTag', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'],
          },
          resources: resources
      })
      i18next.changeLanguage();
  }
  
  // Note:
  // For some food groups with special characters like "Fruits & Vegetables", we want the title to be displayed as "Fruits & Vegetables" instead of "Fruits &amp; Vegatables"
  //  After passing in the food group into the i18next library, the library encoded the food group to be "Fruits &amp; Vegatables"
  // So all the special characters got encoded to their corresponding HTML Entities (eg. &lt; , &gt; , &quot;)
  //
  // So we need to decode back the encoded string with HTML entities to turn back "Fruits &amp; Vegetables" to "Fruits & Vegetables"
  static translate(key, args){
      const result = i18next.t(key, args);

      if (typeof result !== 'string') return result;
      return he.decode(result);
  }

  // translateWebNotes(key): Translate the pop-up notes for the website
  static translateWebNotes(key) {
    let result = WebNotesCache[key];
    if (result !== undefined) return result;

    const noteParts = this.translate(key, {returnObjects: true});
    if (typeof noteParts === 'string') return null;

    result = "";
    for (const part of noteParts) {
        const partIsStr = typeof part === 'string';

        // adding line breaks
        if (partIsStr && part == NotePartIds.DoubleLineBreak) {
          result += "<br><br>";
          continue;
        } else if (partIsStr && part == NotePartIds.SingleLineBreak) {
          result += "<br>";
          continue;
        }

        const partType = part.type;

        // adding a link
        if (partType == NotePartIds.Link) {
          let currentText = '<a class="note-element"';
          let link = part.url;
          if (link === undefined) {
            link = "#";
          }

          currentText += ` href=${link}`;
          const openLinkToNewTab = part.openInNewTab;
          if (openLinkToNewTab !== undefined && openLinkToNewTab) {
            currentText += ` target="_blank"`;
          }

          currentText += `>${part.text}</a>`;
          result += currentText;
          continue;
        }

        // adding regular text
        let textClasses = [];
        let currentText = '<span class="note-element"';

        if (part.bold !== undefined && part.bold) {
            textClasses.push("boldTxt");
        }

        if (textClasses) {
            textClasses = textClasses.join(", ");
            textClasses = ` class="${textClasses}"`;
            currentText += textClasses;
        }
        
        currentText += `>${part.text}</span>`;
        result += currentText;
    }

    WebNotesCache[key] = result;
    return result;
}

  // translateNum(numStr, decimalPlaces): Translate a number to its correct
  //  numeric represented string for different languages
  // eg. '1.2' -> '1,2' in French
  //
  // Note:
  //  See https://www.i18next.com/translation-function/formatting for more formatting
  static translateNum(numStr, decimalPlaces = 1) {
      let num = Number(numStr);
      if (Number.isNaN(num)) return numStr;

      let translateArgs = {num}
      if (decimalPlaces) {
          translateArgs["minimumFractionDigits"] = decimalPlaces;
          translateArgs["maximumFractionDigits"] = decimalPlaces;
      }

      return this.translate("Number", translateArgs);
  }

  // translateScientificNum(numStr, decimalPlaces): Translates a number to its scientific notation
  static translateScientificNum(numStr, decimalPlaces = 1) {
    let result = Number.parseFloat(numStr).toExponential(decimalPlaces);
    return result.replace(/[0-9]+(.[0-9]+)?/, function(match) {
        return Translation.translateNum(match, decimalPlaces);
    })
  }

  // clearTranslationCache(): Clears any cached data related to translations
  static clearTranslationCache() {
    WebNotesCache = {};
  }

  // changeLanguage(lang): Changes or toggles the language
  static changeLanguage(lang = null) {
    if (lang === null) {
      lang = userLanguage == language.EN ? language.FR : language.EN
    }

    this.clearTranslationCache();
    userLanguage = lang;
    i18next.changeLanguage(lang);
  }
}


// Dimensions used in the visuals
export const VisualDims = {
  [GraphTypes.RBASG]: {
      width: 1500,
      height: 1000,
      marginTop: 10,
      marginRight: 10,
      marginBottom: 300,
      marginLeft: 100,

      horizontalAxisLabelYPos: 100,
      footerYPos: 140,
      footerFontSize: 12,
      footerLineSpacing: 5,
  },

  [GraphTypes.RBFG] : {
    width: 1500,
    height: 1000,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 300,
    marginLeft: 100,

    horizontalAxisLabelYPos: 120,
    footerYPos: 140,
    footerFontSize: 12,
    footerLineSpacing: 5,
  },

  [GraphTypes.RBF]: {
    width: 700,
    height: 700,
    arcPadding: 1,
    margin: 1
  },

  superScriptYOffset: -5,
  smallScriptFontSize: 9
}


/*
------------

English

------------
*/

const LangEN = {
  /**
   * Introductory Text
   */

  Number: "{{num, number}}",

  "websiteTabTitle": "Canadian Total Diet Study 2008-2023 Dietary Exposure Tool",
  "changeLanguage": "Français",
  "changeLanguageValue": language.FR,
  "close": "Close",

  "selectAll": "Select All",
  "deselectAll": "Deselect All",
  "noneSelected": "Nothing Selected",

  themes: {
    [ThemeNames.Light]: "Light",
    [ThemeNames.Dark]: "Dark",
    [ThemeNames.Blue]: "Blue"
  },

  errorMsgs: {
    notANumber: "Please enter a valid number",
    isNegative: "Please enter a positive number"
  },

  header: {
    title:
      "<b> Canadian Total Diet Study 2008-2023 Dietary Exposure Tool </b> from Health Canada’s Food and Nutrition Directorate",
    information: {
      moreInfoButton: "Data Sources",
      moreInfoContent: [
        "The data used to create this interactive tool are from the following sources:",
        '- The Canadian Total Diet Study results from the 2008-2023 collection years. Available on the <a href="https://open.canada.ca/data/en/dataset/01c12f93-d14c-4005-b671-e40030a3aa2c" target="_blank">Canadian Laboratory Information Network.</a>',
        '- <a href="https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130" target="_blank">The 2008-2023 Total Diet Study Food Consumption Tables (2015 CCHS-Nutrition).</a>',
      ],
      addDataHeaderText: "Add Customized Data",
      addDataContent: [
        "For testing purposes you can add a dummy set of data.",
        "Please download and use the .csv template provided here."
      ]
    },
    language: "Français",
    subtitle:
      "What is the estimated dietary exposure of Canadian populations to various chemicals? And which foods and food groups contribute the most to total dietary exposure?",
  },

  /**
   * Filter Titles and Options
   */

  filters: {
    graphSelects: {
      [GraphTypes.RBASG]: "Results by Age Group",
      [GraphTypes.RBF]: "Results by Food",
      [GraphTypes.RBFG]: "Results by Food Group",
    },
    titles: {
      selectGraphType: "Select Graph Type:",
      rbasgGraphSelectTitle: "Results by age-sex group",
      rbfgGraphSelectTitle: "Results by Food Group",
      rbfGraphSelectTitle: "Results by Food",
      selectChemical: "Select Chemical:",
      chemicalGroup: "Chemical Group",
      chemical: "Chemical",
      years: "Year(s)",
      multiSelSubtitle: "Multi-select with Ctrl",
      multiSelAllSubtitle: "Select all with Ctrl-a",
      lod: "Treatment of Values &ltLOD",
      lodSubtitle: "LOD Range: ",
      units: "Units",
      ageGroup: "Age Groups",
      age: "Age",
      sex: "Sex",
      domain: "View by",
      ageSexGroup: "Age-Sex Groups",
      range: "View as",
      sortBy: "Sort by",
      referenceLine: "Limit",
      overrideFood: "Food",
      overrideValue: "New Value",
      reset: "Reset"
    },
    placeholders: {
      select: "Select",
      none: "None",
    },
    lods: {
      [LODs[0]]: "0",
      [LODs["1/2 LOD"]]: "1/2 LOD",
      [LODs.LOD]: "LOD",
      [LODs.Exclude]: "Exclude",
    },
    consumptionUnits: {
      [ConsumptionUnits.PERSON]: "ng/day",
      [ConsumptionUnits.KGBW]: "ng/kg bw per day",
    },
    rbasgDomainFormat: {
      [RbasgDomainFormat.AGESEX]: "Age Group",
      [RbasgDomainFormat.YEAR]: "Year",
    },
    rbfgRangeFormat: {
      [RbfgRangeFormat.PERCENT]: "Percentages",
      [RbfgRangeFormat.ABSOLUTE]: "Absolute Values",
    },
    rbfSortByFormat: {
      [RbfSortByFormat.FOOD]: "Food",
      [RbfSortByFormat.GROUP]: "Food Group",
    },
    sandbox: {
      openButton: "Modify Graph/Values",
      closeButton: "Close",
      resetButton: "Reset",
      title: "Modify Graph/Values",
      subtitle:
        "Any new values that are added will apply to all three graphs.",
      referenceLineTitle: "Add Reference Line to Graph:",
      overrideTitle: "Override Occurrence Value(s):",
      overrideSubtitle:
        "This feature allows you to temporarily modify the data to estimate exposure under different scenarios. The modifications are not saved and will be cleared when the chemical is changed or the tool is refreshed or closed.",
      addOverrideButton: "Apply",
      removeOverrideButton: "-",
      showSuppressedTitle: "Consumption Values with CV > 33.3%",
      showSuppressedSubTitle:
        "Consumption values with high CV have been suppressed by default. You can choose to include them for calculating estimated exposures.",
      confirmShowSuppressedValues:
        "Warning from Statistics Canada: The user is advised that the consumption values with CV>33.3% do not meet Statistics Canada’s quality guidelines for this statistical program. Conclusions based on these data will be unreliable and most likely invalid. These data and any consequent findings should not be published. If the user choses to publish these findings, then this disclaimer must be published with the data.",
      showSuppressed: "Include",
      dontShowSuppressed: "Exclude",
    },
  },

  /**
   * Graph Info, Legends, and Graph Specifics
   */

  graphs: {
    info: {
      exposure: "Dietary Exposure",
      percentExposure: "% Dietary Exposure",
      occurrence: "Contaminant Occurrence (mean)",
      foodConsumption: "Food Composite Consumption (mean)",
      ageSexGroup: "Age-Sex Group",
      ageGroup: "Age Group",
      year: "Year",
    },
    legend: {
      sexGroup: "Sex",
      foodGroup: "Food Groups",
      sexGroups: {
        [sexGroups.B]: "Both",
        [sexGroups.F]: "Female",
        [sexGroups.M]: "Male",
      },
      allFoodGroups: "All Food Groups (Reset)"
    },
    saveGraph: {
      button: "Save Graph",
      footer:
        "Data Sources: Health Canada, Canadian Total Diet Study, CANLINE and Statistics Canada, 2015 Canadian Community Health Survey – Nutrition, 2015, Share File",
      filename: "Graph Export",
    },
    [GraphTypes.RBASG]: {
      titleByAgeGroups: "Dietary exposure estimate by age, {{ chemical }} Years: {{ selectedYears }}",
      titleByYears: "Dietary exposure estimate, age {{ ageGroups }}, {{ chemical }}",
      title: "Dietary Exposure Estimate by Age-Sex Group",
      range: "Dietary Exposure",
      domain: {
        [RbasgDomainFormat.AGESEX]: "Age Group",
        [RbasgDomainFormat.YEAR]: "Year",
      },
      footer: {
        units: [
          ["Radionuclides m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; µ = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Elements k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; M = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Food packaging k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Perfluorinated chemical m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Phthalates  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Polychlorinated Biphenols  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Volatile organic compounds k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
        ]
      }
    },
    [GraphTypes.RBF]: {
      title: "Dietary Exposure Estimate by Food, {{ chemical }}, {{ ageSex }} Years: {{ selectedYears }}",
    },
    [GraphTypes.RBFG]: {
      title: "Dietary Exposure Estimate by Food Group, {{ chemical }} Years: {{ selectedYears }}",
      titleInfo: [
        {text: "For more information on the food groups, see:"},
        NotePartIds.SingleLineBreak,
        {type: NotePartIds.Link, url: "https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130/resource/56d65830-da14-4d83-92f9-af0beec5a70a", text: "https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130/resource/56d65830-da14-4d83-92f9-af0beec5a70a", openInNewTab: true}
      ], 
      range: {
        [RbfgRangeFormat.PERCENT]: "% of Total Exposure",
        [RbfgRangeFormat.NUMBER]: "Dietary Exposure",
      },
      domain: "Age-Sex Group",
      footer: {
        units: [
          ["Radionuclides m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; µ = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Elements k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; M = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Food packaging k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Perfluorinated chemical m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Phthalates  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Polychlorinated Biphenols  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Volatile organic compounds k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
        ]
      }
    },
  },

  /**
   * Data Tables
   */

  dataTable: {
    title: "Data Table",
    buttons: {
      downloadContaminantData: "Download Occurrence Data",
      downloadConsumptionData: "Download Consumption Data",
      downloadDataTable: "Download Exposure Estimates",
      downloadTemplate: "Download Template .csv"
    },
    exportNames: {
      [ConsumptionUnits.PERSON]: "Food Consumption per Person per Day",
      [ConsumptionUnits.KGBW]: "Food Consumption per kg Bodyweight per Day",
      dataExport: "Data Export",
      calculations: "Dietary Exposure Calculations",
      consumptionTemplate: "Consumption Template",
      contaminantTemplate: "Contaminant Template"
    },
    headers: {
      [DataTableHeader.CHEMICAL]: "Chemical",
      [DataTableHeader.AGE_SEX_GROUP]: "Age-sex Group",
      [DataTableHeader.FOOD_GROUP]: "Food Group",
      [DataTableHeader.COMPOSITE_NAME]: "Food Name",
      [DataTableHeader.COMPOSITE_CODE]: "Food Code",
      [DataTableHeader.PERCENT_EXPOSURE]: "% of Total Exposure",
      [DataTableHeader.EXPOSURE]: "Exposure Estimate",
      [DataTableHeader.EXPOSURE_UNIT]: "Unit",
      [DataTableHeader.YEARS]: "Year(s)",
      [DataTableHeader.PERCENT_NOT_TESTED]: "% Foods Not Tested",
      [DataTableHeader.PERCENT_UNDER_LOD]: "% Occurrence Values <LOD",
      [DataTableHeader.TREATMENT]: "Treatment of <LOD",
      [DataTableHeader.MODIFIED]: "User-modified Values",
      [DataTableHeader.FLAGGED]:
        "'E' Flag: Marginal - CV > 16.6% but CV < 33.3%",
      [DataTableHeader.SUPPRESSED]: "'F' Flag: data suppressed",
      [DataTableHeader.INCLUDED_SUPPRESSED]:
        "Included values with 'F' Flag CV > 33.3 %",
    },
    values: {
      occurrence: "Occurrence",
    },
  },

  /**
   * About Section
   */

  about: {
    title: "About the Tool",
    table: [
      {
        header: "First Row Example",
        value:
          "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      },
      {
        header: "More for the Second Row",
        value:
          "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      },
      {
        header: "Third Row with Random Text",
        value:
          "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      },
    ],
  },

  /**
   * Misc.
   */

  misc: {
    sexGroups: {
      [sexGroups.F]: "F",
      [sexGroups.M]: "M",
      [sexGroups.B]: "M/F",
      "Both1To8": "M/F (1-8 yrs)",
      "Both9Plus": "M/F (9+ yrs)"
    },
    noDataMsg: "No results above LOD",
    na: "NA",
    consumptionUnitShort: {
      [ConsumptionUnits.KGBW]: "/kg BW/day",
      [ConsumptionUnits.PERSON]: "/person/day",
    },
    gramsShort: "g",
  },

  /**
   * Data (TDS)
   */

  tdsData: {
    headers: {
      /* Consumption */
      [DataColumn.MAPPING_COMPOSITE_DESC]:
        "Composite Description (TDS_FC_Label)",
      [DataColumn.MAPPING_COMPOSITE_CODE]: "Composite Code (TDS_FC_Code)",
      [DataColumn.MAPPING_COMPOSITE_CONTENT]:
        "Description of the content included in composite",
      [DataColumn.POPULATION]: "population",
      [DataColumn.POPULATION_GROUP]: "Population_group",
      [DataColumn.COMPOSITE_DESC]: "TDS_FC_label",
      [DataColumn.COMPOSITE_CODE]: "TDS_FC_Code",
      [DataColumn.MEAN_FLAG]: "Mean_flag",
      [DataColumn.MEAN_G_PPPD]: "Mean_grams_per_person_per_day",
      [DataColumn.MEAN_G_PKGBWPD]:
        "Mean_grams_per_kilogrambodyweight_per_day",
      /* Contaminant */
      [DataColumn.CHEMICAL_GROUP]: "Analyte Group",
      [DataColumn.CHEMICAL]: "Analyte Name",
      [DataColumn.COLLECTION_DATE]: "Sample Collection Date",
      [DataColumn.PROJECT_CODE]: "Project Code",
      [DataColumn.SAMPLE_CODE]: "Sample Code",
      [DataColumn.PRODUCT_DESC]: "Product Description",
      [DataColumn.RESULT_VALUE]: "Result Value",
      [DataColumn.UNIT]: "Units of measurement",
      [DataColumn.LOD]: "LOD",
      [DataColumn.MDL]: "MDL",
    },
    values: {
      allPeople: "All people",
      radionuclides: "Radionuclides",
      totalRadionuclides: "Total Radionuclides",
      PFAS: "Perfluorinated chemicals (PFCs)",
      PFASGroupings: {
        [PFASGroupings.TOTAL_PFAS]:
          "Total PFAS (Per-and polyfluoroalkyl substances)",
        [PFASGroupings.TOTAL_PFCA]: "Total PFCA (Perfluorocarboxylic acid)",
        [PFASGroupings.TOTAL_PFS]: "Total PFS (Perfluorosulfonate)",
        [PFASGroupings.TOTAL_PFOSA]: "Total PFOSA (Perfluorosulfonamide)",
        [PFASGroupings.LC_PFCA]:
          "Total LC-PFCA (Long-chained perfluorocarboxylic acid) (≥C8)",
        [PFASGroupings.LC_PFS]:
          "Total LC-PFS (Long-chained perfluorosulfonate) (≥C6)",
        [PFASGroupings.SC_PFCA]:
          "Total SC-PFCA (Short-chained perfluorocarboxylic acid) (≤C7)",
        [PFASGroupings.SC_PFS]:
          "Total SC-PFS (Short-chained perfluorosulfonate) (≤C5)",
      },
      PFASMapping: {
        [PFASGroupings.TOTAL_PFAS]: [
          "Perfluoro-n-octanoic acid (PFOA)",
          "Perfluoro-n-nonanoic acid (PFNA)",
          "Perfluoro-n-decanoic acid (PFDA)",
          "Perfluoro-n-undecanoic acid (PFUdA)",
          "Perfluoro-n-dodecanoic acid (PFDoA)",
          "Perfluoro-n-tridecanoic acid (PFTrDA)",
          "Perfluoro-n-tetradecanoic acid (PFTeDA)",
          "Perfluoro-n-hexadecanoic acid (PFHxDA)",
          "Perfluoro-n-octadecanoic acid (PFODA)",
          "2-perfluorooctyl ethanoic acid (FOEA)",
          "2-perfluorodecyl ethanoic acid (FDEA)",
          "2H-perfluoro-2-decenoic acid (FOUEA)",
          "2H-perfluoro-2-dodecenoic acid (FDUEA)",
          "Perfluoro-1-hexanesulfonate (PFHxS)",
          "Perfluoro-1-heptanesulfonate (L-PFHpS)",
          "Perfluorooctanesulfonate (PFOS total)",
          "Perfluoro-1-nonanesulfonate (L-PFNS)",
          "Perfluoro-1-decanesulfonate (L-PFDS)",
          "Perfluoro-1-dodecanesulfonate (L-PFDoS)",
          "Perfluoro-n-butanoic acid (PFBA)",
          "Perfluoro-n-pentanoic acid (PFPeA)",
          "Perfluoro-n-heptanoic acid (PFHpA)",
          "2-perfluorohexyl ethanoic acid (FHEA)",
          "2H-perfluoro-2-octenoic acid (FHUEA)",
          "Acide perfluoro-n-hexanoïque (PFHxA)",
          "Perfluoro-1-butanesulfonate (L-PFBS)",
          "Perfluoro-1-pentanesulfonate (L-PFPeS)",
        ],
        [PFASGroupings.TOTAL_PFCA]: [
          "Perfluoro-n-octanoic acid (PFOA)",
          "Perfluoro-n-nonanoic acid (PFNA)",
          "Perfluoro-n-decanoic acid (PFDA)",
          "Perfluoro-n-undecanoic acid (PFUdA)",
          "Perfluoro-n-dodecanoic acid (PFDoA)",
          "Perfluoro-n-tridecanoic acid (PFTrDA)",
          "Perfluoro-n-tetradecanoic acid (PFTeDA)",
          "Perfluoro-n-hexadecanoic acid (PFHxDA)",
          "Perfluoro-n-octadecanoic acid (PFODA)",
          "2-perfluorooctyl ethanoic acid (FOEA)",
          "2-perfluorodecyl ethanoic acid (FDEA)",
          "2H-perfluoro-2-decenoic acid (FOUEA)",
          "2H-perfluoro-2-dodecenoic acid (FDUEA)",
          "Perfluoro-n-butanoic acid (PFBA)",
          "Perfluoro-n-pentanoic acid (PFPeA)",
          "Perfluoro-n-heptanoic acid (PFHpA)",
          "2-perfluorohexyl ethanoic acid (FHEA)",
          "2H-perfluoro-2-octenoic acid (FHUEA)",
          "Acide perfluoro-n-hexanoïque (PFHxA)",
        ],
        [PFASGroupings.TOTAL_PFS]: [
          "Perfluoro-1-hexanesulfonate (PFHxS)",
          "Perfluoro-1-heptanesulfonate (L-PFHpS)",
          "Perfluorooctanesulfonate (PFOS total)",
          "Perfluoro-1-nonanesulfonate (L-PFNS)",
          "Perfluoro-1-decanesulfonate (L-PFDS)",
          "Perfluoro-1-dodecanesulfonate (L-PFDoS)",
          "Perfluoro-1-butanesulfonate (L-PFBS)",
          "Perfluoro-1-pentanesulfonate (L-PFPeS)",
        ],
        [PFASGroupings.TOTAL_PFOSA]: [
          "Perfluorooctanesulfonamide (PFOSA)",
          "Methylperfluorooctanesulfonamide (MeFOSA)",
          "Ethylperfluorooctanidesulfonamide (EtFOSA)",
        ],
        [PFASGroupings.LC_PFCA]: [
          "Perfluoro-n-octanoic acid (PFOA)",
          "Perfluoro-n-nonanoic acid (PFNA)",
          "Perfluoro-n-decanoic acid (PFDA)",
          "Perfluoro-n-undecanoic acid (PFUdA)",
          "Perfluoro-n-dodecanoic acid (PFDoA)",
          "Perfluoro-n-tridecanoic acid (PFTrDA)",
          "Perfluoro-n-tetradecanoic acid (PFTeDA)",
          "Perfluoro-n-hexadecanoic acid (PFHxDA)",
          "Perfluoro-n-octadecanoic acid (PFODA)",
          "2-perfluorooctyl ethanoic acid (FOEA)",
          "2-perfluorodecyl ethanoic acid (FDEA)",
          "2H-perfluoro-2-decenoic acid (FOUEA)",
          "2H-perfluoro-2-dodecenoic acid (FDUEA)",
        ],
        [PFASGroupings.LC_PFS]: [
          "Perfluoro-1-hexanesulfonate (PFHxS)",
          "Perfluoro-1-heptanesulfonate (L-PFHpS)",
          "Perfluorooctanesulfonate (PFOS total)",
          "Perfluoro-1-nonanesulfonate (L-PFNS)",
          "Perfluoro-1-decanesulfonate (L-PFDS)",
          "Perfluoro-1-dodecanesulfonate (L-PFDoS)",
        ],
        [PFASGroupings.SC_PFCA]: [
          "Perfluoro-n-butanoic acid (PFBA)",
          "Perfluoro-n-pentanoic acid (PFPeA)",
          "Perfluoro-n-heptanoic acid (PFHpA)",
          "2-perfluorohexyl ethanoic acid (FHEA)",
          "2H-perfluoro-2-octenoic acid (FHUEA)",
          "Acide perfluoro-n-hexanoïque (PFHxA)",
        ],
        [PFASGroupings.SC_PFS]: [
          "Perfluoro-1-butanesulfonate (L-PFBS)",
          "Perfluoro-1-pentanesulfonate (L-PFPeS)",
        ],
      },
    },
  },

      // reference: https://datatables.net/plug-ins/i18n/English.html
    // note:
    //  For some reason the CDN link provided in the documentation causes
    //  some errors with the datatables, so we copied the content of the
    //  translation JSON file here
    dataTableTemplate: {
      "emptyTable": "No data available in table",
      "info": "Showing _START_ to _END_ of _TOTAL_ entries",
      "infoEmpty": "Showing 0 to 0 of 0 entries",
      "infoFiltered": "(filtered from _MAX_ total entries)",
      "infoThousands": ",",
      "lengthMenu": "Show _MENU_ entries",
      "loadingRecords": "Loading...",
      "processing": "Processing...",
      "search": "Search:",
      "zeroRecords": "No matching records found",
      "thousands": ",",
      "paginate": {
          "first": "First",
          "last": "Last",
          "next": "Next",
          "previous": "Previous"
      },
      "aria": {
          "sortAscending": ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
      },
      "autoFill": {
          "cancel": "Cancel",
          "fill": "Fill all cells with <i>%d</i>",
          "fillHorizontal": "Fill cells horizontally",
          "fillVertical": "Fill cells vertically"
      },
      "buttons": {
          "collection": "Collection <span class='ui-button-icon-primary ui-icon ui-icon-triangle-1-s'/>",
          "colvis": "Column Visibility",
          "colvisRestore": "Restore visibility",
          "copy": "Copy",
          "copyKeys": "Press ctrl or u2318 + C to copy the table data to your system clipboard.<br><br>To cancel, click this message or press escape.",
          "copySuccess": {
              "1": "Copied 1 row to clipboard",
              "_": "Copied %d rows to clipboard"
          },
          "copyTitle": "Copy to Clipboard",
          "csv": "CSV",
          "excel": "Excel",
          "pageLength": {
              "-1": "Show all rows",
              "_": "Show %d rows"
          },
          "pdf": "PDF",
          "print": "Print",
          "updateState": "Update",
          "stateRestore": "State %d",
          "savedStates": "Saved States",
          "renameState": "Rename",
          "removeState": "Remove",
          "removeAllStates": "Remove All States",
          "createState": "Create State"
      },
      "searchBuilder": {
          "add": "Add Condition",
          "button": {
              "0": "Search Builder",
              "_": "Search Builder (%d)"
          },
          "clearAll": "Clear All",
          "condition": "Condition",
          "conditions": {
              "date": {
                  "after": "After",
                  "before": "Before",
                  "between": "Between",
                  "empty": "Empty",
                  "equals": "Equals",
                  "not": "Not",
                  "notBetween": "Not Between",
                  "notEmpty": "Not Empty"
              },
              "number": {
                  "between": "Between",
                  "empty": "Empty",
                  "equals": "Equals",
                  "gt": "Greater Than",
                  "gte": "Greater Than Equal To",
                  "lt": "Less Than",
                  "lte": "Less Than Equal To",
                  "not": "Not",
                  "notBetween": "Not Between",
                  "notEmpty": "Not Empty"
              },
              "string": {
                  "contains": "Contains",
                  "empty": "Empty",
                  "endsWith": "Ends With",
                  "equals": "Equals",
                  "not": "Not",
                  "notEmpty": "Not Empty",
                  "startsWith": "Starts With",
                  "notContains": "Does Not Contain",
                  "notStartsWith": "Does Not Start With",
                  "notEndsWith": "Does Not End With"
              },
              "array": {
                  "without": "Without",
                  "notEmpty": "Not Empty",
                  "not": "Not",
                  "contains": "Contains",
                  "empty": "Empty",
                  "equals": "Equals"
              }
          },
          "data": "Data",
          "deleteTitle": "Delete filtering rule",
          "leftTitle": "Outdent Criteria",
          "logicAnd": "And",
          "logicOr": "Or",
          "rightTitle": "Indent Criteria",
          "title": {
              "0": "Search Builder",
              "_": "Search Builder (%d)"
          },
          "value": "Value"
      },
      "searchPanes": {
          "clearMessage": "Clear All",
          "collapse": {
              "0": "SearchPanes",
              "_": "SearchPanes (%d)"
          },
          "count": "{total}",
          "countFiltered": "{shown} ({total})",
          "emptyPanes": "No SearchPanes",
          "loadMessage": "Loading SearchPanes",
          "title": "Filters Active - %d",
          "showMessage": "Show All",
          "collapseMessage": "Collapse All"
      },
      "select": {
          "cells": {
              "1": "1 cell selected",
              "_": "%d cells selected"
          },
          "columns": {
              "1": "1 column selected",
              "_": "%d columns selected"
          },
          "rows": {
              "1": "1 row selected",
              "_": "%d rows selected"
          }
      },
      "datetime": {
          "previous": "Previous",
          "next": "Next",
          "hours": "Hour",
          "minutes": "Minute",
          "seconds": "Second",
          "unknown": "-",
          "amPm": [
              "am",
              "pm"
          ],
          "weekdays": [
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat"
          ],
          "months": [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
          ]
      },
      "editor": {
          "close": "Close",
          "create": {
              "button": "New",
              "title": "Create new entry",
              "submit": "Create"
          },
          "edit": {
              "button": "Edit",
              "title": "Edit Entry",
              "submit": "Update"
          },
          "remove": {
              "button": "Delete",
              "title": "Delete",
              "submit": "Delete",
              "confirm": {
                  "1": "Are you sure you wish to delete 1 row?",
                  "_": "Are you sure you wish to delete %d rows?"
              }
          },
          "error": {
              "system": "A system error has occurred (<a target=\"\\\" rel=\"nofollow\" href=\"\\\">More information</a>)."
          },
          "multi": {
              "title": "Multiple Values",
              "info": "The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.",
              "restore": "Undo Changes",
              "noMulti": "This input can be edited individually, but not part of a group. "
          }
      },
      "stateRestore": {
          "renameTitle": "Rename State",
          "renameLabel": "New Name for %s:",
          "renameButton": "Rename",
          "removeTitle": "Remove State",
          "removeSubmit": "Remove",
          "removeJoiner": " and ",
          "removeError": "Failed to remove state.",
          "removeConfirm": "Are you sure you want to remove %s?",
          "emptyStates": "No saved states",
          "emptyError": "Name cannot be empty.",
          "duplicateError": "A state with this name already exists.",
          "creationModal": {
              "toggleLabel": "Includes:",
              "title": "Create New State",
              "select": "Select",
              "searchBuilder": "SearchBuilder",
              "search": "Search",
              "scroller": "Scroll Position",
              "paging": "Paging",
              "order": "Sorting",
              "name": "Name:",
              "columns": {
                  "visible": "Column Visibility",
                  "search": "Column Search"
              },
              "button": "Create"
          }
      }
  }
}


/*
------------

French 

------------
*/


const REMPLACER_MOI = "REMPLACER MOI"

const LangFR = {
  Number: "{{num, number}}",

  "websiteTabTitle": "Outil d'exposition alimentaire de l'Étude canadienne sur l'alimentation totale 2008-2023",
  "changeLanguage": "English",
  "changeLanguageValue": language.EN,
  "close": "Fermer",

  "selectAll": "Tout Sélectionner",
  "deselectAll": "Désélectionner Tout",
  "noneSelected": "Aucun Sélectionné",

  errorMsgs: {
    notANumber: "Veuillez entrer un nombre",
    isNegative: "Veuillez entrer un nombre positif"
  },

  themes: {
    [ThemeNames.Light]: "Clair",
    [ThemeNames.Dark]: "Sombre",
    [ThemeNames.Blue]: "Bleu"
  },

  header: {
    title:
      "<b>Outil d'exposition alimentaire de l'Étude canadienne sur l'alimentation totale 2008-2023</b> de la Direction des aliments et de la nutrition de Santé Canada",
    information: {
      moreInfoButton: "Sources de données",
      moreInfoContent: [
        "Les données utilisées pour créer cet outil interactif proviennent des sources suivantes :",
        '- Résultats de l\'Étude canadienne sur l\'alimentation totale pour les années de collecte 2008-2023. Disponible sur le <a href="https://open.canada.ca/data/en/dataset/01c12f93-d14c-4005-b671-e40030a3aa2c" target="_blank">Réseau canadien d\'information sur les laboratoires</a>',
        '- <a href="https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130" target="_blank">Les tableaux de consommation alimentaire de l\'étude de l\'alimentation totale 2008-2023 (2015 ESCC-Nutrition).</a>',
      ],
      addDataHeaderText: REMPLACER_MOI,
      addDataContent: [
        REMPLACER_MOI
      ]
    },
    language: "English",
    subtitle:
      "Quelle est l'exposition alimentaire estimée des populations canadiennes à divers produits chimiques ? Quels sont les aliments et les groupes d'aliments qui contribuent le plus à l'exposition alimentaire totale ?",
  },

  filters: {
    graphSelects: {
      [GraphTypes.RBASG]: "Résultats par groupe d'âge et de sexe",
      [GraphTypes.RBF]: "Résultats par aliments",
      [GraphTypes.RBFG]: "Résultats par groupe d'aliments",
    },
    titles: {
      selectGraphType: "Sélectionnez le type de graphique:",
      rbasgGraphSelectTitle: "Résultat par groupe d’âge-sexe",
      rbfgGraphSelectTitle: "Résultat par groupe d’aliments",
      rbfGraphSelectTitle: "Résultat par aliment",
      selectChemical: "Sélectionnez le produit chimique:",
      chemicalGroup: "Groupe chimique",
      chemical: "Produit chimique",
      years: "Année(s)",
      multiSelSubtitle: "Multi-sélection avec Ctrl",
      multiSelAllSubtitle: "Tout sélectionner avec Ctrl-a",
      lod: "Traitement des valeurs <LD",
      lodSubtitle: "Fourchette LD: ",
      units: "Unités",
      ageGroup: "Groupes d'âge",
      age: "Âge",
      sex: "Sexe",
      domain: "Voir par",
      ageSexGroup: "Groupes âge-sexe",
      range: "Voir comme",
      sortBy: "Trier par",
      referenceLine: "Limite",
      overrideFood: "Aliment",
      overrideValue: "Nouvelle valeur",
      reset: "Réinitialiser"
    },
    placeholders: {
      select: "Sélectionner",
      none: "Aucun",
    },
    lods: {
      [LODs[0]]: "0",
      [LODs["1/2 LOD"]]: "1/2 LD",
      [LODs.LOD]: "LD",
      [LODs.Exclude]: "Exclure",
    },
    consumptionUnits: {
      [ConsumptionUnits.PERSON]: "ng/jour",
      [ConsumptionUnits.KGBW]: "ng/kg pc par jour",
    },
    rbasgDomainFormat: {
      [RbasgDomainFormat.AGESEX]: "Groupe d'âge",
      [RbasgDomainFormat.YEAR]: "Année",
    },
    rbfgRangeFormat: {
      [RbfgRangeFormat.PERCENT]: "Pourcentages",
      [RbfgRangeFormat.ABSOLUTE]: "Valeurs absolues",
    },
    rbfSortByFormat: {
      [RbfSortByFormat.FOOD]: "Aliment",
      [RbfSortByFormat.GROUP]: "Groupe alimentaire",
    },
    sandbox: {
      openButton: "Modifier le graphique/les valeurs",
      closeButton: "Fermer",
      resetButton: "Réinitialiser",
      title: "Modifier le graphique/les valeurs",
      subtitle:
        "Toute nouvelle valeur ajoutée s'appliquera aux trois graphiques.",
      referenceLineTitle: "Ajouter une ligne de référence au graphique :",
      overrideTitle: "Remplacer la valeur(s) d’occurrence :",
      overrideSubtitle:
        "Cette fonction permet de modifier temporairement les données afin d'estimer l'exposition selon différents scénarios. Les modifications ne sont pas sauvegardées et seront effacées lorsque le produit chimique sera modifié ou lorsque l'outil sera actualisé ou fermé.",
      addOverrideButton: "Appliquer",
      removeOverrideButton: "-",
      showSuppressedTitle: "Valeurs de consommation avec CV > 33.3%",
      showSuppressedSubTitle:
        "Les valeurs de consommation ayant un CV élevé ont été supprimées par défaut. Vous pouvez choisir de les inclure dans le calcul des expositions estimées.",
      confirmShowSuppressedValues:
        "Avertissement de Statistique Canada : L'utilisateur est avisé que les valeurs de consommation dont le CV est supérieur à 33,3 % ne satisfont pas aux lignes directrices de Statistique Canada en matière de qualité pour ce programme statistique. Les conclusions basées sur ces données ne seront pas fiables et très probablement invalides. Ces données et les résultats qui en découlent ne doivent pas être publiés. Si l'utilisateur choisit de publier ces résultats, cet avertissement doit être publié avec les données.",
      showSuppressed: "Include (TODO)",
      dontShowSuppressed: "Exclude (TODO)",
    },
  },

  graphs: {
    info: {
      exposure: "Exposition Alimentaire",
      percentExposure: "% Exposition Alimentaire ",
      occurrence: "Occurrence du contaminant (moyenne)",
      foodConsumption: "Consommation composite d'aliments (moyenne)",
      ageSexGroup: "Groupe âge-sexe",
      ageGroup: "Groupe d'âge",
      year: "Année",
    },
    legend: {
      sexGroup: "Sexe",
      foodGroup: "Groupes d'aliments d’EAT",
      sexGroups: {
        [sexGroups.B]: "Les deux",
        [sexGroups.F]: "Femme",
        [sexGroups.M]: "Homme",
      },
      allFoodGroups: "Tous les groupes d’aliments (réinitialiser)"
    },
    saveGraph: {
      button: "Enregistrer le graphique",
      footer:
        "Sources des données : Santé Canada, Étude canadienne sur l'alimentation totale, CANLINE et Statistique Canada, Enquête sur la santé dans les collectivités canadiennes 2015 - Nutrition, 2015, Share File",
      filename: "Exportation du graphique",
    },
    [GraphTypes.RBASG]: {
      titleByAgeGroups: "Estimation de l'exposition alimentaire par âge, {{ chemical }} Années: {{ selectedYears }}",
      titleByYears: "Estimation de l'exposition alimentaire, âge {{ ageGroups }}, {{ chemical }}",
      title: "Estimation de l'exposition alimentaire par groupe d'âge et de sexe",
      range: "Exposition alimentaire",
      domain: {
        [RbasgDomainFormat.AGESEX]: "Groupe d'âge",
        [RbasgDomainFormat.YEAR]: "Année",
      },
      footer: {
        units: [
          ["Radionucléides m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; µ = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Éléments k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; M = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Produits chimiques dans les emballages alimentaires k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Produits chimiques perfluorés m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Phtalates  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Biphényles polychlorés  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Composés organiques volatils k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}]
        ]
      }
    },
    [GraphTypes.RBF]: {
      title: "Estimation de l'exposition alimentaire par aliment, {{ chemical }}, {{ ageSex }} Années: {{ selectedYears }}",
    },
    [GraphTypes.RBFG]: {
      title: "Estimation de l'exposition alimentaire par groupe d'aliments, {{ chemical }} Années: {{ selectedYears }}",
      titleInfo: [
        {text: "Pour plus d’informations sur les groupes d’aliments, voir:"},
        NotePartIds.SingleLineBreak,
        {type: NotePartIds.Link, url: "https://ouvert.canada.ca/data/fr/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130/resource/5c9eec7f-03f6-40fb-ad21-d74d5b0f6af6", text: "https://ouvert.canada.ca/data/fr/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130/resource/5c9eec7f-03f6-40fb-ad21-d74d5b0f6af6", openInNewTab: true}
      ], 
      range: {
        [RbfgRangeFormat.PERCENT]: "% de l'exposition totale",
        [RbfgRangeFormat.NUMBER]: "Exposition alimentaire",
      },
      domain: "Groupe d'âge et de sexe",
      footer: {
        units: [
          ["Radionucléides m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; µ = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Éléments k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}, "; M = 10", {text: "6", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Produits chimiques dans les emballages alimentaires k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Produits chimiques perfluorés m = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Phtalates  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Biphényles polychlorés  k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}],
          ["Composés organiques volatils k = 10", {text: "3", atts: {"dy": VisualDims.superScriptYOffset, "font-size": VisualDims.smallScriptFontSize}}]
        ]
      }
    },
  },

  dataTable: {
    title: "Tableaux de données",
    buttons: {
      downloadContaminantData: "Télécharger les données d'occurrence",
      downloadConsumptionData: "Télécharger les données de consommation",
      downloadDataTable: "Télécharger les estimations d'exposition",
      downloadTemplate: "Télécharger Modèle .csv"
    },
    exportNames: {
      [ConsumptionUnits.PERSON]:
        "Consommation alimentaire par personne et par jour",
      [ConsumptionUnits.KGBW]:
        "Consommation alimentaire par kg de poids corporel par jour",
      dataExport: "Exportation de données",
      calculations: "Calculs d’exposition alimentaire",
      consumptionTemplate: "Modèle de Consommation",
      contaminantTemplate: "Modèle de Contaminant"
    },
    headers: {
      [DataTableHeader.CHEMICAL]: "Produit chimique",
      [DataTableHeader.AGE_SEX_GROUP]: "Groupe âge-sexe",
      [DataTableHeader.FOOD_GROUP]: "Groupe d’aliments d’EAT",
      [DataTableHeader.COMPOSITE_NAME]: "Nom de l'aliment",
      [DataTableHeader.COMPOSITE_CODE]: "Code de l'aliment",
      [DataTableHeader.PERCENT_EXPOSURE]: "% de l'exposition totale",
      [DataTableHeader.EXPOSURE]: "Estimation de l'exposition",
      [DataTableHeader.EXPOSURE_UNIT]: "Unité",
      [DataTableHeader.YEARS]: "Année(s)",
      [DataTableHeader.PERCENT_NOT_TESTED]: "% aliments non analysés",
      [DataTableHeader.PERCENT_UNDER_LOD]: "% valeurs d’occurrence <LD",
      [DataTableHeader.TREATMENT]: "Traitement de <LD",
      [DataTableHeader.MODIFIED]: "Valeurs modifiées par l'utilisateur",
      [DataTableHeader.FLAGGED]:
        "Indicateur 'E' : Marginal - CV > 16,6 % mais CV < 33,3 %",
      [DataTableHeader.SUPPRESSED]:
        "Indicateur 'F' : Inacceptable, données supprimées",
      [DataTableHeader.INCLUDED_SUPPRESSED]:
        "Valeurs incluses avec CV indicateur 'F' > 33,3%",
    },
    values: {
      occurrence: "Occurrence",
    },
  },

  about: {
    title: "A propos de l'outil",
    table: [
      {
        header: "First Row Example",
        value:
          "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      },
      {
        header: "More for the Second Row",
        value:
          "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      },
      {
        header: "Third Row with Random Text",
        value:
          "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      },
    ],
  },

  misc: {
    sexGroups: {
      [sexGroups.F]: "F",
      [sexGroups.M]: "H",
      [sexGroups.B]: "H/F",
      "Both1To8": "H/F (1-8 ans)",
      "Both9Plus": "H/F (9+ ans)"
    },
    noDataMsg: "Aucun résultat supérieur à LD",
    na: "NA",
    consumptionUnitShort: {
      [ConsumptionUnits.KGBW]: "/kg pc/jour",
      [ConsumptionUnits.PERSON]: "/personne/jour",
    },
    gramsShort: "g",
  },

  tdsData: {
    headers: {
      /* Consumption */
      [DataColumn.MAPPING_COMPOSITE_DESC]:
        "Description du composite alimentaire (EAT_AC_étiquette)",
      [DataColumn.MAPPING_COMPOSITE_CODE]:
        "Code de composite (EAT_AC_Code)",
      [DataColumn.MAPPING_COMPOSITE_CONTENT]:
        "La description des aliments inclus dans la mise en correspondance des composites",
      [DataColumn.POPULATION]: "population",
      [DataColumn.POPULATION_GROUP]: "Groupe_de_population",
      [DataColumn.COMPOSITE_DESC]: "EAT_AC_étiquette",
      [DataColumn.COMPOSITE_CODE]: "EAT_AC_Code",
      [DataColumn.MEAN_FLAG]: "Moy_indicateur",
      [DataColumn.MEAN_G_PPPD]: "Moy_grammes_par_personne_par_jour",
      [DataColumn.MEAN_G_PKGBWPD]:
        "Moy_grammes_par_kilogramme_de_poids_corporel_par_jour ",
      /* Contaminant */
      [DataColumn.CHEMICAL_GROUP]: "Groupe de l'analyte",
      [DataColumn.CHEMICAL]: "Nom de l'analyte",
      [DataColumn.COLLECTION_DATE]: "Date de l'échantillonnage",
      [DataColumn.PROJECT_CODE]: "Code du projet",
      [DataColumn.SAMPLE_CODE]: "Code de l'échantillon",
      [DataColumn.PRODUCT_DESC]: "Description du produit",
      [DataColumn.RESULT_VALUE]: "Valeur du résultat",
      [DataColumn.UNIT]: "Unités de mesure",
      [DataColumn.LOD]: "Limite de détection",
      [DataColumn.MDL]: "Limite de détection de la méthode",
    },
    values: {
      allPeople: "Toutes les personnes",
      radionuclides: "Radionucléides",
      totalRadionuclides: "Radionucléides Totales",
      PFAS: "Produits chimiques perfluorés (PFC) ",
      PFASGroupings: {
        [PFASGroupings.TOTAL_PFAS]:
          "SPFA Totale (Substances perfluoroalkyliques et polyfluoroalkyliques)",
        [PFASGroupings.TOTAL_PFCA]:
          "APFC Totale (Acides perfluorocarboxyliques)",
        [PFASGroupings.TOTAL_PFS]: "PFS Totale (Perfluorosulfonates)",
        [PFASGroupings.TOTAL_PFOSA]: "PFOSA Totale (Perfluorosulfonamide)",
        [PFASGroupings.LC_PFCA]:
          "APFC-LC Totale (Acides perfluorocarboxyliques à longue chaîne) (≥C8)",
        [PFASGroupings.LC_PFS]:
          "PFS-LC Totale (Perfluorosulfonates à longue chaîne) (≥C6)",
        [PFASGroupings.SC_PFCA]:
          "APFC-CC Totale (Acides perfluorocarboxyliques à chaîne courte) (≤C7)",
        [PFASGroupings.SC_PFS]:
          "PFS-CC Totale (Perfluorosulfonates à chaîne courte) (≤C5)",
      },
      PFASMapping: {
        [PFASGroupings.TOTAL_PFAS]: [
          "Acide perfluoro-n-octanoïque (PFOA)",
          "Acide perfluoro-n-nonanoïque (PFNA)",
          "Acide perfluoro-n-décanoïque (PFDA)",
          "Acide perfluoro-n-undécanoïque (PFUdA)",
          "Acide perfluoro-n-dodécanoïque (PFDoA)",
          "Acide perfluoro-n-tridécanoïque (PFTrDA)",
          "Acide perfluoro-n-tétradécanoïque (PFTeDA)",
          "Acide perfluoro-n-hexadécanoïque (PFHxDA)",
          "Acide perfluoro-n-octadécanoïque (PFODA)",
          "2 - perfluorooctyl éthanoïque (FOEA)",
          "2 - perfluorodécyle éthanoïque (FDEA)",
          "Acide 2H-perfluorodécènoïque (FOUEA)",
          "Acide 2H-perfluorododécènoïque (FDUEA)",
          "Sulfonate de perfluoro-n-hexane (PFHxS)",
          "Sulfonate de perfluoro-n-heptane (L-PFHpS)",
          "Sulfonate de perfluoro-n-octane (PFOS totale)",
          "Sulfonate de perfluoro-n-nonane (L-PFNS)",
          "Sulfonate de perfluoro-n-décane (L-PFDS)",
          "Sulfonate de perfluoro-n-dodécane (L-PFDoS)",
          "Acide perfluoro-n-butanoïque (PFBA)",
          "Acide perfluoro-n-pentanoïque (PFPeA)",
          "Acide perfluoro-n-heptanoïque (PFHpA)",
          "2 - perfluorohexyle éthanoïque (FHEA)",
          "Acide 2H-perfluorooctènoïque (FHUEA)",
          "Acide perfluoro-n-hexanoïque (PFHxA)",
          "Sulfonate de perfluoro-n-butane (L-PFBS)",
          "Sulfonate de perfluoro-n-pentane (L-PFPeS)",
        ],
        [PFASGroupings.TOTAL_PFCA]: [
          "Acide perfluoro-n-octanoïque (PFOA)",
          "Acide perfluoro-n-nonanoïque (PFNA)",
          "Acide perfluoro-n-décanoïque (PFDA)",
          "Acide perfluoro-n-undécanoïque (PFUdA)",
          "Acide perfluoro-n-dodécanoïque (PFDoA)",
          "Acide perfluoro-n-tridécanoïque (PFTrDA)",
          "Acide perfluoro-n-tétradécanoïque (PFTeDA)",
          "Acide perfluoro-n-hexadécanoïque (PFHxDA)",
          "Acide perfluoro-n-octadécanoïque (PFODA)",
          "2 - perfluorooctyl éthanoïque (FOEA)",
          "2 - perfluorodécyle éthanoïque (FDEA)",
          "Acide 2H-perfluorodécènoïque (FOUEA)",
          "Acide 2H-perfluorododécènoïque (FDUEA)",
          "Acide perfluoro-n-butanoïque (PFBA)",
          "Acide perfluoro-n-pentanoïque (PFPeA)",
          "Acide perfluoro-n-heptanoïque (PFHpA)",
          "2 - perfluorohexyle éthanoïque (FHEA)",
          "Acide 2H-perfluorooctènoïque (FHUEA)",
          "Acide perfluoro-n-hexanoïque (PFHxA)",
        ],
        [PFASGroupings.TOTAL_PFS]: [
          "Sulfonate de perfluoro-n-hexane (PFHxS)",
          "Sulfonate de perfluoro-n-heptane (L-PFHpS)",
          "Sulfonate de perfluoro-n-octane (PFOS totale)",
          "Sulfonate de perfluoro-n-nonane (L-PFNS)",
          "Sulfonate de perfluoro-n-décane (L-PFDS)",
          "Sulfonate de perfluoro-n-dodécane (L-PFDoS)",
          "Sulfonate de perfluoro-n-butane (L-PFBS)",
          "Sulfonate de perfluoro-n-pentane (L-PFPeS)",
        ],
        [PFASGroupings.TOTAL_PFOSA]: [
          "Perfluorooctane sulfonamide (PFOSA)",
          "Méthyle perfluorooctane sulfonamide (MeFOSA)",
          "Éthyle perfluorooctane sulfonamide (EtFOSA)",
        ],
        [PFASGroupings.LC_PFCA]: [
          "Acide perfluoro-n-octanoïque (PFOA)",
          "Acide perfluoro-n-nonanoïque (PFNA)",
          "Acide perfluoro-n-décanoïque (PFDA)",
          "Acide perfluoro-n-undécanoïque (PFUdA)",
          "Acide perfluoro-n-dodécanoïque (PFDoA)",
          "Acide perfluoro-n-tridécanoïque (PFTrDA)",
          "Acide perfluoro-n-tétradécanoïque (PFTeDA)",
          "Acide perfluoro-n-hexadécanoïque (PFHxDA)",
          "Acide perfluoro-n-octadécanoïque (PFODA)",
          "2 - perfluorooctyl éthanoïque (FOEA)",
          "2 - perfluorodécyle éthanoïque (FDEA)",
          "Acide 2H-perfluorodécènoïque (FOUEA)",
          "Acide 2H-perfluorododécènoïque (FDUEA)",
        ],
        [PFASGroupings.LC_PFS]: [
          "Sulfonate de perfluoro-n-hexane (PFHxS)",
          "Sulfonate de perfluoro-n-heptane (L-PFHpS)",
          "Sulfonate de perfluoro-n-octane (PFOS totale)",
          "Sulfonate de perfluoro-n-nonane (L-PFNS)",
          "Sulfonate de perfluoro-n-décane (L-PFDS)",
          "Sulfonate de perfluoro-n-dodécane (L-PFDoS)",
        ],
        [PFASGroupings.SC_PFCA]: [
          "Acide perfluoro-n-butanoïque (PFBA)",
          "Acide perfluoro-n-pentanoïque (PFPeA)",
          "Acide perfluoro-n-heptanoïque (PFHpA)",
          "2 - perfluorohexyle éthanoïque (FHEA)",
          "Acide 2H-perfluorooctènoïque (FHUEA)",
          "Acide perfluoro-n-hexanoïque (PFHxA)",
        ],
        [PFASGroupings.SC_PFS]: [
          "Sulfonate de perfluoro-n-butane (L-PFBS)",
          "Sulfonate de perfluoro-n-pentane (L-PFPeS)",
        ],
      },
    },
  },

      // references: https://datatables.net/plug-ins/i18n/French.html
    // note:
    //  For some reason the CDN link provided in the documentation causes
    //  some errors with the datatables, so we copied the content of the
    //  translation JSON file here
    dataTableTemplate: {
      "emptyTable": "Aucune donnée disponible dans le tableau",
      "loadingRecords": "Chargement...",
      "processing": "Traitement...",
      "select": {
          "rows": {
              "1": "1 ligne sélectionnée",
              "_": "%d lignes sélectionnées"
          },
          "cells": {
              "1": "1 cellule sélectionnée",
              "_": "%d cellules sélectionnées"
          },
          "columns": {
              "1": "1 colonne sélectionnée",
              "_": "%d colonnes sélectionnées"
          }
      },
      "autoFill": {
          "cancel": "Annuler",
          "fill": "Remplir toutes les cellules avec <i>%d</i>",
          "fillHorizontal": "Remplir les cellules horizontalement",
          "fillVertical": "Remplir les cellules verticalement"
      },
      "searchBuilder": {
          "conditions": {
              "date": {
                  "after": "Après le",
                  "before": "Avant le",
                  "between": "Entre",
                  "empty": "Vide",
                  "not": "Différent de",
                  "notBetween": "Pas entre",
                  "notEmpty": "Non vide",
                  "equals": "Égal à"
              },
              "number": {
                  "between": "Entre",
                  "empty": "Vide",
                  "gt": "Supérieur à",
                  "gte": "Supérieur ou égal à",
                  "lt": "Inférieur à",
                  "lte": "Inférieur ou égal à",
                  "not": "Différent de",
                  "notBetween": "Pas entre",
                  "notEmpty": "Non vide",
                  "equals": "Égal à"
              },
              "string": {
                  "contains": "Contient",
                  "empty": "Vide",
                  "endsWith": "Se termine par",
                  "not": "Différent de",
                  "notEmpty": "Non vide",
                  "startsWith": "Commence par",
                  "equals": "Égal à",
                  "notContains": "Ne contient pas",
                  "notEndsWith": "Ne termine pas par",
                  "notStartsWith": "Ne commence pas par"
              },
              "array": {
                  "empty": "Vide",
                  "contains": "Contient",
                  "not": "Différent de",
                  "notEmpty": "Non vide",
                  "without": "Sans",
                  "equals": "Égal à"
              }
          },
          "add": "Ajouter une condition",
          "button": {
              "0": "Recherche avancée",
              "_": "Recherche avancée (%d)"
          },
          "clearAll": "Effacer tout",
          "condition": "Condition",
          "data": "Donnée",
          "deleteTitle": "Supprimer la règle de filtrage",
          "logicAnd": "Et",
          "logicOr": "Ou",
          "title": {
              "0": "Recherche avancée",
              "_": "Recherche avancée (%d)"
          },
          "value": "Valeur",
          "leftTitle": "Désindenter le critère",
          "rightTitle": "Indenter le critère"
      },
      "searchPanes": {
          "clearMessage": "Effacer tout",
          "count": "{total}",
          "title": "Filtres actifs - %d",
          "collapse": {
              "0": "Volet de recherche",
              "_": "Volet de recherche (%d)"
          },
          "countFiltered": "{shown} ({total})",
          "emptyPanes": "Pas de volet de recherche",
          "loadMessage": "Chargement du volet de recherche...",
          "collapseMessage": "Réduire tout",
          "showMessage": "Montrer tout"
      },
      "buttons": {
          "collection": "Collection",
          "colvis": "Visibilité colonnes",
          "colvisRestore": "Rétablir visibilité",
          "copy": "Copier",
          "copySuccess": {
              "1": "1 ligne copiée dans le presse-papier",
              "_": "%d lignes copiées dans le presse-papier"
          },
          "copyTitle": "Copier dans le presse-papier",
          "csv": "CSV",
          "excel": "Excel",
          "pageLength": {
              "1": "Afficher 1 ligne",
              "-1": "Afficher toutes les lignes",
              "_": "Afficher %d lignes"
          },
          "pdf": "PDF",
          "print": "Imprimer",
          "copyKeys": "Appuyez sur ctrl ou u2318 + C pour copier les données du tableau dans votre presse-papier.",
          "createState": "Créer un état",
          "removeAllStates": "Supprimer tous les états",
          "removeState": "Supprimer",
          "renameState": "Renommer",
          "savedStates": "États sauvegardés",
          "stateRestore": "État %d",
          "updateState": "Mettre à jour"
      },
      "decimal": ",",
      "datetime": {
          "previous": "Précédent",
          "next": "Suivant",
          "hours": "Heures",
          "minutes": "Minutes",
          "seconds": "Secondes",
          "unknown": "-",
          "amPm": [
              "am",
              "pm"
          ],
          "months": {
              "0": "Janvier",
              "1": "Février",
              "2": "Mars",
              "3": "Avril",
              "4": "Mai",
              "5": "Juin",
              "6": "Juillet",
              "7": "Août",
              "8": "Septembre",
              "9": "Octobre",
              "10": "Novembre",
              "11": "Décembre"
          },
          "weekdays": [
              "Dim",
              "Lun",
              "Mar",
              "Mer",
              "Jeu",
              "Ven",
              "Sam"
          ]
      },
      "editor": {
          "close": "Fermer",
          "create": {
              "title": "Créer une nouvelle entrée",
              "button": "Nouveau",
              "submit": "Créer"
          },
          "edit": {
              "button": "Editer",
              "title": "Editer Entrée",
              "submit": "Mettre à jour"
          },
          "remove": {
              "button": "Supprimer",
              "title": "Supprimer",
              "submit": "Supprimer",
              "confirm": {
                  "1": "Êtes-vous sûr de vouloir supprimer 1 ligne ?",
                  "_": "Êtes-vous sûr de vouloir supprimer %d lignes ?"
              }
          },
          "multi": {
              "title": "Valeurs multiples",
              "info": "Les éléments sélectionnés contiennent différentes valeurs pour cette entrée. Pour modifier et définir tous les éléments de cette entrée à la même valeur, cliquez ou tapez ici, sinon ils conserveront leurs valeurs individuelles.",
              "restore": "Annuler les modifications",
              "noMulti": "Ce champ peut être modifié individuellement, mais ne fait pas partie d'un groupe. "
          },
          "error": {
              "system": "Une erreur système s'est produite (<a target=\"\\\" rel=\"nofollow\" href=\"\\\">Plus d'information</a>)."
          }
      },
      "stateRestore": {
          "removeSubmit": "Supprimer",
          "creationModal": {
              "button": "Créer",
              "order": "Tri",
              "paging": "Pagination",
              "scroller": "Position du défilement",
              "search": "Recherche",
              "select": "Sélection",
              "columns": {
                  "search": "Recherche par colonne",
                  "visible": "Visibilité des colonnes"
              },
              "name": "Nom :",
              "searchBuilder": "Recherche avancée",
              "title": "Créer un nouvel état",
              "toggleLabel": "Inclus :"
          },
          "renameButton": "Renommer",
          "duplicateError": "Il existe déjà un état avec ce nom.",
          "emptyError": "Le nom ne peut pas être vide.",
          "emptyStates": "Aucun état sauvegardé",
          "removeConfirm": "Voulez vous vraiment supprimer %s ?",
          "removeError": "Échec de la suppression de l'état.",
          "removeJoiner": "et",
          "removeTitle": "Supprimer l'état",
          "renameLabel": "Nouveau nom pour %s :",
          "renameTitle": "Renommer l'état"
      },
      "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
      "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
      "infoFiltered": "(filtrées depuis un total de _MAX_ entrées)",
      "lengthMenu": "Afficher _MENU_ entrées",
      "paginate": {
          "first": "Première",
          "last": "Dernière",
          "next": "Suivante",
          "previous": "Précédente"
      },
      "zeroRecords": "Aucune entrée correspondante trouvée",
      "aria": {
          "sortAscending": " : activer pour trier la colonne par ordre croissant",
          "sortDescending": " : activer pour trier la colonne par ordre décroissant"
      },
      "infoThousands": " ",
      "search": "Rechercher :",
      "thousands": " "
  }
}



export const TranslationObj = {};
TranslationObj[language.EN] = {translation: LangEN};
TranslationObj[language.FR] = {translation: LangFR};


Translation.register(TranslationObj);

export function getTranslations() {
  return TranslationObj[userLanguage]["translation"];
}


// ############################################################