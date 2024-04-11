import {
  ConsumptionUnits,
  DataColumns,
  GraphTypes,
  LODs,
  PFASGroupings,
  RbasgDomainFormat,
  RbfSortByFormat,
  RbfgRangeFormat,
  language,
  sexGroups,
  userLanguage,
} from "../config.js";

export function getTranslations() {
  const translations = {
    /*
    ------------

    English

    ------------
    */

    [language.EN]: {
      /**
       * Introductory Text
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
          moreInfoButton: "* Data Source",
          moreInfoContent: [
            "The data used to create this interactive tool are from the following sources:",
            '- The Canadian Total Diet Study results from the 2008-2022 collection years. Available on the <a href="https://open.canada.ca/data/en/dataset/01c12f93-d14c-4005-b671-e40030a3aa2c" target="_blank">Canadian Laboratory Information Network.</a>',
            '- <a href="https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130" target="_blank">The 2008-2022 Total Diet Study Food Consumption Tables (2015 CCHS-Nutrition).</a>',
          ],
        },
        language: "Switch to French",
        subtitle:
          "How much of various chemicals is the Canadian population exposed to through their diet? And which foods and food groups contribute the most?",
      },

      /**
       * Filter Titles and Options
       */

      filters: {
        graphSelects: {
          [GraphTypes.RBASG]: "Results by Age-Sex Group",
          [GraphTypes.RBF]: "Results by Food",
          [GraphTypes.RBFG]: "Results by Food Group",
        },
        titles: {
          title: "Select Graph Type and Chemical:",
          chemicalGroup: "Chemical Group",
          chemical: "Chemical",
          years: "Year(s)",
          multiSubtitle: "Multi-select with Ctrl",
          lod: "Occurrence &ltLOD =",
          lodSubtitle: "LOD Range: ",
          units: "Units",
          ageGroup: "Age Group",
          domain: "Domain",
          ageSexGroup: "Age-Sex Group",
          range: "Range Format",
          sortBy: "Sort By",
          referenceLine: "Limit",
          overrideFood: "Food",
          overrideValue: "New Value",
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
          [ConsumptionUnits.PERSON]: "Per Person per Day",
          [ConsumptionUnits.KGBW]: "Per kg Bodyweight per Day",
        },
        rbasgDomainFormat: {
          [RbasgDomainFormat.AGESEX]: "Age-Sex",
          [RbasgDomainFormat.YEAR]: "Year",
        },
        rbfgRangeFormat: {
          [RbfgRangeFormat.PERCENT]: "Percentages",
          [RbfgRangeFormat.ABSOLUTE]: "Absolute",
        },
        rbfSortByFormat: {
          [RbfSortByFormat.FOOD]: "Food",
          [RbfSortByFormat.GROUP]: "Food Group",
        },
        sandbox: {
          openButton: "Open Sandbox",
          closeButton: "Close",
          title: "Sandbox Environment",
          referenceLineTitle: "Add Reference Line to Graph:",
          overrideTitle: "Override Occurrence Value(s):",
        },
      },

      /**
       * Graph Info, Legends, and Graph Specifics
       */

      graphs: {
        info: {
          exposure: "Dietary Exposure",
          percentExposure: "% Dietary Exposure",
          occurrence: "Contaminent Occurrence (mean)",
          foodConsumption: "Mean Food Composite Consumption",
          ageSexGroup: "Age-Sex Group",
          ageGroup: "Age Group",
          year: "Year",
        },
        legend: {
          ageGroup: "Age Groups",
          foodGroup: "Food Groups",
        },
        saveGraph: {
          button: "Save Graph",
          footer: "Data sources: xxxx",
          filename: "Graph Export",
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
       * Data Tables
       */

      dataTable: {
        title: "Data Tables",
        buttons: {
          downloadContaminentData: "Download Contaminent Data",
          downloadConsumptionData: "Download Consumption Data",
          downloadDataTable: "Download Calculations (Found Below)",
        },
        exportNames: {
          [ConsumptionUnits.PERSON]: "Food Consumption per Person per Day",
          [ConsumptionUnits.KGBW]: "Food Consumption per kg Bodyweight per Day",
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
          modified: "User Modified Values",
          flagged: "'E' Flag",
          suppressed: "'F' Supressed",
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
        noDataMsg: "No data available",
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
          [DataColumns.MAPPING_COMPOSITE_DESC]:
            "Composite Description (TDS_FC_Label)",
          [DataColumns.MAPPING_COMPOSITE_CODE]: "Composite Code (TDS_FC_Code)",
          [DataColumns.MAPPING_COMPOSITE_CONTENT]:
            "Description of the content included in composite",
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
          [sexGroups.F]: "F",
          [sexGroups.M]: "M",
          [sexGroups.B]: "B",
          allPeople: "All people",
          radionuclides: "Radionuclides",
          PFAS: "Perfluorinated chemicals (PFCs)",
          PFASGroupings: {
            [PFASGroupings.TOTAL_PFAS]: "Total PFAS",
            [PFASGroupings.TOTAL_PFCA]: "Total PFCA",
            [PFASGroupings.TOTAL_PFS]: "Total PFS",
            [PFASGroupings.TOTAL_PFOSA]: "Total PFOSA",
            [PFASGroupings.LC_PFCA]:
              "Long-chained perfluorocarboxylic acid analogues",
            [PFASGroupings.LC_PFS]: "Long-chained perflurosulfonate analogues",
            [PFASGroupings.SC_PFCA]:
              "Short-chained perfluorocarboxylic acid analogues",
            [PFASGroupings.SC_PFS]:
              "Short-chained perfluorosulfonate analogues",
          },
          PFASMapping: {
            [PFASGroupings.TOTAL_PFAS]: [
              "2-perfluorodecyl ethanoic acid",
              "2-perfluorohexyl ethanoic acid",
              "2-perfluorooctyl ethanoic acid",
              "2H-perfluoro-2-decenoic acid",
              "2H-perfluoro-2-dodecenoic acid",
              "2H-perfluoro-2-octenoic acid",
              "Perfluoro-1-butanesulfonate",
              "Perfluoro-n-butanoic acid",
              "Perfluoro-n-octanoic acid",
              "perfluoro-1-decanesulfonate",
              "perfluoro-1-dodecanesulfonate",
              "perfluoro-1-heptanesulfonate",
              "perfluoro-1-hexanesulfonate",
              "perfluoro-1-nonanesulfonate",
              "perfluoro-1-pentanesulfonate",
              "perfluoro-n-decanoic acid",
              "perfluoro-n-dodecanoic acid",
              "perfluoro-n-heptanoic acid",
              "perfluoro-n-hexadecanoic acid",
              "perfluoro-n-hexanoic acid",
              "perfluoro-n-nonanoic acid",
              "perfluoro-n-octadecanoic acid",
              "perfluoro-n-pentanoic acid",
              "perfluoro-n-tetradecanoic acid",
              "perfluoro-n-tridecanoic acid",
              "perfluoro-n-undecanoic acid",
              "perfluorooctanesulfonate (total)",
            ],
            [PFASGroupings.TOTAL_PFCA]: [
              "2-perfluorodecyl ethanoic acid",
              "2-perfluorohexyl ethanoic acid",
              "2h-perfluoro-2-decenoic acid",
              "2h-perfluoro-2-dodecenoic acid",
              "perfluoro-n-octanoic acid",
              "perfluoro-n-decanoic acid",
              "perfluoro-n-dodecanoic acid",
              "perfluoro-n-nonanoic acid",
              "perfluoro-n-octadecanoic acid",
              "perfluoro-n-tridecanoic acid",
              "perfluoro-n-undecanoic acid",
              "2-perfluorooctyl ethanoic acid",
              "2h-perfluoro-2-octenoic acid",
              "perfluoro-n-butanoic acid",
              "perfluoro-n-heptanoic acid",
              "perfluoro-n-hexadecanoic acid",
              "perfluoro-n-pentanoic acid",
              "perfluoro-n-tetradecanoic acid",
            ],
            [PFASGroupings.TOTAL_PFS]: [
              "perfluoro-1-decanesulfonate",
              "perfluoro-1-dodecanesulfonate",
              "perfluoro-1-heptanesulfonate",
              "perfluoro-1-hexanesulfonate",
              "perfluoro-1-nonanesulfonate",
              "perfluorooctanesulfonate (total)",
              "Perfluoro-1-butanesulfonate",
              "perfluoro-1-pentanesulfonate",
            ],
            [PFASGroupings.TOTAL_PFOSA]: [],
            [PFASGroupings.LC_PFCA]: [
              "2-perfluorodecyl ethanoic acid",
              "2-perfluorohexyl ethanoic acid",
              "2h-perfluoro-2-decenoic acid",
              "2h-perfluoro-2-dodecenoic acid",
              "perfluoro-n-octanoic acid",
              "perfluoro-n-decanoic acid",
              "perfluoro-n-dodecanoic acid",
              "perfluoro-n-nonanoic acid",
              "perfluoro-n-octadecanoic acid",
              "perfluoro-n-tridecanoic acid",
              "perfluoro-n-undecanoic acid",
            ],
            [PFASGroupings.LC_PFS]: [
              "perfluoro-1-decanesulfonate",
              "perfluoro-1-dodecanesulfonate",
              "perfluoro-1-heptanesulfonate",
              "perfluoro-1-hexanesulfonate",
              "perfluoro-1-nonanesulfonate",
              "perfluorooctanesulfonate (total)",
            ],
            [PFASGroupings.SC_PFCA]: [
              "2-perfluorooctyl ethanoic acid",
              "2h-perfluoro-2-octenoic acid",
              "perfluoro-n-butanoic acid",
              "perfluoro-n-heptanoic acid",
              "perfluoro-n-hexadecanoic acid",
              "perfluoro-n-pentanoic acid",
              "perfluoro-n-tetradecanoic acid",
            ],
            [PFASGroupings.SC_PFS]: [
              "Perfluoro-1-butanesulfonate",
              "perfluoro-1-pentanesulfonate",
            ],
          },
        },
      },
    },

    /*
    ------------

    French 

    ------------
    */

    [language.FR]: {
      header: {
        title: "<b> Dietary Exposure to Chemicals </b> from Health Canada (fr)",
        information: {
          howToUseButton: "? How to Use (fr)",
          howToUseContent: [],
          moreInfoButton: "* Data Source (fr)",
          moreInfoContent: [],
        },
        language: "Passer à l'anglais",
        subtitle:
          "How much of various chemicals is the Canadian population exposed to through their diet? And which foods and food groups contribute the most? (fr)",
      },

      filters: {
        graphSelects: {
          [GraphTypes.RBASG]: "Result by Age-Sex Group (fr)",
          [GraphTypes.RBF]: "Result by Food (fr)",
          [GraphTypes.RBFG]: "Result by Food Group (fr)",
        },
        titles: {
          title: "Select Graph Type and Chemical: (fr)",
          chemicalGroup: "Chemical Group (fr)",
          chemical: "Chemical (fr)",
          years: "Year(s) (fr)",
          multiSubtitle: "+ctrl (fr)",
          lod: "Occurrence &ltLOD = (fr)",
          lodSubtitle: "LOD Range:  (fr)",
          units: "Units (fr)",
          ageGroup: "Age Group (fr)",
          domain: "Domain (fr)",
          ageSexGroup: "Age-Sex Group (fr)",
          range: "Range Format (fr)",
          sortBy: "Sort By (fr)",
          referenceLine: "Limit (fr)",
          overrideFood: "Food (fr)",
          overrideValue: "New Value (fr)",
        },
        placeholders: {
          select: "Select (fr)",
          none: "None (fr)",
        },
        lods: {
          [LODs[0]]: "0 (fr)",
          [LODs["1/2 LOD"]]: "1/2 LOD (fr)",
          [LODs.LOD]: "LOD (fr)",
          [LODs.Exclude]: "Exclude (fr)",
        },
        consumptionUnits: {
          [ConsumptionUnits.PERSON]: "Per Person per Day (fr)",
          [ConsumptionUnits.KGBW]: "Per kg Bodyweight per Day (fr)",
        },
        rbasgDomainFormat: {
          [RbasgDomainFormat.AGESEX]: "Age-Sex (fr)",
          [RbasgDomainFormat.YEAR]: "Year (fr)",
        },
        rbfgRangeFormat: {
          [RbfgRangeFormat.PERCENT]: "Percentages (fr)",
          [RbfgRangeFormat.ABSOLUTE]: "Absolute (fr)",
        },
        rbfSortByFormat: {
          [RbfSortByFormat.FOOD]: "Food (fr)",
          [RbfSortByFormat.GROUP]: "Food Group (fr)",
        },
        sandbox: {
          openButton: "Open Sandbox (fr)",
          closeButton: "Close (fr)",
          title: "Sandbox Environment (fr)",
          referenceLineTitle: "Add Reference Line to Graph: (fr)",
          overrideTitle: "Override Occurrence Value(s): (fr)",
        },
      },

      graphs: {
        info: {
          exposure: "Dietary Exposure (fr)",
          percentExposure: "% Dietary Exposure (fr)",
          occurrence: "Contaminent Occurrence (mean) (fr)",
          foodConsumption: "Mean Food Composite Consumption (fr)",
          ageSexGroup: "Age-Sex Group (fr)",
          ageGroup: "Age Group (fr)",
          year: "Year (fr)",
        },
        legend: {
          ageGroup: "Age Groups (fr)",
          foodGroup: "Food Groups (fr)",
        },
        saveGraph: {
          button: "Save Graph (fr)",
          footer: "Data sources: xxxx (fr)",
          filename: "Graph Export (fr)",
        },
        [GraphTypes.RBASG]: {
          title: "Dietary Exposure Estimate by Age-Sex Group for (fr)",
          range: "Dietary Exposure (fr)",
          domain: {
            [RbasgDomainFormat.AGESEX]: "Age Group(s) (fr)",
            [RbasgDomainFormat.YEAR]: "Year (fr)",
          },
        },
        [GraphTypes.RBF]: {
          title: "Dietary Exposure Estimate by Food for (fr)",
        },
        [GraphTypes.RBFG]: {
          title: "Dietary Exposure Estimate by Food Group for (fr)",
          range: {
            [RbfgRangeFormat.PERCENT]: "% of Total Exposure (fr)",
            [RbfgRangeFormat.NUMBER]: "Dietary Exposure (fr)",
          },
          domain: "Age-Sex Groups (fr)",
        },
      },

      dataTable: {
        title: "Data Tables (fr)",
        buttons: {
          downloadContaminentData: "Download Contaminent Data (fr)",
          downloadConsumptionData: "Download Consumption Data (fr)",
          downloadDataTable: "Download Calculations (Found Below) (fr)",
        },
        exportNames: {
          [ConsumptionUnits.PERSON]: "Food Consumption per Person per Day (fr)",
          [ConsumptionUnits.KGBW]:
            "Food Consumption per kg Bodyweight per Day (fr)",
          dataExport: "Data Export (fr)",
          calculations: "Dietary Exposure Calculations (fr)",
        },
        headers: {
          chemical: "Chemical (fr)",
          ageSexGroup: "Age-sex Group (fr)",
          foodGroup: "Food Group (fr)",
          composite: "Food Name and Code (fr)",
          percentExposure: "Percent Total Exposure (fr)",
          exposure: "Exposure Estimate (fr)",
          exposureUnit: "Unit (fr)",
          years: "Year(s) (fr)",
          percentUnderLod: "% <LOD (fr)",
          treatment: "Treatment of <LOD (fr)",
          modified: "User Modified Values (fr)",
          flagged: "'E' Flag (fr)",
          suppressed: "'F' Supressed (fr)",
        },
        values: {
          occurrence: "Occurrence (fr)",
        },
      },

      about: {
        title: "About the Tool (fr)",
        table: [
          {
            header: "First Row Example (fr)",
            value:
              "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. (fr)",
          },
          {
            header: "More for the Second Row (fr)",
            value:
              "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. (fr)",
          },
          {
            header: "Third Row with Random Text (fr)",
            value:
              "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. (fr)",
          },
        ],
      },

      misc: {
        noDataMsg: "No data available (fr)",
        na: "NA (fr)",
        consumptionUnitShort: {
          [ConsumptionUnits.KGBW]: "/kg BW/day (fr)",
          [ConsumptionUnits.PERSON]: "/person/day (fr)",
        },
        gramsShort: "g (fr)",
      },

      tdsData: {
        headers: {
          /* Consumption */
          [DataColumns.MAPPING_COMPOSITE_DESC]:
            "Description du composite alimentaire (EAT_AC_étiquette)",
          [DataColumns.MAPPING_COMPOSITE_CODE]:
            "Code de composite (EAT_AC_Code)",
          [DataColumns.MAPPING_COMPOSITE_CONTENT]:
            "La description des aliments inclus dans la mise en correspondance des composites",
          [DataColumns.POPULATION]: "population",
          [DataColumns.POPULATION_GROUP]: "Groupe_de_population",
          [DataColumns.COMPOSITE_DESC]: "EAT_AC_étiquette",
          [DataColumns.COMPOSITE_CODE]: "EAT_AC_Code",
          [DataColumns.MEAN_FLAG]: "Moy_indicateur",
          [DataColumns.MEAN_G_PPPD]: "Moy_grammes_par_personne_par_jour",
          [DataColumns.MEAN_G_PKGBWPD]:
            "Moy_grammes_par_kilogramme_de_poids_corporel_par_jour ",
          /* Contaminent */
          [DataColumns.CHEMICAL_GROUP]: "Groupe de l'analyte",
          [DataColumns.CHEMICAL]: "Nom de l'analyte",
          [DataColumns.COLLECTION_DATE]: "Date de l'échantillonnage",
          [DataColumns.PROJECT_CODE]: "Code du projet",
          [DataColumns.SAMPLE_CODE]: "Code de l'échantillon",
          [DataColumns.PRODUCT_DESC]: "Description du produit",
          [DataColumns.RESULT_VALUE]: "Valeur du résultat",
          [DataColumns.UNIT]: "Unités de mesure",
          [DataColumns.LOD]: "Limite de détection",
          [DataColumns.MDL]: "Limite de détection de la méthode",
        },
        values: {
          [sexGroups.F]: "F",
          [sexGroups.M]: "H",
          [sexGroups.B]: "B",
          allPeople: "Toutes les personnes",
          radionuclides: "Radionucléides",
          PFAS: "Produits chimiques perfluorés (PFC)",
          PFASGroupings: {
            [PFASGroupings.TOTAL_PFAS]: "Total PFAS (fr)",
            [PFASGroupings.TOTAL_PFCA]: "Total PFCA (fr)",
            [PFASGroupings.TOTAL_PFS]: "Total PFS (fr)",
            [PFASGroupings.TOTAL_PFOSA]: "Total PFOSA (fr)",
            [PFASGroupings.LC_PFCA]: "Long-chained PFCA (fr)",
            [PFASGroupings.LC_PFS]: "Long-chained PFS (fr)",
            [PFASGroupings.SC_PFCA]: "Short-chained PFCA (fr)",
            [PFASGroupings.SC_PFS]: "Short-chained PFS (fr)",
          },
          PFASMapping: {
            [PFASGroupings.TOTAL_PFAS]: [],
            [PFASGroupings.TOTAL_PFCA]: [],
            [PFASGroupings.TOTAL_PFS]: [],
            [PFASGroupings.TOTAL_PFCA]: [],
            [PFASGroupings.TOTAL_PFOSA]: [],
            [PFASGroupings.LC_PFCA]: [],
            [PFASGroupings.LC_PFS]: [],
            [PFASGroupings.SC_PFCA]: [],
            [PFASGroupings.SC_PFS]: [],
          },
        },
      },
    },
  };

  return translations[userLanguage];
}
