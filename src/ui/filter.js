import { classes, el } from "./const.js";
import { ageGroupOrder, getTranslations, sexGroupOrder, sexGroups, Translation } from "../const.js";
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
  getAgeAndSex,
  getAgeSex,
  getSexDisplays as getSexDisplays,
  DictTool,
  SetTools
} from "../util/data.js";
import { getCompositeInfo } from "../util/graph.js";
import { NumberTool } from "../util/data.js";
import { tdsData } from "../data/dataTranslator.js";


export const FilteredFoodGroups = new Set();

let ChemicalGroupIsSet = false;
let ChemicalIsSet = false;

const InputChecks = {
  ReferenceLine: [
    [(input) => { return input === "" || !NumberTool.isNumber(input) }, () => Translation.translate("errorMsgs.notANumber")],
    [(input) => { return NumberTool.isNegative(input) }, () => Translation.translate("errorMsgs.isNegative")]
  ],

  OverrideValue: [
    [(input) => { return input === "" || !NumberTool.isNumber(input) }, () => Translation.translate("errorMsgs.notANumber")],
    [(input) => { return NumberTool.isNegative(input) }, () => Translation.translate("errorMsgs.isNegative")]
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

// getAgeSexGroup(graphType): Retrieves the age-sex group for a graph
function getAgeSexGroup(graphType) {
  if (!graphType) {
    return [];
  } else if (graphType != GraphTypes.RBFG && graphType != GraphTypes.RBASG) {
    const result = Array.from(el.graphs[graphType]?.filters.ageSexGroup.selectedOptions).map((option) => option.value);
    return result
  }

  // translate the age and sex from the second graph to the corresponding age-sex group
  let sexOptions = Array.from(el.graphs[graphType]?.filters.sex.selectedOptions);
  const sexes = sexOptions.map((option) => option.value);
  sexOptions = new Set(sexOptions.map((option) => option.text));

  const ages = Array.from(el.graphs[graphType]?.filters.age.selectedOptions).map((option) => option.value);
  const result = [];
  
  for (const age of ages) {
    for (const sex of sexes) {
      const ageSexGroup = getAgeSex(age, sex);
      if (!(ageSexGroup in ageSexGroups)) continue;
      
      const sexDisplays = getSexDisplays(sex, age);
      const hasSexDisplays = SetTools.intersection(sexOptions, sexDisplays);
      if (hasSexDisplays.size == 0) continue;

      result.push(ageSexGroup);
    }
  }

  return result;
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

  const ageSexGroups = getAgeSexGroup(graphType);
  let ageGroups = new Set([]);
  let sexGroups = new Set([]);

  for (const ageSexGroup of ageSexGroups) {
    const [age, sex] = getAgeAndSex(ageSexGroup);
    ageGroups.add(age);
    sexGroups.add(sex);
  }

  ageGroups = Array.from(ageGroups);
  sexGroups = Array.from(sexGroups);

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
    ageSexGroups: ageSexGroups,
    ageGroups: ageGroups,
    sexGroups: sexGroups,
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
    filteredFoodGroups: FilteredFoodGroups
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

// clearError(element): Clears the errors for an input element
function clearError(element) {
  let inputElement = $(element);
  inputElement.tooltip('dispose');
}

// getErrorMsgs(element, checkKey): Retrieves the error messages for a certain input
function getErrorMsgs(element, checkKey) {
  const errorMsgs = [];
  const checks = InputChecks[checkKey];

  // get all the error messages
  for (const checkData of checks) {
    const checkFunc = checkData[0];

    if (checkFunc(element.value)) {
      const errorMsg = checkData[1]();
      errorMsgs.push(errorMsg);
    }
  }

  return errorMsgs;
}

// displayError(element, checkKey): Displays the error for input element
function displayError(element, checkKey, tooltipPlacement = "bottom") {
  const errorMsgs = getErrorMsgs(element, checkKey);

  let text = "<ul>"
  for (const msg of errorMsgs) {
    text += `<li>${msg}</li>`
  }
  text += "</ul>"

  clearError(element);

  // display the error
  if (errorMsgs.length > 0) {
    displayErrorTooltip(element, text, tooltipPlacement);
  }

  return errorMsgs;
}


// updateSexFilterFromAges(ages, selectedSexOptions): Updates the sex options based off the current selected ages
function updateSexFilterFromAges(ages, selectedSexOptions, displaySexFilterFunc) {
  selectedSexOptions = new Set(selectedSexOptions.map((option) => option.text));
  let newSelectedSexOptions = new Set();
  let availableSexes = {};
  
  // get the available sexes based off the selected age groups
  for (const age of ages) {
    for (const sexKey in sexGroups) {
      const sex = sexGroups[sexKey];
      const ageSexGroup = getAgeSex(age, sex);

      const sexDisplays = getSexDisplays(sex, age);

      if (!(ageSexGroup in ageSexGroups)) {
        continue;
      }

      SetTools.union(newSelectedSexOptions, sexDisplays, false);
      for (const sexDisplay of sexDisplays) {
        availableSexes[sexDisplay] = sex;
      }
    }
  }

  if (selectedSexOptions.size > 0) {
    newSelectedSexOptions = SetTools.intersection(selectedSexOptions, selectedSexOptions);
  }

  const sexSelection = {};
  for (const sexDisplay in availableSexes) {
    sexSelection[sexDisplay] = newSelectedSexOptions.has(sexDisplay);
  }

  if (availableSexes.size == 0) {
    availableSexes = new Set(Object.values(sexGroups));
  }

  displaySexFilterFunc(availableSexes, sexSelection);

  if (selectionsCompleted()) {
    showFilters();
    displayGraph(getFilteredTdsData());
  }
}

// updateGraph: Rerenders the graph based off the new selection options
function updateGraph() {
  if (selectionsCompleted()) {
    showFilters();
    displayGraph(getFilteredTdsData());
  }
}

// rbfgLegendOnClick(foodGroup): Event listener to filter the graph when the legend item is being clicked
export function rbfgLegendOnClick(foodGroup) {
  const showAllFoodGroups = (foodGroup == Translation.translate("graphs.legend.allFoodGroups") || FilteredFoodGroups.has(foodGroup));

  FilteredFoodGroups.clear();
  if (!showAllFoodGroups) {
    FilteredFoodGroups.add(foodGroup);
  }

  displayGraph(getFilteredTdsData());
}

/**
 * Initialize all the event listeners related to the filters.
 */
function addEventListenersToFilters() {
  el.filters.resetButton.addEventListener("click", () => {
    resetFilters();
  });

  el.filters.sandbox.resetButton.addEventListener("click", () => {
    clearSandbox();
    clearError(el.filters.inputs.referenceLine);
    clearError(el.filters.inputs.overrideValue);
    displayGraph(getFilteredTdsData());
  });

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

  [
    el.filters.inputs.chemicalGroup,
    el.filters.inputs.chemical,
    el.filters.inputs.lod,
    el.filters.inputs.consumptionUnits,
    el.graphs[GraphTypes.RBASG].filters.domain,
    ...Object.values(el.graphs[GraphTypes.RBF].filters),
    el.graphs[GraphTypes.RBFG].filters.range,
  ].forEach((filter) => {
    filter.addEventListener("change", () => {
      updateGraph();
    });
  });

  el.graphs[GraphTypes.RBFG].filters.age.addEventListener("change", () => {
    const ages = Array.from(el.graphs[GraphTypes.RBFG]?.filters.age.selectedOptions).map((option) => option.value);
    let selectedSexOptions = Array.from(el.graphs[GraphTypes.RBFG]?.filters.sex.selectedOptions);

    updateSexFilterFromAges(ages, selectedSexOptions, displayRbfgSexFilter);
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
    const errorMsgs = getErrorMsgs(el.filters.inputs.overrideValue, "OverrideValue");

    if (errorMsgs.length == 0) {
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
  displayChemicals();
  displayLods();
  displayNonChemFilters();
  displayConsumptionUnits();
  displayRbasgDomainFilter();
  displayRbfSortByFilter();
  displayRbfgRangeFilter();
  displayRbasgAgeSexGroupFilter();
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

// createMultiselect(element): Creates the multiselect widget
function createMultiselect(element) {
  return $(element).selectpicker({
    deselectAllText: Translation.translate("deselectAll"), 
    selectAllText: Translation.translate("selectAll"),
    noneSelectedText: Translation.translate("noneSelected"),
    noneResultsText: Translation.translate("noResultsFound")});
}

// displayChemicalGroups(flush): Displays all the chemical group options
//  for the chemical group dropdown selection
function displayChemicalGroups(flush = true) {
  if (flush) {
    el.filters.inputs.chemicalGroup.innerHTML = ""

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

  setDefaultChemicalGroup();
}

// displayChemicals(flush): Displays all the chemical options for the
//  chemical dropdown selection
function displayChemicals(flush = true) {
  const filters = getActiveFilters();

  if (flush) {
    el.filters.inputs.chemical.innerHTML = "";

    let chemicals = Object.keys(
      tdsData.contaminant[el.filters.inputs.chemicalGroup.value],
    ).sort((a, b) => a.localeCompare(b));
  
    if (filters.chemicalGroup == Translation.translate("tdsData.values.PFAS")) {
      const first = Object.values(Translation.translate("tdsData.values.PFASGroupings", {returnObjects: true}));
      chemicals = first.concat(chemicals.filter((chemical) => !first.includes(chemical)));

    } else if (filters.chemicalGroup.trim() == Translation.translate("tdsData.values.radionuclides")) {
      chemicals.unshift(Translation.translate("tdsData.values.totalRadionuclides"));
    }
  
    chemicals.forEach((chemical) => {
      const oe = document.createElement("option");
      oe.value = chemical;
      oe.text = chemical;
      el.filters.inputs.chemical.appendChild(oe);
    });
  }

  setDefaultChemical(filters.chemicalGroup);
}

function displayYears() {
  const filters = getActiveFilters();

  let dropdown = $(el.filters.inputs.years);
  dropdown.selectpicker('destroy');

  let years = [];
  if (filters.chemical == Translation.translate("tdsData.values.totalRadionuclides")) {
    years = new Set();
    const chemicalGroupData = tdsData.contaminant[filters.chemicalGroup];

    for (const chemical in chemicalGroupData) {
      const chemicalData = chemicalGroupData[chemical];
      SetTools.union(years, new Set(Object.keys(chemicalData)), false);
    }

    years = Array.from(years).sort();

  } else {
    years = tdsData.contaminant[filters.chemicalGroup][filters.chemical];
    years = (years == undefined) ? [] : Object.keys(years).sort();
  }

  el.filters.inputs.years.innerHTML = "";
  years.forEach((year) => {
    const oe = document.createElement("option");
    oe.value = year;
    oe.text = year;
    oe.selected = true;
    el.filters.inputs.years.appendChild(oe);
  });

  dropdown = createMultiselect(el.filters.inputs.years);
  dropdown.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
      updateGraph();
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

function displayRbasgAgeGroupFilter(ages) {
  const ageGroupEl = el.graphs[GraphTypes.RBASG].filters.age;

  let dropdown = $(ageGroupEl);
  dropdown.selectpicker('destroy');

  ageGroupEl.innerHTML = "";
  const { showByAgeSexGroup } = getActiveFilters();

  if (showByAgeSexGroup) {
    if (!ageGroupEl.getAttribute("multiple"))
      ageGroupEl.setAttribute("multiple", "");
  } else {
    ageGroupEl.removeAttribute("multiple");
  }

  const sortedAgeGroups = Object.values(ages);
  sortedAgeGroups.sort(compareAge);

  for (const ageGroup of sortedAgeGroups) {
    const oe = document.createElement("option");
    oe.value = ageGroup;
    oe.text = ageGroup;
    oe.selected = showByAgeSexGroup;
    ageGroupEl.appendChild(oe);
  }

  dropdown = createMultiselect(ageGroupEl);
  dropdown.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    const ages = Array.from(el.graphs[GraphTypes.RBASG]?.filters.age.selectedOptions).map((option) => option.value);
    let selectedSexOptions = Array.from(el.graphs[GraphTypes.RBASG]?.filters.sex.selectedOptions);

    updateSexFilterFromAges(ages, selectedSexOptions, displayRbasgSexFilter);

      updateGraph();
  });
}

function displayRbasgSexFilter(sexes, selected = undefined) {
  const sexGroupEl = el.graphs[GraphTypes.RBASG].filters.sex;

  let dropdown = $(sexGroupEl);
  dropdown.selectpicker('destroy');

  sexGroupEl.innerHTML = "";
  sexes = DictTool.getMapSorted(sexes, compareSex);

  for (const [sexDisplay, sex] of sexes) {
    const oe = document.createElement("option");
    oe.value = sex;
    oe.text = sexDisplay;
    oe.selected = (selected === undefined) ? true : Boolean(selected[sexDisplay]);
    sexGroupEl.appendChild(oe);
  }

  dropdown = createMultiselect(sexGroupEl);
  dropdown.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
      updateGraph();
  });
}

function displayRbasgAgeSexGroupFilter() {
  let ages = new Set();
  let sexes = {};

  for (const ageSexGroup in ageSexGroups) {
    const [age, sex] = getAgeAndSex(ageSexGroup);
    ages.add(age);

    const sexDisplays = getSexDisplays(sex, age);
    for (const sexDisplay of sexDisplays) {
      sexes[sexDisplay] = sex;
    }
  }

  ages = Array.from(ages);

  displayRbasgAgeGroupFilter(ages);
  displayRbasgSexFilter(sexes);
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

function compareAge(age1, age2) {
  const ageOrder1 = ageGroupOrder[age1];
  const ageOrder2 = ageGroupOrder[age2];
  return ageOrder1 - ageOrder2;
}

function displayRbfgAgeGroupFilter(ages) {
  const ageGroupEl = el.graphs[GraphTypes.RBFG].filters.age;

  let dropdown = $(ageGroupEl);
  dropdown.selectpicker('destroy');

  ageGroupEl.innerHTML = "";
  ages.sort(compareAge);

  for (const age of ages) {
    const oe = document.createElement("option");
    oe.value = age;
    oe.text = age;
    oe.selected = true;
    ageGroupEl.appendChild(oe);
  }

  dropdown = createMultiselect(ageGroupEl);
  dropdown.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
      updateGraph();
  });
}


function compareSex(sexDisplay1, sexDisplay2, sexes) {
  const sex1 = sexes[sexDisplay1];
  const sex2 = sexes[sexDisplay2];
  const sexOrder1 = sexGroupOrder[sex1];
  const sexOrder2 = sexGroupOrder[sex2];

  if (sexOrder1 != sexOrder2 || sex1 != sexGroups.B) return sexOrder1 - sexOrder2;

  if (sexDisplay1 > sexDisplay2) return 1;
  else if (sexDisplay1 < sexDisplay2) return -1;
  return 0;
}


function displayRbfgSexFilter(sexes, selected = undefined) {
  const sexGroupEl = el.graphs[GraphTypes.RBFG].filters.sex;

  let dropdown = $(sexGroupEl);
  dropdown.selectpicker('destroy');

  sexGroupEl.innerHTML = "";
  sexes = DictTool.getMapSorted(sexes, compareSex);

  for (const [sexDisplay, sex] of sexes) {
    const oe = document.createElement("option");
    oe.value = sex;
    oe.text = sexDisplay;
    oe.selected = (selected === undefined) ? true : Boolean(selected[sexDisplay]);
    sexGroupEl.appendChild(oe);
  }

  dropdown = createMultiselect(sexGroupEl);
  dropdown.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
      updateGraph();
  });
}

function displayRbfgAgeSexGroupFilter() {
  let ages = new Set();
  let sexes = {};

  for (const ageSexGroup in ageSexGroups) {
    const [age, sex] = getAgeAndSex(ageSexGroup);
    ages.add(age);

    const sexDisplays = getSexDisplays(sex, age);
    for (const sexDisplay of sexDisplays) {
      sexes[sexDisplay] = sex;
    }
  }

  ages = Array.from(ages);

  displayRbfgAgeGroupFilter(ages);
  displayRbfgSexFilter(sexes);
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


// infoIconHover(element): When the info icon is being hovered over
export function infoIconOnHover(element) {
    element = d3.select(element);
    element.classed("infoIcon-enabled", true);
    element.classed("infoIcon-disabled", false);
}

// infoIconUnHover(element): when the info icon is unhovered
export function infoIconUnHover(element) {
    element = d3.select(element);

    // do not change back the color if the icon has already been clicked
    if (element.attr("infoIconClicked") == null) {
        element.classed("infoIcon-enabled", false);
        element.classed("infoIcon-disabled", true);
    }
}

// drawToolTips(toolTipId, elementsWithInfoIcons, toolTipTextFunc): Draws the tooltips
export function drawToolTips(toolTipId, elementsWithInfoIcons, toolTipTextFunc = undefined) {
    // ----------- draw the tool tips ---------------
    
    const infoIconGroups = elementsWithInfoIcons.append("span");
    const icons = infoIconGroups.append("i")
        .attr("class", "fa fa-info-circle infoIcon")
        .attr("aria-hidden", true); // used for accessibility purposes

    if (toolTipTextFunc == undefined) {
        toolTipTextFunc = (data) => { return data; };
    }

    icons.attr("id", toolTipId)
        .attr("title", toolTipTextFunc)
        .attr("data-bs-html", "true")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "right")
        .each((data, index, elements) => { $(elements[index]).tooltip({placement: "right", container: "body", trigger: "manual"}); })

        // rewrite the title again since creating a Bootstrap tooltip will set the 'title' attribute to null
        //   and transfer the content of the 'title' attribute to a new attribute called 'data-bs-original-title'
        //
        // Comment out the line below if we want to add back the title attribute.
        // Its used for the hover text of the icon, but the user can see the same text if they click the icon
        //
        // The 'title' attribute seems to be for some assessbility purposes
        // https://fontawesome.com/v5/docs/web/other-topics/accessibility
        //
        // .attr("title", toolTipTextFunc);

    // add the hidden text needed for screen readers
    for (const element of icons._groups[0]) {
        d3.select(element.parentNode).append("span")
            .classed("sr-only", true)
            .text(toolTipTextFunc);
    }

    icons.on("mouseenter", (event) => { 
        infoIconOnHover(event.target)
    });
    icons.on("mouseleave", (event) => { infoIconUnHover(event.target)});

    // ----------------------------------------------
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

  let chemicalData = {};
  let chemicals = new Set([filters.chemical]);
  let chemicalUnits = {};

  if (filters.chemical == Translation.translate("tdsData.values.totalRadionuclides")) {
    const chemicalGroupData = tdsData.contaminant[filters.chemicalGroup];
    chemicals.clear();

    for (const chemical in chemicalGroupData) {
      chemicals.add(chemical);
      const currentChemicalData = chemicalGroupData[chemical];

        for (const year in currentChemicalData) {
          const yearData = currentChemicalData[year];

          if (yearData.length > 0 && chemicalUnits[chemical] == undefined) {
            chemicalUnits[chemical] = yearData[0].units
          }

          if (chemicalData[year] == undefined) {
            chemicalData[year] = structuredClone(yearData); 
          } else {
            chemicalData[year] = chemicalData[year].concat(yearData);
          }
        }
    }

  } else {
    chemicalData = tdsData.contaminant[filters.chemicalGroup][filters.chemical];
  }

  if (chemicalData == undefined) {
    chemicalData = {}
  }

  Object.keys(chemicalData).forEach((year) => {
    if (filters.years.includes(year)) {
      filteredTdsData.contaminant[year] = chemicalData[year];
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
      if (override.entryFound) return;

      for (const chemical of chemicals) {
        filteredContaminantData[year].push({
          chemical: chemical,
          chemicalGroup: filters.chemicalGroup,
          compositeInfo: override.composite,
          lod: 0,
          units: chemicalUnits[chemical],
          occurrence: override.occurrence,
          year: year,
        });
      }
    });
  });

  filteredTdsData.contaminant = filteredContaminantData;
  return filteredTdsData;
}


export function resetFilters() {
  el.filters.inputs.chemicalGroup.innerHTML = "";
  el.filters.inputs.chemical.innerHTML = "";
  resetChemicalGroupIsSet();
  resetChemicalIsSet();
  clearSandbox();

  FilteredFoodGroups.clear();

  displayFilterText();
  displayGraph(getFilteredTdsData());
}
