import { getTranslations } from "../translation/translation.js";
import { el } from "./const.js";
import { displayAboutTable } from "./dataTableComponent.js";

/**
 * Much of the text found on the page is hard-coded. For this reason,
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
  el.filters.titles.chemicalGroup.innerHTML =
    translations.filters.titles.chemicalGroup;
  el.filters.titles.chemical.innerHTML = translations.filters.titles.chemical;
  el.filters.titles.years.innerHTML = translations.filters.titles.years;
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

  el.dataTable.title.innerHTML = translations.dataTable.title;
  el.dataTable.buttons.downloadConsumptionData.innerHTML =
    translations.dataTable.buttons.downloadConsumptionData;
  el.dataTable.buttons.downloadContaminentData.innerHTML =
    translations.dataTable.buttons.downloadContaminentData;
  el.dataTable.buttons.downloadDataTable.innerHTML =
    translations.dataTable.buttons.downloadDataTable;

  el.about.title.innerHTML = translations.about.title;
  displayAboutTable();
}
