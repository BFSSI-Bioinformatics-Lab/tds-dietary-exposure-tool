import {
  ConsumptionUnits,
  DataColumns,
  DataType,
  GraphTypes,
  LODs,
  RbasgDomainFormat,
  RbfSortByFormat,
  RbfgRangeFormat,
} from "../config.js";

const userLanguage = navigator.language.split("-")[0];

export function getTranslations() {
  const translations = {
    en: {
      /**
       *
       * Introductory Text
       *
       */

      header: {
        title: "<b> Dietary Exposure to Chemicals </b> from Health Canada",
        information: {
          howToUseButton: "? How to Use",
          howToUseContent: [
            "The graph at the top of the page compares how 12 broad food groups contribute to intake among children, youth & adolescents, adult females and adult males and the whole population.",
            "",
            "1) Choose a Nutrient by selecting from the dropdown menu at the top left hand side of the screen To display a detailed description of what is included in each food group, hover over or tab to any specific food group in the graph or the legend. Click to isolate a food group, click again to restore the complete graph. Use the “Switch to” button to toggle between number and percentage of contribution. Download the raw data in csv format by clicking on the download button.",
            "",
            "2) Select an age-sex group to take a deeper look at how more specific food sub-groups contribute to intakes in the graph at the bottom of the page.",
            "",
            "Each broad food group is represented in a different color and sub-group contribution is shown in the outside layers. Hover over a food group for more information. Click on the label to take a closer look into a food group. Click again to restore the complete graph. To see the level 2 sub-groups results in ascending order, click on the grey circle. Click again on the grey circle to restore the complete graph.",
          ],
          moreInfoButton: "* Data Info",
          moreInfoContent: [
            "The data used to create this interactive tool are from the following sources:",
            '- The Canadian Total Diet Study results from the 2008-2022 collection years. Available on the <a href="https://open.canada.ca/data/en/dataset/01c12f93-d14c-4005-b671-e40030a3aa2c" target="_blank">Canadian Laboratory Information Network.</a>',
            '- <a href="https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130" target="_blank">The 2008-2022 Total Diet Study Food Consumption Tables (2015 CCHS-Nutrition).</a>',
          ],
        },
        subtitle:
          "How much of various chemicals is the Canadian population exposed to through their diet? And which foods and food groups contribute the most?",
      },

      /**
       *
       * Filter Titles and Options
       *
       */

      filters: {
        titles: {
          title: "Select Graph Type and Chemical:",

          chemicalGroup: "Chemical Group",
          chemical: "Chemical",
          years: "Year(s)",
          lod: "Occurence &ltLOD =",
          lodSubtitle: "LOD Range: ",
          units: "Units",
          ageGroup: "Age Group",
          domain: "Domain Format",
          ageSexGroup: "Age-Sex Group",
          range: "Range Format",
          sortBy: "Sort By",
        },
        lods: {
          [LODs[0]]: "0",
          [LODs["1/2 LOD"]]: "1/2 LOD",
          [LODs.LOD]: "LOD",
          [LODs.Exclude]: "Exclude",
        },
        consumptionUnits: {
          [ConsumptionUnits.PERSON]: "Per Person per Day",
          [ConsumptionUnits.KGBW]: "Per Kg Bodyweight per Day",
        },
        rbasgDomainFormat: {
          [RbasgDomainFormat.AGESEX]: "Show by Age-Sex",
          [RbasgDomainFormat.YEAR]: "Show by Year",
        },
        rbfgRangeFormat: {
          [RbfgRangeFormat.PERCENT]: "Percentages",
          [RbfgRangeFormat.NUMBER]: "Numbers",
        },
        rbfSortByFormat: {
          [RbfSortByFormat.FOOD]: "Food",
          [RbfSortByFormat.GROUP]: "Food Group",
        },
      },

      /**
       *
       * Graph Info, Legends, and Graph Specifics
       *
       */

      graphs: {
        info: {
          exposure: "Dietary Exposure",
          percentExposure: "% Dietary Exposure",
          occurence: "Contaminent Occurence (mean)",
          foodConsumption: "Mean Food Composite Consumption",
          ageSexGroup: "Age-Sex Group",
          ageGroup: "Age Group",
          year: "Year",
        },
        legend: {
          ageGroup: "Age Groups",
          foodGroup: "Food Groups",
        },
        [GraphTypes.RBASG]: {
          title: "Dietary Exposure Estimate by Age-Sex Group for",
          range: "Dietary Exposure",
          domain: {
            [RbasgDomainFormat.AGESEX]: "Age Group(s)",
            [RbasgDomainFormat.YEAR]: "Year",
          },
        },
        [GraphTypes.RBF]: {
          title: "Dietary Exposure Estimate by Food for",
        },
        [GraphTypes.RBFG]: {
          title: "Dietary Exposure Estimate by Food Group for",
          range: {
            [RbfgRangeFormat.PERCENT]: "% of Total Exposure",
            [RbfgRangeFormat.NUMBER]: "Dietary Exposure",
          },
          domain: "Age-Sex Groups",
        },
      },

      /**
       *
       * Data Tables
       *
       */

      dataTable: {
        title: "Data Tables",
        buttons: {
          downloadContaminentData: "Download Contaminent Data",
          downloadConsumptionData: "Download Consumption Data",
          downloadDataTable: "Download Calculations",
        },
        exportNames: {
          [ConsumptionUnits.PERSON]: "Food Consumption per Person per Day",
          [ConsumptionUnits.KGBW]: "Food Consumption per Kg Bodyweight per Day",
          dataExport: "Data Export",
          calculations: "Dietary Exposure Calculations",
        },
        headers: {
          chemical: "Chemical",
          ageSexGroup: "Age-sex Group",
          foodGroup: "Food Group",
          composite: "Food Name and Code",
          percentExposure: "Percent Total Exposure",
          exposure: "Exposure Estimate",
          exposureUnit: "Unit",
          years: "Year(s)",
          percentUnderLod: "% <LOD",
          treatment: "Treatment of <LOD",
          flagged: "'E' Flag",
          suppressed: "'F' Supressed",
        },
      },

      /**
       *
       * About Section
       *
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
       *
       * Misc.
       *
       */

      misc: {
        selectPlaceholder: "Select",
        noDataMsg: "No data available",
        na: "NA",
        consumptionUnitShort: {
          [ConsumptionUnits.KGBW]: "/Kg BW/day",
          [ConsumptionUnits.PERSON]: "/person/day",
        },
        gramsShort: "g",
      },

      /**
       *
       * Data (TDS)
       *
       */

      tdsData: {
        headers: {
          /* Consumption */
          [DataColumns.MAPPING_COMPOSITE_DESC]:
            "Composite Description (TDS_FC_Label)",
          [DataColumns.MAPPING_COMPOSITE_CODE]: "Composite Code (TDS_FC_Code)",
          [DataColumns.POPULATION]: "population",
          [DataColumns.POPULATION_GROUP]: "Population_group",
          [DataColumns.COMPOSITE_DESC]: "TDS_FC_label",
          [DataColumns.COMPOSITE_CODE]: "TDS_FC_Code",
          [DataColumns.MEAN_FLAG]: "Mean_flag",
          [DataColumns.MEAN_G_PPPD]: "Mean_grams_per_person_per_day",
          [DataColumns.MEAN_G_PKGBWPD]:
            "Mean_grams_per_kilogrambodyweight_per_day",
          /* Contaminent */
          [DataColumns.CHEMICAL_GROUP]: "Analyte Group",
          [DataColumns.CHEMICAL]: "Analyte Name",
          [DataColumns.COLLECTION_DATE]: "Sample Collection Date",
          [DataColumns.PROJECT_CODE]: "Project Code",
          [DataColumns.SAMPLE_CODE]: "Sample Code",
          [DataColumns.PRODUCT_DESC]: "Product Description",
          [DataColumns.RESULT_VALUE]: "Result Value",
          [DataColumns.UNIT]: "Units of measurement",
          [DataColumns.LOD]: "LOD",
          [DataColumns.MDL]: "MDL",
        },
        values: {
          allPeople: "All people",
          radionuclides: "Radionuclides",
        },
      },
    },
  };

  return translations[userLanguage];
}
