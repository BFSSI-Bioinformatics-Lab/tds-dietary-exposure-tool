import { GraphTypes } from "../config.js";

export const el = {
  /*
   *
   * Introductory Text Elements
   *
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
    subtitle: document.getElementById("subtitle"),
  },

  /*
   *
   * Filters and Filter Titles
   *
   */

  filters: {
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
    },
    selects: {
      chemicalGroup: document.getElementById("filter-chemical-group-select"),
      chemical: document.getElementById("filter-chemical-select"),
      years: document.getElementById("filter-year-select"),
      lod: document.getElementById("filter-lod-select"),
      consumptionUnits: document.getElementById(
        "filter-consumption-units-select",
      ),
    },
  },

  /*
   *
   * Graphs and Legend
   *
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
   *
   * Data Tables
   *
   */

  dataTable: {
    title: document.getElementById("data-table-title"),
    dataTable: document.getElementById("data-table"),
    buttons: {
      downloadConsumptionData: document.getElementById(
        "download-consumption-data-button",
      ),
      downloadContaminentData: document.getElementById(
        "download-contaminent-data-button",
      ),
    },
  },

  /*
   *
   * Misc.
   *
   */
};
