import { classes, el } from "./const.js";
import { getTranslations, Translation } from "../const.js";
import { displayGraph } from "./graphComponent.js";
import {
  ConsumptionUnits,
  DataTableHeader,
  GraphTypes,
  LODs,
  RbasgDomainFormat,
  RbfSortByFormat,
  RbfgRangeFormat,
  SortByDir,
  ageGroups,
  ageSexGroups,
} from "../const.js";
import {
  formatNumber,
  getAgeSexDisplay,
  getExposureUnit,
  getOverrideText,
} from "../util/data.js";
import { getCompositeInfo } from "../util/graph.js";
import { NumberTool } from "../util/data.js";
import { tdsData } from "../data/dataTranslator.js";


let ChemicalGroupIsSet = false;
let ChemicalIsSet = false;

const InputChecks = {
  ReferenceLine: [
    [(input) => { return input === "" || !NumberTool.isNumber(input) }, Translation.translate("errorMsgs.notANumber")],
    [(input) => { return NumberTool.isNegative(input) }, Translation.translate("errorMsgs.isNegative")]
  ],

  OverrideValue: [
    [(input) => { return input === "" || !NumberTool.isNumber(input) }, Translation.translate("errorMsgs.notANumber")]
  ]
}


/**
 * Return the graph-type selected by the user
 */
export function getSelectedGraphType() {
  const id = document.querySelector(".active-graph-select")?.id.split("-")[0];

  switch (id) {
    case "rbasg":
      return GraphTypes.RBASG;
    case "rbfg":
      return GraphTypes.RBFG;
    case "rbf":
      return GraphTypes.RBF;
    default:
      throw "Invalid graph type selected";
  }
}

/**
 * Check if the user has filled out manditory filters
 */
export function selectionsCompleted() {
  const prevChemicalGroupIsSet = ChemicalGroupIsSet;
  const prevChemicalIsSet = ChemicalIsSet;

  if (!ChemicalGroupIsSet) {
    const chemicalGroup = setDefaultChemicalGroup();
    ChemicalGroupIsSet = chemicalGroup !== "";
  }

  if (!prevChemicalGroupIsSet && ChemicalGroupIsSet) {
    displayChemicals();
  }

  if (ChemicalGroupIsSet && !ChemicalIsSet) {
    const chemical = setDefaultChemical(el.filters.inputs.chemicalGroup.value);
    ChemicalIsSet = chemical !== "";
  }

  if ((!prevChemicalGroupIsSet || !prevChemicalIsSet) && ChemicalGroupIsSet && ChemicalIsSet) {
    displayNonChemFilters();
  }

  return (
    document.querySelector(".active-graph-select") &&
    el.filters.inputs.chemicalGroup.value &&
    el.filters.inputs.chemical.value
  );
}

/**
 * Get all the currently selected filters from the user.
 * Used throughout the application for displaying other filters, executing calculations, displaying/updating graphs, etc.
 */
export function getActiveFilters() {
  let graphType;
  try {
    graphType = getSelectedGraphType();
  } catch (e) {}

  return {
    chemicalGroup: el.filters.inputs.chemicalGroup.value,
    chemical: el.filters.inputs.chemical.value,
    years: Array.from(el.filters.inputs.years.selectedOptions).map(
      (option) => option.value,
    ),
    lod:
      el.filters.inputs.lod.value == getTranslations().filters.lods[LODs[0]]
        ? LODs[0]
        : el.filters.inputs.lod.value ==
          getTranslations().filters.lods[LODs["1/2 LOD"]]
        ? LODs["1/2 LOD"]
        : el.filters.inputs.lod.value ==
          getTranslations().filters.lods[LODs["LOD"]]
        ? LODs["LOD"]
        : el.filters.inputs.lod.value ==
          getTranslations().filters.lods[LODs.Exclude]
        ? LODs.Exclude
        : LODs[0],
    ageSexGroups: graphType
      ? Array.from(
          el.graphs[graphType]?.filters.ageSexGroup.selectedOptions,
        ).map((option) => option.value)
      : [],
    ageSexGroupsIsAgeGroups: graphType == GraphTypes.RBASG,
    showByAgeSexGroup:
      el.graphs[GraphTypes.RBASG].filters.domain.value ==
      getTranslations().filters.rbasgDomainFormat[RbasgDomainFormat.AGESEX],
    usePercent:
      el.graphs[GraphTypes.RBFG].filters.range.value ==
      getTranslations().filters.rbfgRangeFormat[RbfgRangeFormat.PERCENT],
    usePerPersonPerDay:
      el.filters.inputs.consumptionUnits.value ==
      getTranslations().filters.consumptionUnits[ConsumptionUnits.PERSON],
    sortByFood:
      el.graphs[GraphTypes.RBF].filters.sortBy.value ==
      getTranslations().filters.rbfSortByFormat[RbfSortByFormat.FOOD],
    referenceLine: el.filters.inputs.referenceLine.value,
    override: {
      foodGroup: JSON.parse(el.filters.inputs.overrideFood.value || null)
        ?.foodGroup,
      composite: JSON.parse(el.filters.inputs.overrideFood.value || null)
        ?.composite,
      occurrence: parseFloat(el.filters.inputs.overrideValue.value),
      list: Array.from(document.querySelectorAll(".override-item-value")).map(
        (item) => JSON.parse(item.data),
      ),
    },
    useSuppressedHighCvValues:
      el.filters.sandbox.showSuppressedButton.innerHTML ==
      getTranslations().filters.sandbox.showSuppressed
        ? false
        : true,
    dataTableSortBy: {
      column: DataTableHeader.AGE_SEX_GROUP,
      dir: SortByDir.ASC,
    },
  };
}

// displayNonChemFilters(): Displays all the other filters not related to chemicals
function displayNonChemFilters() {
  clearSandbox();
  displayYears();
  if (selectionsCompleted()) {
    el.filters.containers.forEach((container) => {
      container.classList.remove(classes.HIDDEN);
    });
    el.filters.borders.forEach((border) => {
      border.classList.remove(classes.HIDDEN);
    });
  }
}

// displayErrorTooltip(element, text): Displays the tooltip when there is an error
function displayErrorTooltip(element, text, tooltipPlacement = "bottom") {
  d3.select(element)
    .attr("title", text)
    .attr("data-bs-html", "true")
    .attr("data-toggle", "tooltip")
    .attr("data-placement", "right");

  let inputElement = $(element);
  inputElement.tooltip({placement: tooltipPlacement, container: "body", trigger: "manual"});
  inputElement.tooltip("show");

  const tooltipId = d3.select(element).attr("aria-describedby");
  if (!tooltipId) return;

  d3.select(`#${tooltipId}`).classed("warning-tooltip", true);
}

// displayError(element, checkKey): Displays the error for input element
function displayError(element, checkKey, tooltipPlacement = "bottom") {
  let errorMsgs = [];
  const checks = InputChecks[checkKey];

  // get all the error messages
  for (const checkData of checks) {
    const checkFunc = checkData[0];

    if (checkFunc(element.value)) {
      const errorMsg = checkData[1];
      errorMsgs.push(errorMsg);
    }
  }

  let text = "<ul>"
  for (const msg of errorMsgs) {
    text += `<li>${msg}</li>`
  }
  text += "</ul>"

  let inputElement = $(element);
  inputElement.tooltip('dispose');

  // display the error
  if (errorMsgs.length > 0) {
    displayErrorTooltip(element, text, tooltipPlacement);
  }

  return errorMsgs;
}

/**
 * Initialize all the event listeners related to the filters.
 */
function addEventListenersToFilters() {
  el.filters.inputs.chemicalGroup.addEventListener("change", () => {
    displayChemicals();
  });

  el.filters.inputs.chemicalGroup.addEventListener("change", () => {
    const chemicalGroup = el.filters.inputs.chemicalGroup.value;
    setDefaultChemical(chemicalGroup);
    displayNonChemFilters();
  });

  el.filters.inputs.chemical.addEventListener("change", () => {
    displayNonChemFilters();
  });

  el.graphs[GraphTypes.RBASG].filters.domain.addEventListener("change", () => {
    displayRbasgAgeGroupFilter();
  });

  [
    el.filters.inputs.chemicalGroup,
    el.filters.inputs.chemical,
    el.filters.inputs.years,
    el.filters.inputs.lod,
    el.filters.inputs.consumptionUnits,
    ...Object.values(el.graphs[GraphTypes.RBASG].filters),
    ...Object.values(el.graphs[GraphTypes.RBF].filters),
    ...Object.values(el.graphs[GraphTypes.RBFG].filters),
  ].forEach((filter) => {
    filter.addEventListener("change", () => {
      if (selectionsCompleted()) {
        showFilters();
        displayGraph(getFilteredTdsData());
      }
    });
  });

  el.filters.inputs.referenceLine.addEventListener('input', (event) => {
    const errorMsgs = displayError(el.filters.inputs.referenceLine, "ReferenceLine"); 

    if (errorMsgs.length == 0 && selectionsCompleted()) {
      showFilters();
      displayGraph(getFilteredTdsData());
    }
  });

  el.filters.inputs.overrideValue.addEventListener("input", (event) => {
    displayError(el.filters.inputs.overrideValue, "OverrideValue", "right"); 
  });

  el.filters.sandbox.addOverrideButton.addEventListener("click", () => {
    const { override } = getActiveFilters();
    if (override.composite && !isNaN(override.occurrence)) {
      Array.from(el.filters.inputs.overrideFood.options).find(
        (option) =>
          JSON.parse(option.value || null)?.composite == override.composite,
      ).disabled = true;
      el.filters.inputs.overrideFood.selectedIndex = 0;

      const itemContainer = document.createElement("div");
      itemContainer.classList.add(classes.OVERRIDE_ITEM);

      const itemText = document.createElement("div");
      itemText.data = JSON.stringify(override);
      itemText.innerHTML = getOverrideText(override);
      itemText.classList.add(classes.OVERRIDE_VALUE);

      const removeButton = document.createElement("button");
      removeButton.classList.add(classes.SANDBOX_BUTTON);
      removeButton.innerHTML =
        getTranslations().filters.sandbox.removeOverrideButton;
      removeButton.addEventListener("click", () => {
        el.filters.sandbox.overridesList.removeChild(itemContainer);
        Array.from(el.filters.inputs.overrideFood.options).find(
          (option) =>
            JSON.parse(option.value || null)?.composite == override.composite,
        ).disabled = false;
        displayGraph(getFilteredTdsData());
      });

      itemContainer.appendChild(itemText);
      itemContainer.appendChild(removeButton);
      el.filters.sandbox.overridesList.appendChild(itemContainer);
      el.filters.inputs.overrideValue.value = null;
    }
    displayGraph(getFilteredTdsData());
  });

  el.filters.sandbox.showSuppressedButton.addEventListener("click", () => {
    // confirm popup
    if (
      el.filters.sandbox.showSuppressedButton.innerHTML ==
      getTranslations().filters.sandbox.showSuppressed
    ) {
      if (
        confirm(getTranslations().filters.sandbox.confirmShowSuppressedValues)
      ) {
        el.filters.sandbox.showSuppressedButton.innerHTML =
          getTranslations().filters.sandbox.dontShowSuppressed;
        displayGraph(getFilteredTdsData());
      }
    } else {
      el.filters.sandbox.showSuppressedButton.innerHTML =
        getTranslations().filters.sandbox.showSuppressed;
      displayGraph(getFilteredTdsData());
    }
  });
}

export function initializeFilters() {
  addEventListenersToFilters();
  displayFilterText();
}

export function displayFilterText() {
  displayChemicalGroups();
  addPlaceholderToSelect(el.filters.inputs.chemical, "...");
  displayLods();
  displayConsumptionUnits();
  displayRbasgDomainFilter();
  displayRbfSortByFilter();
  displayRbfgRangeFilter();
  displayRbasgAgeGroupFilter();
  displayRbfAgeSexGroupFilter();
  displayRbfgAgeSexGroupFilter();
  addPlaceholderToSelect(
    el.filters.inputs.overrideFood,
    getTranslations().filters.placeholders.select,
  );
  displayOverrideFoodFilter();
}

export function hideFilters() {
  el.filters.hiddenContainers.forEach((container) => {
    container.classList.add(classes.HIDDEN);
  });
  el.filters.borders.forEach((border) => {
    border.classList.add(classes.HIDDEN);
  });
}

export function showFilters() {
  el.filters.hiddenContainers.forEach((container) => {
    container.classList.remove(classes.HIDDEN);
  });
  el.filters.borders.forEach((border) => {
    border.classList.remove(classes.HIDDEN);
  });

  if (
    el.filters.inputs.chemicalGroup.value ==
    getTranslations().tdsData.values.radionuclides
  ) {
    el.filters.containersMap.consumptionUnits.classList.add(classes.HIDDEN);
  }
}

function addPlaceholderToSelect(select, text) {
  const oe = document.createElement("option");
  oe.value = "";
  oe.selected = true;
  oe.disabled = true;
  oe.text = text;
  oe.classList.add(classes.DISABLED);
  select.appendChild(oe);
}

// setDefaultChemicalGroup(): Sets the default chemical group for the
//  chemical group selection
export function setDefaultChemicalGroup() {
  if (tdsData === undefined) return "";

  const chemicalGroups = Object.keys(tdsData.contaminant);
  const result = chemicalGroups.length == 0 ? "" : chemicalGroups.sort((a, b) => a.localeCompare(b))[0];

  el.filters.inputs.chemicalGroup.value = result;
  return result;
}

// resetChemicalGroup(): Resets the flag of whether the chemical group is set
export function resetChemicalGroupIsSet() {
  ChemicalGroupIsSet = false;
}

// setDefaultChemical(chemicalGroup): Sets the default chemical for the
//  chemical selections
export function setDefaultChemical(chemicalGroup) {
  let result = "";
  if (tdsData === undefined) return result;

  let chemicals = tdsData.contaminant[chemicalGroup];
  if (chemicals === undefined) return result;

  chemicals = Object.keys(chemicals);
  result = chemicals.length == 0 ? "" : chemicals.sort((a, b) => a.localeCompare(b))[0];

  el.filters.inputs.chemical.value = result;
  return result;
}

// resetChemical(chemicalGroup): Resets the flag of whether the chemical is set
export function resetChemicalIsSet() {
  ChemicalIsSet = false;
}

// displayChemicalGroups(flush): Displays all the chemical group options
//  for the chemical group dropdown selection
function displayChemicalGroups(flush = true) {
  if (flush) {
    el.filters.inputs.chemicalGroup.innerHTML = ""
  }

  setDefaultChemicalGroup();
  addPlaceholderToSelect(
    el.filters.inputs.chemicalGroup,
    getTranslations().filters.placeholders.select,
  );
  Object.keys(tdsData.contaminant)
    .sort((a, b) => a.localeCompare(b))
    .forEach((chemicalGroup) => {
      const oe = document.createElement("option");
      oe.value = chemicalGroup;
      oe.text = chemicalGroup;
      el.filters.inputs.chemicalGroup.appendChild(oe);
    });
}

// displayChemicals(flush): Displays all the chemical options for the
//  chemical dropdown selection
function displayChemicals(flush = true) {
  if (flush) {
    el.filters.inputs.chemical.innerHTML = "";
  }

  const filters = getActiveFilters();
  let chemicals = Object.keys(
    tdsData.contaminant[el.filters.inputs.chemicalGroup.value],
  ).sort((a, b) => a.localeCompare(b));

  if (filters.chemicalGroup == getTranslations().tdsData.values.PFAS) {
    const first = Object.values(getTranslations().tdsData.values.PFASGroupings);
    chemicals = first.concat(
      chemicals.filter((chemical) => !first.includes(chemical)),
    );
  }

  chemicals.forEach((chemical) => {
    const oe = document.createElement("option");
    oe.value = chemical;
    oe.text = chemical;
    el.filters.inputs.chemical.appendChild(oe);
  });
}

function displayYears() {
  const filters = getActiveFilters();
  el.filters.inputs.years.innerHTML = "";
  const years = Object.keys(
    tdsData.contaminant[filters.chemicalGroup][filters.chemical],
  ).sort();
  years.forEach((year) => {
    const oe = document.createElement("option");
    oe.value = year;
    oe.text = year;
    oe.selected = true;
    el.filters.inputs.years.appendChild(oe);
  });
}

function displayLods() {
  el.filters.inputs.lod.innerHTML = "";
  Object.keys(LODs).forEach((key) => {
    const lod = getTranslations().filters.lods[key];
    const oe = document.createElement("option");
    oe.value = lod;
    oe.text = lod;
    el.filters.inputs.lod.appendChild(oe);
  });
}

function displayConsumptionUnits() {
  el.filters.inputs.consumptionUnits.innerHTML = "";
  Object.keys(ConsumptionUnits).forEach((key) => {
    const unit = getTranslations().filters.consumptionUnits[key];
    const oe = document.createElement("option");
    oe.value = unit;
    oe.text = unit;
    el.filters.inputs.consumptionUnits.appendChild(oe);
  });
}

function displayRbasgAgeGroupFilter() {
  const ageGroupEl = el.graphs[GraphTypes.RBASG].filters.ageSexGroup;
  ageGroupEl.innerHTML = "";
  const { showByAgeSexGroup } = getActiveFilters();

  if (showByAgeSexGroup) {
    if (!ageGroupEl.getAttribute("multiple"))
      ageGroupEl.setAttribute("multiple", "");
  } else {
    ageGroupEl.removeAttribute("multiple");
  }

  Object.values(ageGroups).forEach((a) => {
    const oe = document.createElement("option");
    oe.value = a;
    oe.text = a;
    oe.selected = showByAgeSexGroup;
    ageGroupEl.appendChild(oe);
  });
}

function displayRbasgDomainFilter() {
  const domainEl = el.graphs[GraphTypes.RBASG].filters.domain;
  domainEl.innerHTML = "";

  Object.keys(RbasgDomainFormat).forEach((key) => {
    const format = getTranslations().filters.rbasgDomainFormat[key];
    const oe = document.createElement("option");
    oe.value = format;
    oe.text = format;
    domainEl.appendChild(oe);
  });
}

function displayRbfgAgeSexGroupFilter() {
  const ageSexGroupEl = el.graphs[GraphTypes.RBFG].filters.ageSexGroup;
  ageSexGroupEl.innerHTML = "";

  Object.keys(ageSexGroups).forEach((asg) => {
    const oe = document.createElement("option");
    oe.value = asg;
    oe.text = getAgeSexDisplay(asg);
    oe.selected = true;
    ageSexGroupEl.appendChild(oe);
  });
}

function displayRbfgRangeFilter() {
  const rangeEl = el.graphs[GraphTypes.RBFG].filters.range;
  rangeEl.innerHTML = "";
  Object.keys(RbfgRangeFormat).forEach((key) => {
    const format = getTranslations().filters.rbfgRangeFormat[key];
    const oe = document.createElement("option");
    oe.value = format;
    oe.text = format;
    rangeEl.appendChild(oe);
  });
}

function displayRbfAgeSexGroupFilter() {
  const ageSexGroupEl = el.graphs[GraphTypes.RBF].filters.ageSexGroup;
  ageSexGroupEl.innerHTML = "";

  Object.keys(ageSexGroups).forEach((asg) => {
    const oe = document.createElement("option");
    oe.value = asg;
    oe.text = getAgeSexDisplay(asg);
    ageSexGroupEl.appendChild(oe);
  });
}

function displayRbfSortByFilter() {
  const sortByEl = el.graphs[GraphTypes.RBF].filters.sortBy;
  sortByEl.innerHTML = "";
  Object.keys(RbfSortByFormat).forEach((key) => {
    const sortBy = getTranslations().filters.rbfSortByFormat[key];
    const oe = document.createElement("option");
    oe.value = sortBy;
    oe.text = sortBy;
    sortByEl.appendChild(oe);
  });
}

function displayOverrideFoodFilter() {
  el.filters.inputs.overrideValue.value = "";
  el.filters.sandbox.overridesList.innerHTML = "";
  const overrideFoodEl = el.filters.inputs.overrideFood;
  overrideFoodEl.innerHTML = "";
  addPlaceholderToSelect(
    overrideFoodEl,
    getTranslations().filters.placeholders.select,
  );
  Object.values(tdsData.consumption).forEach((foodGroup) => {
    Object.values(foodGroup).forEach((compositeValues) => {
      if (compositeValues.length == 0) {
        return;
      }
      const oe = document.createElement("option");
      oe.value = JSON.stringify({
        foodGroup: compositeValues[0].foodGroup,
        composite: compositeValues[0].composite,
      });
      oe.text = getCompositeInfo(compositeValues[0]);
      overrideFoodEl.appendChild(oe);
    });
  });
}

/**
 * Depending on the user-selected filters, different LOD values / contamination units may need to be
 * displayed in the LOD descripton
 */
export function updateLodFilterDescription(filteredTdsData, filters) {
  el.filters.titles.lodSubtitle.innerHTML = "";
  let maxContaminantLod = 0;
  let minContaminantLod = Infinity;
  let maxUnits = getTranslations().misc.na;
  let minUnits = getTranslations().misc.na;
  Object.values(filteredTdsData.contaminant).forEach((value) => {
    value.forEach((row) => {
      const currLod = row.lod;
      if (currLod > maxContaminantLod) {
        maxUnits = row.units;
        maxContaminantLod = currLod;
      }
      if (currLod < minContaminantLod) {
        minUnits = row.units;
        minContaminantLod = currLod;
      }
    });
  });
  if (minContaminantLod != Infinity) {
    el.filters.titles.lodSubtitle.innerHTML =
      getTranslations().filters.titles.lodSubtitle +
      " " +
      (minContaminantLod == 0 && maxContaminantLod == 0
        ? "0 - 0"
        : formatNumber(minContaminantLod, filters, 2) +
          " " +
          minUnits +
          " - " +
          formatNumber(maxContaminantLod, filters, 2) +
          " " +
          maxUnits);
  }
}

/**
 * Depending on the user-selected filters, different consumption/contaminations units may need to be
 * displayed in the sandbox
 */
export function updateSandbox(filteredTdsData, filters) {
  el.filters.titles.referenceLine.innerHTML =
    getTranslations().filters.titles.referenceLine +
    '<span class="small"> (' +
    (Object.keys(filteredTdsData.contaminant).length != 0
      ? getExposureUnit(
          Object.values(filteredTdsData.contaminant)[0][0].units,
          filters,
        )
      : getTranslations().misc.na) +
    ")</span>";

  el.filters.titles.overrideValue.innerHTML =
    getTranslations().filters.titles.overrideValue +
    '<span class="small"> (' +
    (Object.keys(filteredTdsData.contaminant).length != 0
      ? Object.values(filteredTdsData.contaminant)[0][0].units
      : getTranslations().misc.na) +
    ")</span>";
}

/**
 * Clear sandbox values whenever the chemical has been changed
 */
export function clearSandbox() {
  el.filters.inputs.referenceLine.value = "";
  displayOverrideFoodFilter();
}

/**
 * A function that retrieves the current user-selected filters, and filters the contaminant data from the global
 * TDS data for the currently-selected chemical group, chemical, and years. This function is called before passing
 * data off to calculation/graph functions. See the global TDS data object for description of the returned fields.
 *
 * Returns:
 * - An object containing filtered TDS data in a structured format with the following properties:
 *   - contaminant
 *     - chemicalGroup
 *     - chemical
 *     - year:
 *       - chemicalGroup
 *       - chemical
 *       - year
 *       - compositeInfo:
 *       - occurrence
 *       - units
 *       - lod
 *   - consumption
 *     - foodGroup
 *       - composite
 *         - age
 *         - ageSexGroup
 *         - composite
 *         - compositeDesc
 *         - foodGroup
 *         - meanFlag
 *         - meanGramsPerKgBWPerDay
 *         - meanGramsPerPersonPerDay
 *         - sex
 *       // ... (more composites)
 *     // ... (more food groups)
 */
export function getFilteredTdsData() {
  const filters = getActiveFilters();
  let filteredTdsData = {
    ...tdsData,
    contaminant: {},
  };

  Object.keys(
    tdsData.contaminant[filters.chemicalGroup][filters.chemical],
  ).forEach((year) => {
    if (filters.years.includes(year)) {
      filteredTdsData.contaminant[year] =
        tdsData.contaminant[filters.chemicalGroup][filters.chemical][year];
    }
  });

  const filteredContaminantData = {};
  Object.keys(filteredTdsData.contaminant).forEach((year) => {
    filteredContaminantData[year] = [];
    filters.override.list = filters.override.list.map((override) => {
      return { ...override, entryFound: false };
    });
    filteredTdsData.contaminant[year].forEach((row) => {
      const modifiedRow = { ...row };
      filters.override.list.forEach((override) => {
        if (row.compositeInfo.includes(override.composite)) {
          override.entryFound = true;
          modifiedRow.occurrence = override.occurrence;
        }
      });
      filteredContaminantData[year].push(modifiedRow);
    });

    filters.override.list.forEach((override) => {
      if (!override.entryFound) {
        filteredContaminantData[year].push({
          chemical: filters.chemical,
          chemicalGroup: filters.chemicalGroup,
          compositeInfo: override.composite,
          lod: 0,
          units: filteredTdsData.contaminant[year][0].units,
          occurrence: override.occurrence,
          year: year,
        });
      }
    });
  });

  filteredTdsData.contaminant = filteredContaminantData;

  return filteredTdsData;
}
