import {
  DataType,
  GraphTypes,
  SortByDir,
  Translation,
  getTranslations
} from "../const.js";
import {
  displayAboutTable,
  displayDataTable,
  downloadDataTable,
  downloadTDSData,
  downloadTemplate
} from "./dataTableComponent.js";
import { classes, el } from "./const.js";
import { downloadGraph } from "./graphComponent.js";
import { loadTdsData } from "../data/dataTranslator.js";
import {
  clearSandbox,
  displayFilterText,
  getFilteredTdsData,
  getSelectedGraphType,
  hideFilters,
  resetChemicalGroupIsSet,
  resetChemicalIsSet
} from "./filter.js";


// showAlertPopup(): Shows an popup for the sandbox
export function showSandBox() {
  let popup = d3.select('#sandbox-modal');
  popup.select(".modal .btn-close").attr("aria-label", Translation.translate("close"));

  popup = new bootstrap.Modal('#sandbox-modal', {backdrop: 'static'});
  popup.show();
}

/**
 * Initialize all the event listeners related to the page: dropdowns, buttons, etc.
 */
export function addEventListenersToPage() {
  /* Buttons */

  el.filters.sandbox.openButton.addEventListener("click", () => {
    showSandBox();
  });
  // el.filters.sandbox.closeButton.addEventListener("click", () => {
  //   el.filters.sandbox.container.classList.add(classes.HIDDEN);
  // });
  el.graphs.saveGraph.addEventListener("click", () => {
    downloadGraph();
  });
  el.dataTable.buttons.downloadConsumptionData.addEventListener("click", () => {
    downloadTDSData(DataType.CONSUMPTION);
  });
  el.dataTable.buttons.downloadContaminantData.addEventListener("click", () => {
    downloadTDSData(DataType.CONTAMINANT);
  });
  el.dataTable.buttons.downloadDataTable.addEventListener("click", () => {
    downloadDataTable(getFilteredTdsData(), getSelectedGraphType());
  });
  el.dataTable.buttons.downloadTemplate.addEventListener("click", () => {
    downloadTemplate();
  });
}

/**
 * Parameters:
 * - arrowUp: element to use when sorting
 * - arrowDown: element to use when sorting
 * - key: the DataTableHeader key that the sorting is taking place on
 * - data: the data to display in a data table, in object format where each key is a column (a DataTableHeader) with a corresponding value
 * - filters: currently applied filters
 */
export function addEventListernToDataTableHeader(
  arrowUp,
  arrowDown,
  key,
  data,
  filters,
) {
  [arrowUp, arrowDown].forEach((arrow) => {
    arrow.addEventListener("click", () => {
      displayDataTable(data, {
        ...filters,
        dataTableSortBy: {
          column: key,
          dir: arrow == arrowUp ? SortByDir.DESC : SortByDir.ASC,
        },
      });
    });
  });
}

// showLoadingPage(): Shows the loading page and hides the main page
export function showLoadingPage() {
  el.misc.loader.classList.remove(classes.HIDDEN);
  el.misc.pageContainer.classList.add(classes.HIDDEN);
}

// hideLoadingPage(): Hides the loading page and show the main page
export function hideLoadingPage() {
  el.misc.loader.classList.add(classes.HIDDEN);
  el.misc.pageContainer.classList.remove(classes.HIDDEN);
}

/**
 * Function to reset the application: hiding certain elements, redisplay page text, clear and redisplay filters, reload data, etc.
 * This function is used when switching languages.
 */
export async function resetPage() {
  showLoadingPage();
  initializePageText();
  hideFilters();
  el.graphs.container.classList.add(classes.HIDDEN);
  el.graphs.saveGraph.classList.add(classes.HIDDEN);
  //el.filters.sandbox.container.classList.add(classes.HIDDEN);
  el.filters.inputs.chemicalGroup.innerHTML = "";
  el.filters.inputs.chemical.innerHTML = "";
  resetChemicalGroupIsSet();
  resetChemicalIsSet();
  clearSandbox();

  await loadTdsData();
  displayFilterText();
  hideLoadingPage();
}

/**
 * Much of the text found on the page is stored in a translation file. For this reason,
 * this function exists to dynamically load that text into the page.
 */
export async function initializePageText() {
  const translations = getTranslations();

  el.header.title.innerHTML = translations.header.title;
  el.header.subtitle.innerHTML = translations.header.subtitle;
  el.header.information.moreInfo.button.innerHTML =
    translations.header.information.moreInfoButton;
  el.header.information.moreInfo.content.innerHTML =
    translations.header.information.moreInfoContent.join("<br/>");

  el.header.information.addData.dropdownHeaderText.innerHTML = Translation.translate("header.information.addDataHeaderText");
  el.header.information.addData.content.innerHTML = Translation.translate("header.information.addDataContent", {returnObjects: true}).join("<br/>");

  el.filters.titles.graphSelectTitle.innerHTML = translations.filters.titles.selectGraphType;
  el.filters.titles.filtersTitle.innerHTML = translations.filters.titles.selectChemical;
  el.filters.titles.rbasgGraphSelectSubtitle.innerHTML = Translation.translate("filters.titles.rbasgGraphSelectTitle");
  el.filters.titles.rbfgGraphSelectSubtitle.innerHTML = Translation.translate("filters.titles.rbfgGraphSelectTitle");
  el.filters.titles.rbfGraphSelectSubtitle.innerHTML = Translation.translate("filters.titles.rbfGraphSelectTitle");

  el.filters.titles.chemicalGroup.innerHTML =
    translations.filters.titles.chemicalGroup;
  el.filters.titles.chemical.innerHTML = translations.filters.titles.chemical;
  el.filters.titles.years.innerHTML = translations.filters.titles.years;
  el.filters.titles.multisSels.forEach(
    (multi) => (multi.innerHTML = translations.filters.titles.multiSelSubtitle),
  );
  el.filters.titles.multisSelAlls.forEach(
    (multi) =>
      (multi.innerHTML = translations.filters.titles.multiSelAllSubtitle),
  );

  el.filters.titles.lod.innerText = Translation.translate("filters.titles.lod");
  el.filters.titles.lodSubtitle.innerHTML =
    translations.filters.titles.lodSubtitle;
  el.filters.titles.consumptionUnits.innerHTML =
    translations.filters.titles.units;
  el.filters.titles.rbasgAgeGroup.innerHTML =
    translations.filters.titles.ageGroup;
  el.filters.titles.rbasgSexGroup.innerHTML = Translation.translate("filters.titles.sex");
  el.filters.titles.rbasgDomain.innerHTML = translations.filters.titles.domain;
  el.filters.titles.rbfSortBy.innerHTML = translations.filters.titles.sortBy;
  el.filters.titles.rbfAgeSexGroup.innerHTML =
    translations.filters.titles.ageSexGroup;
  el.filters.titles.rbfgAge.innerHTML = Translation.translate("filters.titles.age");
  el.filters.titles.rbfgSex.innerHTML = Translation.translate("filters.titles.sex");
  el.filters.titles.rbfgRange.innerHTML = translations.filters.titles.range;

  el.filters.sandbox.openButton.innerHTML =
    translations.filters.sandbox.openButton;
  el.filters.sandbox.resetButton.innerText = Translation.translate("filters.sandbox.resetButton");
  el.filters.resetButton.innerText = Translation.translate("filters.titles.reset");
  el.filters.sandbox.title.innerHTML = translations.filters.sandbox.title;
  el.filters.sandbox.referenceLineTitle.innerHTML =
    translations.filters.sandbox.referenceLineTitle;
  el.filters.sandbox.subtitle.innerHTML = translations.filters.sandbox.subtitle;
  el.filters.sandbox.overrideTitle.innerHTML =
    translations.filters.sandbox.overrideTitle;
  el.filters.sandbox.overrideSubtitle.innerHTML =
    translations.filters.sandbox.overrideSubtitle;
  el.filters.sandbox.addOverrideButton.innerHTML =
    translations.filters.sandbox.addOverrideButton;

  el.filters.titles.referenceLine.innerHTML =
    translations.filters.titles.referenceLine;
  el.filters.inputs.referenceLine.placeholder =
    translations.filters.placeholders.none;
  el.filters.titles.overrideFood.innerHTML =
    translations.filters.titles.overrideFood;
  el.filters.titles.overrideValue.innerHTML =
    translations.filters.titles.overrideValue;
  el.filters.inputs.overrideValue.placeholder =
    translations.filters.placeholders.none;

  el.filters.sandbox.showSuppressedTitle.innerHTML =
    translations.filters.sandbox.showSuppressedTitle;
  el.filters.sandbox.showSuppressedSubtitle.innerHTML =
    translations.filters.sandbox.showSuppressedSubTitle;
  el.filters.sandbox.showSuppressedButton.innerHTML =
    translations.filters.sandbox.showSuppressed;

  el.graphs.saveGraph.innerHTML = translations.graphs.saveGraph.button;

  el.dataTable.title.innerHTML = translations.dataTable.title;
  el.dataTable.buttons.downloadConsumptionData.innerHTML =
    translations.dataTable.buttons.downloadConsumptionData;
  el.dataTable.buttons.downloadContaminantData.innerHTML =
    translations.dataTable.buttons.downloadContaminantData;
  el.dataTable.buttons.downloadDataTable.innerHTML =
    translations.dataTable.buttons.downloadDataTable;
  el.dataTable.buttons.downloadTemplate.innerHTML = 
    Translation.translate("dataTable.buttons.downloadTemplate");

  el.about.title.innerHTML = translations.about.title;
  displayAboutTable();
}
