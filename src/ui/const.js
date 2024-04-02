import { GraphTypes } from "../config.js";

export const classs = {
  HIDDEN: "hidden",
};

export const el = {
  /*
   * Introductory Text Elements
   */

  header: {
    title: document.getElementById("title"),
    information: {
      howToUse: {
        button: document.getElementById("how-to-use-button"),
        content: document.getElementById("how-to-use-content"),
      },
      moreInfo: {
        button: document.getElementById("more-info-button"),
        content: document.getElementById("more-info-content"),
      },
    },
    languageButton: document.getElementById("language-button"),
    subtitle: document.getElementById("subtitle"),
  },

  /*
   * Filters and Filter Titles
   */

  filters: {
    containers: document.querySelectorAll(".filter"),
    titles: {
      title: document.getElementById("filters-title"),
      chemicalGroup: document.getElementById("filter-chemical-group-title"),
      chemical: document.getElementById("filter-chemical-title"),
      years: document.getElementById("filter-year-title"),
      lod: document.getElementById("filter-lod-title"),
      lodSubtitle: document.getElementById("filter-lod-subtitle"),
      consumptionUnits: document.getElementById(
        "filter-consumption-units-title",
      ),
      rbasgAgeGroup: document.getElementById(
        "filter-rbasg-age-group-filter-title",
      ),
      rbasgDomain: document.getElementById("filter-rbasg-domain-title"),
      rbfAgeSexGroup: document.getElementById("filter-rbf-age-sex-group-title"),
      rbfSortBy: document.getElementById("filter-rbf-sort-by-title"),
      rbfgAgeSexGroup: document.getElementById(
        "filter-rbfg-age-sex-group-title",
      ),
      rbfgRange: document.getElementById("filter-rbfg-range-title"),
      referenceLine: document.getElementById("filter-reference-line-title"),
      overrideFood: document.getElementById("filter-override-food-title"),
      overrideValue: document.getElementById("filter-override-value-title"),
    },
    borders: document.querySelectorAll(".filter-border"),
    sandbox: {
      openButton: document.getElementById("sandbox-open-button"),
      closeButton: document.getElementById("sandbox-close-button"),
      container: document.getElementById("sandbox-container"),
      title: document.getElementById("sandbox-title"),
      referenceLineTitle: document.getElementById("reference-line-title"),
      overrideTitle: document.getElementById("override-title"),
      addOverrideButton: document.getElementById("override-add-button"),
      overridesList: document.getElementById("overrides-list-container"),
    },
    inputs: {
      chemicalGroup: document.getElementById("filter-chemical-group-select"),
      chemical: document.getElementById("filter-chemical-select"),
      years: document.getElementById("filter-year-select"),
      lod: document.getElementById("filter-lod-select"),
      consumptionUnits: document.getElementById(
        "filter-consumption-units-select",
      ),
      referenceLine: document.getElementById("filter-reference-line-select"),
      overrideFood: document.getElementById("filter-override-food-select"),
      overrideValue: document.getElementById("filter-override-value-select"),
    },
  },

  /*
   * Graphs and Legend
   */

  graphs: {
    title: document.getElementById("graph-title"),
    graph: document.getElementById("graph"),

    [GraphTypes.RBASG]: {
      graphSelect: document.getElementById("rbasg-graph-select"),
      filterContainers: document.querySelectorAll(".filter-additional-rbasg"),
      filters: {
        ageSexGroup: document.getElementById("filter-rbasg-age-group-select"),
        domain: document.getElementById("filter-rbasg-domain-select"),
      },
    },

    [GraphTypes.RBF]: {
      graphSelect: document.getElementById("rbf-graph-select"),
      filterContainers: document.querySelectorAll(".filter-additional-rbf"),
      filters: {
        sortBy: document.getElementById("filter-rbf-sort-by-select"),
        ageSexGroup: document.getElementById("filter-rbf-age-sex-group-select"),
      },
    },

    [GraphTypes.RBFG]: {
      graphSelect: document.getElementById("rbfg-graph-select"),
      filterContainers: document.querySelectorAll(".filter-additional-rbfg"),
      filters: {
        range: document.getElementById("filter-rbfg-range-select"),
        ageSexGroup: document.getElementById(
          "filter-rbfg-age-sex-group-select",
        ),
      },
    },

    legend: {
      title: document.getElementById("legend-title"),
      content: document.getElementById("legend-content"),
    },
  },

  /*
   * Data Tables
   */

  dataTable: {
    dataContainer: document.getElementById("data-container"),
    title: document.getElementById("data-table-title"),
    container: document.getElementById("data-table-container"),
    dataTable: document.getElementById("data-table"),
    buttons: {
      downloadConsumptionData: document.getElementById(
        "download-consumption-data-button",
      ),
      downloadContaminentData: document.getElementById(
        "download-contaminent-data-button",
      ),
      downloadDataTable: document.getElementById("download-data-table-button"),
    },
  },

  /*
   * About section
   */

  about: {
    container: document.getElementById("about-container"),
    title: document.getElementById("about-title"),
    tableContainer: document.getElementById("about-table-container"),
    table: document.getElementById("about-table"),
  },

  /*
   * Misc.
   */

  misc: {
    loader: document.getElementById("loader"),
  },
};
