import { GraphTypes } from "../const.js";

export const classs = {
  HIDDEN: "hidden",
  DISABLED: "disabled",
  BOLD: "bold",
  RED: "red",
  FILTER: "filter",
  FILTER_BORDER: "filter-border",
  ACTIVE_GRAPH_SELECT: "active-graph-select",
  SANDBOX_BUTTON: "sandbox-button",
  OVERRIDE_ITEM: "override-item-container",
  OVERRIDE_VALUE: "override-item-value",
  FILTER_ADDITIONAL_ACTIVE: "filter-additional-active",
  FILTER_ADDITIONAL_RBASG: "filter-additional-rbasg",
  FILTER_ADDITIONAL_RBF: "filter-additional-rbf",
  FILTER_ADDITIONAL_RBFG: "filter-additional-rbfg",
  GRAPH_LEGEND_ITEM: "graph-legend-item",
  GRAPH_LEGEND_COLOR: "graph-legend-item-color",
  DATA_TABLE_CELL: "data-table-cell",
  DATA_TABLE_HEADER: "data-table-header",
  DATA_TABLE_HEADER_ARROWS: "data-table-header-arrows",
  DATA_TABLE_HEADER_ARROWS_INACTIVE: "data-table-header-arrows-inactive",
  MULTI_SUBTITLE: "multi-subtitle",
};

export const text = {
  arrowDown: "&darr;",
  arrowUp: "&uarr;",
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
        arrowDown: document.getElementById("how-to-use-arrow-down"),
        arrowRight: document.getElementById("how-to-use-arrow-right"),
      },
      moreInfo: {
        button: document.getElementById("more-info-button"),
        content: document.getElementById("more-info-content"),
        arrowDown: document.getElementById("more-info-arrow-down"),
        arrowRight: document.getElementById("more-info-arrow-right"),
      },
    },
    languageButton: document.getElementById("language-button"),
    subtitle: document.getElementById("subtitle"),
  },

  /*
   * Filters and Filter Titles
   */

  filters: {
    containers: document.querySelectorAll("." + classs.FILTER),
    hiddenContainers: document.querySelectorAll(
      "." + classs.FILTER + "." + classs.FILTER,
    ),
    containersMap: {
      consumptionUnits: document.getElementById(
        "filter-consumption-units-container",
      ),
    },
    titles: {
      title: document.getElementById("filters-title"),
      chemicalGroup: document.getElementById("filter-chemical-group-title"),
      chemical: document.getElementById("filter-chemical-title"),
      years: document.getElementById("filter-year-title"),
      multis: document.querySelectorAll("." + classs.MULTI_SUBTITLE),
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
    borders: document.querySelectorAll("." + classs.FILTER_BORDER),
    sandbox: {
      openButton: document.getElementById("sandbox-open-button"),
      closeButton: document.getElementById("sandbox-close-button"),
      container: document.getElementById("sandbox-container"),
      title: document.getElementById("sandbox-title"),
      referenceLineTitle: document.getElementById("reference-line-title"),
      overrideTitle: document.getElementById("override-title"),
      overrideSubtitle: document.getElementById("override-subtitle"),
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
    container: document.getElementById("graph-content"),
    title: document.getElementById("graph-title"),
    graph: document.getElementById("graph"),
    saveGraph: document.getElementById("save-graph-title"),
    saveGraphContainer: document.getElementById("save-graph-container"),

    [GraphTypes.RBASG]: {
      graphSelect: document.getElementById("rbasg-graph-select"),
      filterContainers: document.querySelectorAll(
        "." + classs.FILTER_ADDITIONAL_RBASG,
      ),
      filters: {
        ageSexGroup: document.getElementById("filter-rbasg-age-group-select"),
        domain: document.getElementById("filter-rbasg-domain-select"),
      },
    },

    [GraphTypes.RBF]: {
      graphSelect: document.getElementById("rbf-graph-select"),
      filterContainers: document.querySelectorAll("." + classs.RBF),
      filters: {
        sortBy: document.getElementById("filter-rbf-sort-by-select"),
        ageSexGroup: document.getElementById("filter-rbf-age-sex-group-select"),
      },
    },

    [GraphTypes.RBFG]: {
      graphSelect: document.getElementById("rbfg-graph-select"),
      filterContainers: document.querySelectorAll(
        "." + classs.FILTER_ADDITIONAL_RBFG,
      ),
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
    dropdown: {
      button: document.getElementById("data-table-title"),
      content: document.getElementById("data-table-container"),
      arrowDown: document.getElementById("data-table-arrow-right"),
      arrowRight: document.getElementById("data-table-arrow-down"),
    },
    dataContainer: document.getElementById("data-container"),
    title: document.getElementById("data-table-title"),
    container: document.getElementById("data-table-container"),
    dataTable: document.getElementById("data-table"),
    buttons: {
      downloadConsumptionData: document.getElementById(
        "download-consumption-data-button",
      ),
      downloadContaminantData: document.getElementById(
        "download-contaminant-data-button",
      ),
      downloadDataTable: document.getElementById("download-data-table-button"),
    },
  },

  /*
   * About section
   */

  about: {
    dropdown: {
      button: document.getElementById("about-title"),
      content: document.getElementById("about-table-container"),
      arrowDown: document.getElementById("about-arrow-right"),
      arrowRight: document.getElementById("about-arrow-down"),
    },
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
