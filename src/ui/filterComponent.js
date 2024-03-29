import { classs, el } from "./const.js";

import { displayGraph } from "./graphComponent.js";
import {
  ConsumptionUnits,
  DataType,
  GraphTypes,
  LODs,
  RbasgDomainFormat,
  RbfSortByFormat,
  RbfgRangeFormat,
  ageGroups,
  ageSexGroups,
} from "../config.js";
import { downloadDataTable, downloadTDSData } from "./dataTableComponent.js";
import { getTranslations } from "../translation/translation.js";

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
 *
 * Check if the user has filled out manditory filters
 *
 */
function selectionsCompleted() {
  return (
    document.querySelector(".active-graph-select") &&
    el.filters.selects.chemicalGroup.value &&
    el.filters.selects.chemical.value
  );
}

export function getActiveFilters() {
  let graphType;
  try {
    graphType = getSelectedGraphType();
  } catch (e) { }

  return {
    chemicalGroup: el.filters.selects.chemicalGroup.value,
    chemical: el.filters.selects.chemical.value,
    years: Array.from(el.filters.selects.years.selectedOptions).map(
      (option) => option.value,
    ),
    lod:
      el.filters.selects.lod.value == getTranslations().filters.lods[LODs[0]]
        ? LODs[0]
        : el.filters.selects.lod.value ==
          getTranslations().filters.lods[LODs["1/2 LOD"]]
          ? LODs["1/2 LOD"]
          : el.filters.selects.lod.value ==
            getTranslations().filters.lods[LODs["LOD"]]
            ? LODs["LOD"]
            : el.filters.selects.lod.value ==
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
      el.filters.selects.consumptionUnits.value ==
      getTranslations().filters.consumptionUnits[ConsumptionUnits.PERSON],
    sortByFood:
      el.graphs[GraphTypes.RBF].filters.sortBy.value ==
      getTranslations().filters.rbfSortByFormat[RbfSortByFormat.FOOD],
  };
}

export function addEventListenersToPage(tdsData) {
  [el.header.information.howToUse, el.header.information.moreInfo].forEach(
    (dropdown) => {
      dropdown.button.addEventListener("click", () => {
        dropdown.content.classList.contains(classs.HIDDEN)
          ? dropdown.content.classList.remove(classs.HIDDEN)
          : dropdown.content.classList.add(classs.HIDDEN);
      });
    },
  );

  el.dataTable.title.addEventListener("click", () => {
    if (el.dataTable.container.classList.contains(classs.HIDDEN)) {
      el.dataTable.container.classList.remove(classs.HIDDEN);
    } else {
      el.dataTable.container.classList.add(classs.HIDDEN);
    }
  });
  el.dataTable.buttons.downloadConsumptionData.addEventListener("click", () => {
    downloadTDSData(DataType.CONSUMPTION);
  });
  el.dataTable.buttons.downloadConsumptionData.addEventListener("click", () => {
    downloadTDSData(DataType.CONTAMINENT);
  });
  el.dataTable.buttons.downloadDataTable.addEventListener("click", () => {
    downloadDataTable(getFilteredTdsData(tdsData), getSelectedGraphType());
  });

  el.about.title.addEventListener("click", () => {
    if (el.about.tableContainer.classList.contains(classs.HIDDEN)) {
      el.about.tableContainer.classList.remove(classs.HIDDEN);
    } else {
      el.about.tableContainer.classList.add(classs.HIDDEN);
    }
  });
}

function addEventListenersToFilters(tdsData) {
  el.filters.selects.chemicalGroup.addEventListener("change", () => {
    displayChemicals(tdsData);
  });

  [el.filters.selects.chemicalGroup, el.filters.selects.chemical].forEach(
    (select) =>
      select.addEventListener("change", () => {
        displayYears(tdsData);
        if (selectionsCompleted()) {
          el.filters.containers.forEach((container) => {
            container.classList.remove(classs.HIDDEN);
          });
        }
      }),
  );

  el.graphs[GraphTypes.RBASG].filters.domain.addEventListener("change", () => {
    displayRbasgAgeGroupFilter(tdsData);
  });

  const graphSelects = [
    el.graphs[GraphTypes.RBASG].graphSelect,
    el.graphs[GraphTypes.RBF].graphSelect,
    el.graphs[GraphTypes.RBFG].graphSelect,
  ];

  graphSelects.forEach((element) => {
    element.addEventListener("click", () => {
      graphSelects.forEach((element) => {
        element.classList.remove("active-graph-select");
      });
      [
        ...el.graphs[GraphTypes.RBASG].filterContainers,
        ...el.graphs[GraphTypes.RBF].filterContainers,
        ...el.graphs[GraphTypes.RBFG].filterContainers,
      ].forEach((filter) => {
        filter.classList.remove("filter-additional-active");
      });
      element.classList.add("active-graph-select");
      const graphType = getSelectedGraphType();
      el.graphs[graphType].filterContainers.forEach((container) => {
        if (!container.classList.contains("filter-additional-active")) {
          container.classList.add("filter-additional-active");
        }
      });
      if (selectionsCompleted()) {
        el.filters.containers.forEach((container) => {
          container.classList.remove(classs.HIDDEN);
        });
        displayGraph(getFilteredTdsData(tdsData));
      }
    });
  });

  [
    ...Object.values(el.filters.selects),
    ...Object.values(el.graphs[GraphTypes.RBASG].filters),
    ...Object.values(el.graphs[GraphTypes.RBF].filters),
    ...Object.values(el.graphs[GraphTypes.RBFG].filters),
  ].forEach((filter) => {
    filter.addEventListener("change", () => {
      if (selectionsCompleted()) {
        el.filters.containers.forEach((container) => {
          container.classList.remove(classs.HIDDEN);
        });
        displayGraph(getFilteredTdsData(tdsData));
      }
    });
  });
}

export function initializeFilters(tdsData) {
  addEventListenersToFilters(tdsData);
  displayChemicalGroups(tdsData);
  displayLods();
  displayConsumptionUnits();
  displayRbasgDomainFilter();
  displayRbfSortByFilter();
  displayRbfgRangeFilter();
  displayRbasgAgeGroupFilter();
  displayRbfAgeSexGroupFilter();
  displayRbfgAgeSexGroupFilter();
}

function addPlaceholderToSelect(select, text) {
  const oe = document.createElement("option");
  oe.value = "";
  oe.selected = true;
  oe.disabled = true;
  oe.text = text;
  select.appendChild(oe);
}

function displayChemicalGroups(tdsData) {
  el.filters.selects.chemicalGroup.innerHTML = "";
  addPlaceholderToSelect(
    el.filters.selects.chemicalGroup,
    getTranslations().misc.selectPlaceholder,
  );
  Object.keys(tdsData.contaminent)
    .sort()
    .forEach((chemicalGroup) => {
      const oe = document.createElement("option");
      oe.value = chemicalGroup;
      oe.text = chemicalGroup;
      el.filters.selects.chemicalGroup.appendChild(oe);
    });
}

function displayChemicals(tdsData) {
  el.filters.selects.chemical.innerHTML = "";
  const chemicals = Object.keys(
    tdsData.contaminent[el.filters.selects.chemicalGroup.value],
  ).sort();
  chemicals.forEach((chemical) => {
    const oe = document.createElement("option");
    oe.value = chemical;
    oe.text = chemical;
    el.filters.selects.chemical.appendChild(oe);
  });
}

function displayYears(tdsData) {
  const filters = getActiveFilters();
  el.filters.selects.years.innerHTML = "";
  const years = Object.keys(
    tdsData.contaminent[filters.chemicalGroup][filters.chemical],
  ).sort();
  years.forEach((year) => {
    const oe = document.createElement("option");
    oe.value = year;
    oe.text = year;
    oe.selected = true;
    el.filters.selects.years.appendChild(oe);
  });
}

function displayLods() {
  el.filters.selects.lod.innerHTML = "";
  Object.keys(LODs).forEach((key) => {
    const lod = getTranslations().filters.lods[key];
    const oe = document.createElement("option");
    oe.value = lod;
    oe.text = lod;
    el.filters.selects.lod.appendChild(oe);
  });
}

function displayConsumptionUnits() {
  Object.keys(ConsumptionUnits).forEach((key) => {
    const unit = getTranslations().filters.consumptionUnits[key];
    const oe = document.createElement("option");
    oe.value = unit;
    oe.text = unit;
    el.filters.selects.consumptionUnits.appendChild(oe);
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
    oe.text = asg;
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
    oe.text = asg;
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

export function getFilteredTdsData(tdsData) {
  const filters = getActiveFilters();
  const filteredTdsData = {
    ...tdsData,
    contaminent: {},
  };

  Object.keys(
    tdsData.contaminent[filters.chemicalGroup][filters.chemical],
  ).forEach((year) => {
    if (filters.years.includes(year)) {
      filteredTdsData.contaminent[year] =
        tdsData.contaminent[filters.chemicalGroup][filters.chemical][year];
    }
  });

  return filteredTdsData;
}

export function updateLodFilterDescription(filteredTdsData) {
  el.filters.titles.lodSubtitle.innerHTML = "";
  let maxContaminentLod = 0;
  let minContaminentLod = Infinity;
  let maxUnits = null;
  let minUnits = null;
  Object.values(filteredTdsData.contaminent).forEach((value) => {
    value.forEach((row) => {
      const currLod = row.lod;
      if (currLod > maxContaminentLod) {
        maxUnits = row.units;
        maxContaminentLod = currLod;
      }
      if (currLod < minContaminentLod) {
        minUnits = row.units;
        minContaminentLod = currLod;
      }
    });
  });
  if (minContaminentLod != Infinity) {
    el.filters.titles.lodSubtitle.innerHTML =
      getTranslations().filters.titles.lodSubtitle +
      " " +
      minContaminentLod +
      " " +
      minUnits +
      " - " +
      maxContaminentLod +
      " " +
      maxUnits;
  }
}
