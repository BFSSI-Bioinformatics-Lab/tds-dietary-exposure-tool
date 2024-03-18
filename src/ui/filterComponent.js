import { el } from "./const.js";

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
import { downloadTDSData } from "./dataTableComponent.js";
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
      console.error("Invalid graph type selected");
  }
}

export function getActiveFilters() {
  const graphType = getSelectedGraphType();

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
    ageSexGroups: Array.from(
      el.graphs[graphType].filters.ageSexGroup.selectedOptions,
    ).map((option) => option.value),
    ageSexGroupsIsAgeGroups: getSelectedGraphType() == GraphTypes.RBASG,
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

export function addEventListenersToPage() {
  [el.header.information.howToUse, el.header.information.moreInfo].forEach(
    (dropdown) => {
      dropdown.button.addEventListener("click", () => {
        dropdown.content.classList.contains("hidden")
          ? dropdown.content.classList.remove("hidden")
          : dropdown.content.classList.add("hidden");
      });
    },
  );
  Object.values(el.dataTable.buttons).forEach((button) => {
    button.addEventListener("click", () => {
      downloadTDSData(
        button.id == el.dataTable.buttons.downloadConsumptionData.id
          ? DataType.CONSUMPTION
          : DataType.CONTAMINENT,
      );
    });
  });
}

function addEventListenersToFilters(tdsData) {
  el.filters.selects.chemicalGroup.addEventListener("change", () => {
    displayChemicals(tdsData);
  });

  [el.filters.selects.chemicalGroup, el.filters.selects.chemical].forEach(
    (filter) => {
      filter.addEventListener("change", () => {
        displayYears(tdsData);
      });
    },
  );

  el.graphs[GraphTypes.RBASG].filters.domain.addEventListener("change", () => {
    displayRbasgAgeSexGroupFilter(tdsData);
  });

  const graphSelects = [
    el.graphs[GraphTypes.RBASG].graphSelect,
    el.graphs[GraphTypes.RBF].graphSelect,
    el.graphs[GraphTypes.RBFG].graphSelect,
  ];
  const additionalFilterContainers = [
    ...el.graphs[GraphTypes.RBASG].filterContainers,
    ...el.graphs[GraphTypes.RBF].filterContainers,
    ...el.graphs[GraphTypes.RBFG].filterContainers,
  ];
  graphSelects.forEach((element) => {
    element.addEventListener("click", () => {
      graphSelects.forEach((element) => {
        element.classList.remove("active-graph-select");
      });
      additionalFilterContainers.forEach((filter) => {
        filter.classList.remove("filter-additional-active");
      });
      element.classList.add("active-graph-select");
      const graphType = getSelectedGraphType();
      el.graphs[graphType].filterContainers.forEach((container) => {
        if (!container.classList.contains("filter-additional-active")) {
          container.classList.add("filter-additional-active");
        }
      });
      filterTdsDataAndUpdateGraph(tdsData);
    });
  });

  [
    ...Object.values(el.filters.selects),
    ...Object.values(el.graphs[GraphTypes.RBASG].filters),
    ...Object.values(el.graphs[GraphTypes.RBF].filters),
    ...Object.values(el.graphs[GraphTypes.RBFG].filters),
  ].forEach((filter) => {
    filter.addEventListener("change", () => {
      filterTdsDataAndUpdateGraph(tdsData);
    });
  });
}

export function initializeFilters(tdsData) {
  addEventListenersToFilters(tdsData);

  displayChemicalGroups(tdsData);
  displayChemicals(tdsData);
  displayYears(tdsData);
  displayLods(tdsData);
  displayConsumptionUnits();

  displayRbasgAdditionalFilters(tdsData);
  displayRbfgAdditionalFilters(tdsData);
  displayRbfAdditionalFilters(tdsData);
}

function displayChemicalGroups(tdsData) {
  el.filters.selects.chemicalGroup.innerHTML = "";
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
  el.filters.selects.years.innerHTML = "";
  const years = Object.keys(
    tdsData.contaminent[el.filters.selects.chemicalGroup.value][
    el.filters.selects.chemical.value
    ],
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

function displayRbasgAdditionalFilters(tdsData) {
  const domainEl = el.graphs[GraphTypes.RBASG].filters.domain;
  domainEl.innerHTML = "";

  Object.keys(RbasgDomainFormat).forEach((key) => {
    const format = getTranslations().filters.rbasgDomainFormat[key];
    const oe = document.createElement("option");
    oe.value = format;
    oe.text = format;
    domainEl.appendChild(oe);
  });
  displayRbasgAgeSexGroupFilter();
}

function displayRbasgAgeSexGroupFilter() {
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

function displayRbfgAdditionalFilters() {
  const ageSexGroupEl = el.graphs[GraphTypes.RBFG].filters.ageSexGroup;
  ageSexGroupEl.innerHTML = "";

  Object.keys(ageSexGroups).forEach((asg) => {
    const oe = document.createElement("option");
    oe.value = asg;
    oe.text = asg;
    oe.selected = true;
    ageSexGroupEl.appendChild(oe);
  });

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

function displayRbfAdditionalFilters() {
  const ageSexGroupEl = el.graphs[GraphTypes.RBF].filters.ageSexGroup;
  ageSexGroupEl.innerHTML = "";
  Object.keys(ageSexGroups).forEach((asg) => {
    const oe = document.createElement("option");
    oe.value = asg;
    oe.text = asg;
    ageSexGroupEl.appendChild(oe);
  });

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

export function filterTdsDataAndUpdateGraph(tdsData) {
  const selectedYears = Array.from(
    el.filters.selects.years.selectedOptions,
  ).map((option) => option.value);

  const filteredTdsData = {
    ...tdsData,
    contaminent: {},
  };

  Object.keys(
    tdsData.contaminent[el.filters.selects.chemicalGroup.value][
    el.filters.selects.chemical.value
    ],
  ).forEach((year) => {
    if (selectedYears.includes(year)) {
      filteredTdsData.contaminent[year] =
        tdsData.contaminent[el.filters.selects.chemicalGroup.value][
        el.filters.selects.chemical.value
        ][year];
    }
  });

  updateLodFilterDescription(filteredTdsData);

  displayGraph(filteredTdsData);
}

function updateLodFilterDescription(filteredTdsData) {
  el.filters.titles.lodSubtitle.innerHTML = "";
  let maxContaminentLod = 0;
  let minContaminentLod = Infinity;
  let units = null;
  Object.values(filteredTdsData.contaminent).forEach((value) => {
    value.forEach((row) => {
      const currLod = row.lod;
      units = row.units;
      if (currLod > maxContaminentLod) {
        maxContaminentLod = currLod;
      }
      if (currLod < minContaminentLod) {
        minContaminentLod = currLod;
      }
    });
  });
  if (minContaminentLod != Infinity) {
    el.filters.titles.lodSubtitle.innerHTML =
      getTranslations().filters.titles.lodSubtitle +
      " " +
      minContaminentLod +
      " - " +
      maxContaminentLod +
      " " +
      units;
  }
}
