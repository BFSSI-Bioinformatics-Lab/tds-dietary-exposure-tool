import {
  ConsumptionUnits,
  DataColumn,
  DataTableHeader,
  GraphTypes,
  LODs,
  PFASGroupings,
  RbasgDomainFormat,
  RbfSortByFormat,
  RbfgRangeFormat,
  language,
  sexGroups,
  userLanguage,
} from "../const.js";

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
        title:
          "<b> Canadian Total Diet Study 2008-2023 Dietary Exposure Tool </b> from Health Canada’s Food and Nutrition Directorate",
        information: {
          moreInfoButton: "Data Sources",
          moreInfoContent: [
            "The data used to create this interactive tool are from the following sources:",
            '- The Canadian Total Diet Study results from the 2008-2023 collection years. Available on the <a href="https://open.canada.ca/data/en/dataset/01c12f93-d14c-4005-b671-e40030a3aa2c" target="_blank">Canadian Laboratory Information Network.</a>',
            '- <a href="https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130" target="_blank">The 2008-2023 Total Diet Study Food Consumption Tables (2015 CCHS-Nutrition).</a>',
          ],
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
          [GraphTypes.RBASG]: "Results by Age-Sex Group",
          [GraphTypes.RBF]: "Results by Food",
          [GraphTypes.RBFG]: "Results by Food Group",
        },
        titles: {
          title: "Select Graph Type and Chemical:",
          chemicalGroup: "Chemical Group",
          chemical: "Chemical",
          years: "Year(s)",
          multiSelSubtitle: "Multi-select with Ctrl",
          multiSelAllSubtitle: "Select all with Ctrl-a",
          lod: "Treatment of Values &ltLOD",
          lodSubtitle: "LOD Range: ",
          units: "Units",
          ageGroup: "Age Groups",
          domain: "View by",
          ageSexGroup: "Age-Sex Groups",
          range: "View as",
          sortBy: "Sort by",
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
          [ConsumptionUnits.PERSON]: "ng/day",
          [ConsumptionUnits.KGBW]: "ng/kg bw per day",
        },
        rbasgDomainFormat: {
          [RbasgDomainFormat.AGESEX]: "Age-Sex Group",
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
        },
        saveGraph: {
          button: "Save Graph",
          footer:
            "Data Sources: Health Canada, Canadian Total Diet Study, CANLINE and Statistics Canada, 2015 Canadian Community Health Survey – Nutrition, 2015, Share File",
          filename: "Graph Export",
        },
        [GraphTypes.RBASG]: {
          title: "Dietary Exposure Estimate by Age-Sex Group",
          range: "Dietary Exposure",
          domain: {
            [RbasgDomainFormat.AGESEX]: "Age Group",
            [RbasgDomainFormat.YEAR]: "Year",
          },
        },
        [GraphTypes.RBF]: {
          title: "Dietary Exposure Estimate by Food",
        },
        [GraphTypes.RBFG]: {
          title: "Dietary Exposure Estimate by Food Group",
          range: {
            [RbfgRangeFormat.PERCENT]: "% of Total Exposure",
            [RbfgRangeFormat.NUMBER]: "Dietary Exposure",
          },
          domain: "Age-Sex Group",
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
        },
        exportNames: {
          [ConsumptionUnits.PERSON]: "Food Consumption per Person per Day",
          [ConsumptionUnits.KGBW]: "Food Consumption per kg Bodyweight per Day",
          dataExport: "Data Export",
          calculations: "Dietary Exposure Calculations",
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
    },

    /*
    ------------

    French 

    ------------
    */

    [language.FR]: {
      header: {
        title:
          "<b>Outil d'exposition alimentaire de l'Étude canadienne sur l'alimentation totale 2008-2023</b> de la Direction de l'alimentation et de la nutrition de Santé Canada",
        information: {
          moreInfoButton: "Sources de données",
          moreInfoContent: [
            "Les données utilisées pour créer cet outil interactif proviennent des sources suivantes :",
            '- Résultats de l\'Étude canadienne sur l\'alimentation totale pour les années de collecte 2008-2023. Disponible sur le <a href="https://open.canada.ca/data/en/dataset/01c12f93-d14c-4005-b671-e40030a3aa2c" target="_blank">Réseau canadien d\'information sur les laboratoires</a>',
            '- <a href="https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130" target="_blank">Les tableaux de consommation alimentaire de l\'étude de l\'alimentation totale 2008-2023 (2015 ESCC-Nutrition).</a>',
          ],
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
          title: "Sélectionnez le type de graphique et le produit chimique :",
          chemicalGroup: "Groupe chimique",
          chemical: "Chimique",
          years: "Année(s)",
          multiSelSubtitle: "Multi-sélection avec Ctrl",
          multiSelAllSubtitle: "Select all with Ctrl-a (TODO)",
          lod: "Traitement des valeurs <LD",
          lodSubtitle: "Période LD : ",
          units: "Unités",
          ageGroup: "Groupes d'âge",
          domain: "Voir par",
          ageSexGroup: "Groupes âge-sexe",
          range: "Voir comme",
          sortBy: "Trier par",
          referenceLine: "Limite",
          overrideFood: "Aliment",
          overrideValue: "Nouvelle valeur",
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
          [RbasgDomainFormat.AGESEX]: "Groupe âge-sexe",
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
        },
        saveGraph: {
          button: "Enregistrer le graphique",
          footer:
            "Sources des données : Santé Canada, Étude canadienne sur l'alimentation totale, CANLINE et Statistique Canada, Enquête sur la santé dans les collectivités canadiennes 2015 - Nutrition, 2015, Share File",
          filename: "Exportation du graphique",
        },
        [GraphTypes.RBASG]: {
          title:
            "Estimation de l'exposition alimentaire par groupe d'âge et de sexe",
          range: "Exposition alimentaire",
          domain: {
            [RbasgDomainFormat.AGESEX]: "Groupe d'âge",
            [RbasgDomainFormat.YEAR]: "Année",
          },
        },
        [GraphTypes.RBF]: {
          title: "Estimation de l'exposition alimentaire par aliment",
        },
        [GraphTypes.RBFG]: {
          title: "Estimation de l'exposition alimentaire par groupe d'aliments",
          range: {
            [RbfgRangeFormat.PERCENT]: "% de l'exposition totale",
            [RbfgRangeFormat.NUMBER]: "Exposition alimentaire",
          },
          domain: "Groupe d'âge et de sexe",
        },
      },

      dataTable: {
        title: "Tableaux de données",
        buttons: {
          downloadContaminantData: "Télécharger les données d'occurrence",
          downloadConsumptionData: "Télécharger les données de consommation",
          downloadDataTable: "Télécharger les estimations d'exposition",
        },
        exportNames: {
          [ConsumptionUnits.PERSON]:
            "Consommation alimentaire par personne et par jour",
          [ConsumptionUnits.KGBW]:
            "Consommation alimentaire par kg de poids corporel par jour",
          dataExport: "Exportation de données",
          calculations: "Calculs d’exposition alimentaire",
        },
        headers: {
          [DataTableHeader.CHEMICAL]: "Chimique",
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
            "Drapeau 'E' : Marginal - CV > 16,6 % mais CV < 33,3 %",
          [DataTableHeader.SUPPRESSED]:
            "Drapeau 'F' : Inacceptable, données supprimées",
          [DataTableHeader.INCLUDED_SUPPRESSED]:
            "Valeurs incluses avec CV du drapeau 'F' > 33,3%.",
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
    },
  };

  return translations[userLanguage];
}
