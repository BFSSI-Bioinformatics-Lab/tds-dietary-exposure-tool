import {
  DataType,
  GraphTypes,
  SortByDir,
  toggleUserLanguage,
} from "../const.js";
import { getTranslations } from "../translation/translation.js";
import {
  displayAboutTable,
  displayDataTable,
  downloadDataTable,
  downloadTDSData,
} from "./dataTableComponent.js";
import { classs, el, text } from "./const.js";
import { displayGraph, downloadGraph } from "./graphComponent.js";
import { getOverrideText } from "../util/data.js";
import { loadTdsData } from "../data/dataTranslator.js";
import {
  displayFilterText,
  getActiveFilters,
  getFilteredTdsData,
  getSelectedGraphType,
  hideFilters,
} from "./filter.js";

/**
 * Initialize all the event listeners related to the page: dropdowns, buttons, etc.
 */
export function addEventListenersToPage() {
  /* Dropdowns */

  [
    el.header.information.howToUse,
    el.header.information.moreInfo,
    el.dataTable.dropdown,
    el.about.dropdown,
  ].forEach((dropdown) => {
    addEventListenersToDropdown(dropdown);
  });

  /* Buttons */

  el.header.languageButton.addEventListener("click", async () => {
    toggleUserLanguage();
    await resetPage();
  });
  el.filters.sandbox.openButton.addEventListener("click", () => {
    el.filters.sandbox.container.classList.remove(classs.HIDDEN);
  });
  el.filters.sandbox.closeButton.addEventListener("click", () => {
    el.filters.sandbox.container.classList.add(classs.HIDDEN);
  });
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
}

/**
 * Function used to perform UI changes necessary for a dropdown.
 */
function addEventListenersToDropdown(dropdown) {
  const { button, content, arrowDown, arrowRight } = dropdown;
  button.addEventListener("click", () => {
    content.classList.contains(classs.HIDDEN)
      ? content.classList.remove(classs.HIDDEN)
      : content.classList.add(classs.HIDDEN);

    (arrowDown.classList.contains(classs.HIDDEN)
      ? () => {
        arrowDown.classList.remove(classs.HIDDEN);
        arrowRight.classList.add(classs.HIDDEN);
      }
      : () => {
        arrowRight.classList.remove(classs.HIDDEN);
        arrowDown.classList.add(classs.HIDDEN);
      })();
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

/**
 * Function to reset the application: hiding certain elements, redisplay page text, clear and redisplay filters, reload data, etc.
 * This function is used when switching languages.
 */
async function resetPage() {
  el.misc.loader.classList.remove(classs.HIDDEN);
  initializePageText();
  hideFilters();
  el.graphs.container.classList.add(classs.HIDDEN);
  el.graphs.saveGraph.classList.add(classs.HIDDEN);
  el.dataTable.dataContainer.classList.add(classs.HIDDEN);
  el.about.container.classList.add(classs.HIDDEN);
  el.filters.sandbox.container.classList.add(classs.HIDDEN);
  el.filters.inputs.chemicalGroup.innerHTML = "";
  el.filters.inputs.chemical.innerHTML = "";
  await loadTdsData();
  displayFilterText();
  el.misc.loader.classList.add(classs.HIDDEN);
}

/**
 * Much of the text found on the page is stored in a translation file. For this reason,
 * this function exists to dynamically load that text into the page.
 */
export async function initializePageText() {
  const translations = getTranslations();

  el.header.title.innerHTML = translations.header.title;
  el.header.subtitle.innerHTML = translations.header.subtitle;
  el.header.information.howToUse.button.innerHTML =
    translations.header.information.howToUseButton;
  el.header.information.howToUse.content.innerHTML =
    translations.header.information.howToUseContent.join("<br/>");
  el.header.information.moreInfo.button.innerHTML =
    translations.header.information.moreInfoButton;
  el.header.information.moreInfo.content.innerHTML =
    translations.header.information.moreInfoContent.join("<br/>");
  el.header.languageButton.innerHTML = translations.header.language;

  el.filters.titles.title.innerHTML = translations.filters.titles.title;

  Object.keys(GraphTypes).forEach((graphType) => {
    const caption = document.createElement("figcaption");
    caption.innerHTML = getTranslations().filters.graphSelects[graphType];
    el.graphs[graphType].graphSelect.removeChild(
      el.graphs[graphType].graphSelect.lastChild,
    );
    el.graphs[graphType].graphSelect.appendChild(caption);
  });

  el.filters.titles.chemicalGroup.innerHTML =
    translations.filters.titles.chemicalGroup;
  el.filters.titles.chemical.innerHTML = translations.filters.titles.chemical;
  el.filters.titles.years.innerHTML = translations.filters.titles.years;
  el.filters.titles.multis.forEach(
    (multi) => (multi.innerHTML = translations.filters.titles.multiSubtitle),
  );
  el.filters.titles.lod.innerHTML = translations.filters.titles.lod;
  el.filters.titles.lodSubtitle.innerHTML =
    translations.filters.titles.lodSubtitle;
  el.filters.titles.consumptionUnits.innerHTML =
    translations.filters.titles.units;
  el.filters.titles.rbasgAgeGroup.innerHTML =
    translations.filters.titles.ageGroup;
  el.filters.titles.rbasgDomain.innerHTML = translations.filters.titles.domain;
  el.filters.titles.rbfSortBy.innerHTML = translations.filters.titles.sortBy;
  el.filters.titles.rbfAgeSexGroup.innerHTML =
    translations.filters.titles.ageSexGroup;
  el.filters.titles.rbfgAgeSexGroup.innerHTML =
    translations.filters.titles.ageSexGroup;
  el.filters.titles.rbfgRange.innerHTML = translations.filters.titles.range;

  el.filters.sandbox.openButton.innerHTML =
    translations.filters.sandbox.openButton;
  el.filters.sandbox.closeButton.innerHTML =
    translations.filters.sandbox.closeButton;
  el.filters.sandbox.title.innerHTML = translations.filters.sandbox.title;
  el.filters.sandbox.referenceLineTitle.innerHTML =
    translations.filters.sandbox.referenceLineTitle;
  el.filters.sandbox.overrideTitle.innerHTML =
    translations.filters.sandbox.overrideTitle;
  el.filters.sandbox.overrideSubtitle.innerHTML =
    translations.filters.sandbox.overrideSubtitle;

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

  el.graphs.saveGraph.innerHTML = translations.graphs.saveGraph.button;

  el.dataTable.title.innerHTML = translations.dataTable.title;
  el.dataTable.buttons.downloadConsumptionData.innerHTML =
    translations.dataTable.buttons.downloadConsumptionData;
  el.dataTable.buttons.downloadContaminantData.innerHTML =
    translations.dataTable.buttons.downloadContaminantData;
  el.dataTable.buttons.downloadDataTable.innerHTML =
    translations.dataTable.buttons.downloadDataTable;

  el.about.title.innerHTML = translations.about.title;
  displayAboutTable();
}
