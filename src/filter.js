import { displayGraph } from "./graph.js";
import { getTranslation } from "./translation.js";

import { el } from "./const.js";

function addEventListenersToFilters(tdsData) {
  el.chemicalGroupFilter.addEventListener("change", () => {
    displayChemicals(tdsData);
  });

  [el.chemicalGroupFilter, el.chemicalFilter].forEach((filter) => {
    filter.addEventListener("change", () => {
      displayYears(tdsData);
    });
  });

  [el.rbasgSelect, el.rbfgSelect, el.rbfSelect].forEach((element) => {
    element.addEventListener("click", () => {
      [el.rbasgSelect, el.rbfgSelect, el.rbfSelect].forEach((element) => {
        element.classList.remove("active-graph-select");
      });
      document.querySelectorAll(".graph-container").forEach((graph) => {
        graph.classList.remove("active-graph-container");
      });
      element.classList.add("active-graph-select");
      filterTdsDataAndUpdateGraph(tdsData);
    });
  });

  [
    el.chemicalGroupFilter,
    el.chemicalFilter,
    el.yearFilter,
    el.lodFilter,
    el.rbasgUnitsFilter,
    el.rbasgAgeSexGroupFilter,
    el.rbasgDomainFilter,
    el.rbfgRangeFilter,
    el.rbfgAgeSexGroupFilter,
    el.rbfAgeSexGroupFilter,
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

  displayRbasgAdditionalFilters(tdsData);
  displayRbfgAdditionalFilters(tdsData);
  displayRbfAdditionalFilters(tdsData);
}

function displayChemicalGroups(tdsData) {
  el.chemicalGroupFilter.innerHTML = "";
  Object.keys(tdsData.contaminentOccurenceData)
    .sort()
    .forEach((chemicalGroup) => {
      const oe = document.createElement("option");
      oe.value = chemicalGroup;
      oe.text = chemicalGroup;
      el.chemicalGroupFilter.appendChild(oe);
    });
}

function displayChemicals(tdsData) {
  el.chemicalFilter.innerHTML = "";
  const chemicals = Object.keys(
    tdsData.contaminentOccurenceData[el.chemicalGroupFilter.value],
  ).sort();
  chemicals.forEach((chemical) => {
    const oe = document.createElement("option");
    oe.value = chemical;
    oe.text = chemical;
    el.chemicalFilter.appendChild(oe);
  });
}

function displayYears(tdsData) {
  el.yearFilter.innerHTML = "";
  const years = Object.keys(
    tdsData.contaminentOccurenceData[el.chemicalGroupFilter.value][
      el.chemicalFilter.value
    ],
  ).sort();
  years.forEach((year) => {
    const oe = document.createElement("option");
    oe.value = year;
    oe.text = year;
    oe.selected = true;
    el.yearFilter.appendChild(oe);
  });
}

function displayLods(tdsData) {
  el.lodFilter.innerHTML = "";
  tdsData.sets.lods.forEach((lod) => {
    const oe = document.createElement("option");
    oe.value = lod;
    oe.text = lod;
    el.lodFilter.appendChild(oe);
  });
}

function displayRbasgAdditionalFilters(tdsData) {
  el.rbasgUnitsFilter.innerHTML = "";
  el.rbasgDomainFilter.innerHTML = "";
  el.rbasgAgeSexGroupFilter.innerHTML = "";
  ["ng per kg bodyweight", "ng per person"].forEach((year) => {
    const oe = document.createElement("option");
    oe.value = year;
    oe.text = year;
    el.rbasgUnitsFilter.appendChild(oe);
  });
  ["Show by Age-Sex", "Show by Year"].forEach((year) => {
    const oe = document.createElement("option");
    oe.value = year;
    oe.text = year;
    el.rbasgDomainFilter.appendChild(oe);
  });
  tdsData.sets.ageSexGroups.forEach((asg) => {
    const oe = document.createElement("option");
    oe.value = asg;
    oe.text = asg;
    oe.selected = true;
    el.rbasgAgeSexGroupFilter.appendChild(oe);
  });
}

function displayRbfgAdditionalFilters(tdsData) {
  el.rbfgRangeFilter.innerHTML = "";
  el.rbfgAgeSexGroupFilter.innerHTML = "";
  ["Percentages", "Numbers"].forEach((year) => {
    const oe = document.createElement("option");
    oe.value = year;
    oe.text = year;
    el.rbfgRangeFilter.appendChild(oe);
  });
  tdsData.sets.ageSexGroups.forEach((asg) => {
    const oe = document.createElement("option");
    oe.value = asg;
    oe.text = asg;
    oe.selected = true;
    el.rbfgAgeSexGroupFilter.appendChild(oe);
  });
}

function displayRbfAdditionalFilters(tdsData) {
  el.rbfAgeSexGroupFilter.innerHTML = "";
  tdsData.sets.ageSexGroups.forEach((asg) => {
    const oe = document.createElement("option");
    oe.value = asg;
    oe.text = asg;
    el.rbfAgeSexGroupFilter.appendChild(oe);
  });
}

export function filterTdsDataAndUpdateGraph(tdsData) {
  const selectedYears = Array.from(el.yearFilter.selectedOptions).map(
    (option) => option.value,
  );

  const filteredTdsData = {
    ...tdsData,
    contaminentOccurenceData: {},
  };

  Object.keys(
    tdsData.contaminentOccurenceData[el.chemicalGroupFilter.value][
      el.chemicalFilter.value
    ],
  ).forEach((year) => {
    if (selectedYears.includes(year)) {
      filteredTdsData.contaminentOccurenceData[year] =
        tdsData.contaminentOccurenceData[el.chemicalGroupFilter.value][
          el.chemicalFilter.value
        ][year];
    }
  });

  updateLodFilterDescription(filteredTdsData);

  displayGraph(filteredTdsData);
}

async function updateLodFilterDescription(filteredTdsData) {
  el.lodFilterDescription.innerHTML = "";
  let maxContaminentLod = 0;
  let minContaminentLod = Infinity;
  let unitsOfMeasurement = null;
  Object.values(filteredTdsData.contaminentOccurenceData).forEach((value) => {
    value.forEach((row) => {
      const currLod = row.lod;
      unitsOfMeasurement = row.unitsOfMeasurement;
      if (currLod > maxContaminentLod) {
        maxContaminentLod = currLod;
      }
      if (currLod < minContaminentLod) {
        minContaminentLod = currLod;
      }
    });
  });
  if (minContaminentLod != Infinity) {
    el.lodFilterDescription.innerHTML =
      (await getTranslation("lod-filter-description")) +
      " " +
      minContaminentLod +
      " - " +
      maxContaminentLod +
      " " +
      unitsOfMeasurement;
  }
}
