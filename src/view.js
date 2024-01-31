import { headerIds, graphIds, inputContainerIds, inputIds } from "./const.js";
import {
  filterContaminentOccurenceData,
  filterFoodConsumptionData,
  getAvailableFilters,
  getCurrentAppliedFilters,
} from "./data.js";

/*
/*
 * Event Listeners
 */

export function addEventListenersToButtons() {
  document
    .getElementById(headerIds.howToUseButtonId)
    .addEventListener("click", () => {
      const howToUseTextElement = document.getElementById(
        headerIds.howToUseTextId,
      );
      howToUseTextElement.style.display =
        howToUseTextElement.style.display == "none" ? "" : "none";
    });
}

export function addEventListenersToInputs(
  foodCompositeData,
  foodConsumptionData,
  contaminentOccurenceData,
) {
  // Update inputs with available filters when a user changes the chemical group input.
  document
    .getElementById(inputIds.chemicalGroupInputId)
    .addEventListener("change", () => {
      updateInputsWithAvailableFilters(
        foodConsumptionData,
        contaminentOccurenceData,
        false,
      );
    });

  for (const inputId of Object.values(inputIds)) {
    // Update graphs whenever a user changes an input.
    document.getElementById(inputId).addEventListener("change", () => {
      updateGraphs(
        foodCompositeData,
        foodConsumptionData,
        contaminentOccurenceData,
      );
    });
  }
}

export function addEventListenersToGraphSelects(
  foodCompositeData,
  foodConsumptionData,
  contaminentOccurenceData,
) {
  [
    graphIds.resultsByAgeSexGroupGraphSelectId,
    graphIds.resultsByFoodGroupGraphSelectId,
    graphIds.resultsByFoodGraphSelectId,
  ].forEach((graphId) => {
    document.getElementById(graphId).addEventListener("click", (e) => {
      e.preventDefault;
      const graphTitleElement = document.getElementById(graphIds.graphTitleId);
      graphTitleElement.innerHTML = "";
      const graphElement = document.getElementById(graphIds.graphId);
      graphElement.innerHTML = "";
      [
        graphIds.resultsByAgeSexGroupGraphSelectId,
        graphIds.resultsByFoodGroupGraphSelectId,
        graphIds.resultsByFoodGraphSelectId,
      ].forEach((graphId) => {
        document.getElementById(graphId).classList.remove("active-graph");
      });
      [
        inputContainerIds.ageSexGroupInputContainerId,
        inputContainerIds.dataFormatInputContainerId,
        inputContainerIds.unitsInputContainerId,
        inputContainerIds.categoryFormatInputContainerId,
      ].forEach((graphId) => {
        document.getElementById(graphId).style.display = "none";
      });
      document.getElementById(graphId).classList.add("active-graph");
      updateGraphs(
        foodCompositeData,
        foodConsumptionData,
        contaminentOccurenceData,
      );
    });
  });
}

/*
 * Inputs
 */

function populateInput(inputId, options) {
  const input = document.getElementById(inputId);
  input.innerHTML = "";

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.text = option;
    input.appendChild(optionElement);
  });
}

export function updateInputsWithAvailableFilters(
  foodConsumptionData,
  contaminentOccurenceData,
  isInitialization = false, // Filters for certain inputs should only be fetched and updated once (at initialization).
) {
  const chemicalGroup = document.getElementById(
    inputIds.chemicalGroupInputId,
  ).value;

  const availableFilters = getAvailableFilters(
    foodConsumptionData,
    contaminentOccurenceData,
    chemicalGroup,
  );

  if (isInitialization) {
    populateInput(
      inputIds.chemicalGroupInputId,
      availableFilters.chemicalGroups,
    );
    populateInput(inputIds.lodInputId, availableFilters.lods);
    populateInput(inputIds.ageSexGroupInputId, availableFilters.ageSexGroups);
    populateInput(inputIds.dataFormatInputId, availableFilters.dataFormat);
    populateInput(inputIds.unitsInputId, availableFilters.units);
    populateInput(
      inputIds.categoryFormatInputId,
      availableFilters.categoryFormat,
    );
  }
  populateInput(inputIds.chemicalInputId, availableFilters.chemicalNames);
  populateInput(inputIds.yearInputId, availableFilters.years);
}

/*
 * Graphs
 */

function updateGraphs(
  foodCompositeData,
  foodConsumptionData,
  contaminentOccurenceData,
) {
  const currentFilters = getCurrentAppliedFilters();
  const filteredFoodConsumptionData = filterFoodConsumptionData(
    currentFilters,
    foodConsumptionData,
  );
  const filteredContaminentOccurenceData = filterContaminentOccurenceData(
    currentFilters,
    contaminentOccurenceData,
  );

  const activeGraph = document.querySelector(".active-graph")
    ? document.querySelector(".active-graph").id
    : "";

  if (activeGraph == graphIds.resultsByAgeSexGroupGraphSelectId) {
    [
      inputContainerIds.unitsInputContainerId,
      inputContainerIds.ageSexGroupInputContainerId,
      inputContainerIds.categoryFormatInputContainerId,
    ].forEach(
      (inputContainerId) =>
        (document.getElementById(inputContainerId).style.display = ""),
    );

    displayDietaryExposureByAgeSexGroupGraph();
  } else if (activeGraph == graphIds.resultsByFoodGroupGraphSelectId) {
    [
      inputContainerIds.dataFormatInputContainerId,
      inputContainerIds.ageSexGroupInputContainerId,
    ].forEach(
      (inputContainerId) =>
        (document.getElementById(inputContainerId).style.display = ""),
    );

    displayDietaryExposureByFoodGroupGraph();
  } else if (activeGraph == graphIds.resultsByFoodGraphSelectId) {
    [inputContainerIds.ageSexGroupInputContainerId].forEach(
      (inputContainerId) =>
        (document.getElementById(inputContainerId).style.display = ""),
    );

    displayDietaryExposureByFoodGraph(
      currentFilters.chemicalName,
      currentFilters.ageSexGroup,
      currentFilters.years,
      foodCompositeData,
      filteredFoodConsumptionData,
      filteredContaminentOccurenceData,
    );
  }
}

export function displayDietaryExposureByAgeSexGroupGraph() {
  const graphHeaderElement = document.getElementById(graphIds.graphTitleId);
  graphHeaderElement.innerHTML = `Dietary exposure estimate by age sex group`;

  const graphElement = document.getElementById(graphIds.graphId);
  graphElement.innerHTML = "";
}

export function displayDietaryExposureByFoodGroupGraph() {
  const graphHeaderElement = document.getElementById(graphIds.graphTitleId);
  graphHeaderElement.innerHTML = `Dietary exposure estimate by food group`;

  const graphElement = document.getElementById(graphIds.graphId);
  graphElement.innerHTML = "";
}

export function displayDietaryExposureByFoodGraph(
  chemicalName,
  ageSexGroup,
  years,
  foodCompositeData,
  foodConsumptionData,
  contaminentOccurenceData,
) {
  let sumOfDietaryExposures = 0;
  const uniqueFoodCompositeGroupings = new Set();

  let dietaryExposureByFoodData = foodCompositeData.map((foodComposite) => {
    uniqueFoodCompositeGroupings.add(foodComposite.compositeGrouping);

    let numberOfContaminentOccurencesForCompositeCode = 0;
    let sumOfContaminentOccurenceResultsForCompositeCode = 0;

    contaminentOccurenceData.forEach((contaminentOccurence) => {
      if (
        contaminentOccurence.sampleCode.includes(foodComposite.compositeCode) ||
        contaminentOccurence.productDescription.includes(
          foodComposite.compositeCode,
        )
      ) {
        numberOfContaminentOccurencesForCompositeCode += 1;
        sumOfContaminentOccurenceResultsForCompositeCode +=
          contaminentOccurence.resultValue;
      }
    });

    const resultValueMean =
      sumOfContaminentOccurenceResultsForCompositeCode /
      numberOfContaminentOccurencesForCompositeCode || 0;

    const meanConsumptionOfComposite =
      foodConsumptionData.find(
        (row) => row.foodCompositeCode == foodComposite.compositeCode,
      )?.meanGramsPerPersonPerDay || 0;

    // ng/g x g/day = ng/day dietary exposure for this food composite
    const dietaryExposure = meanConsumptionOfComposite * resultValueMean;

    sumOfDietaryExposures += dietaryExposure;

    return {
      ...foodComposite,
      resultValueMean: resultValueMean,
      dietaryExposure: dietaryExposure,
    };
  });

  dietaryExposureByFoodData = dietaryExposureByFoodData.map((entry) => {
    return {
      ...entry,
      // (ng/day for a specific food composite divided by the total dietary exposure) x 100%
      percentDietaryExposure:
        (entry.dietaryExposure / sumOfDietaryExposures) * 100 || 0,
    };
  });

  const sunburstFormattedDietaryExposureByFoodData = {
    children: dietaryExposureByFoodData,
  };

  // Display sunburst

  const color = d3.scaleOrdinal(
    d3.quantize(
      d3.interpolateRainbow,
      Array.from(uniqueFoodCompositeGroupings).length + 1,
    ),
  );
  const radius = 928 / 2;

  const partition = (data) =>
    d3.partition().size([2 * Math.PI, radius])(
      d3
        .hierarchy(data)
        .sum((d) => d.percentDietaryExposure)
        .sort(
          (a, b) =>
            b.data.percentDietaryExposure - a.data.percentDietaryExposure,
        ),
    );

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - 1);

  const root = partition(sunburstFormattedDietaryExposureByFoodData);

  const svg = d3.create("svg");

  const format = d3.format("d");

  svg
    .append("g")
    .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(root.descendants().filter((d) => d.depth))
    .join("path")
    .attr("fill", (d) => color(d.data.compositeGrouping))
    .attr("d", arc)
    .append("title")
    .text(
      (d) =>
        `${d
          .ancestors()
          .filter((d) => d.depth > 0)
          .map((d) => {
            return d.data.compositeLabel + " - " + d.data.compositeCode;
          })
          .reverse()
          .join("")} \nDE: ${d.data.dietaryExposure.toFixed(
            1,
          )} ng/day\nPDE: ${d.data.percentDietaryExposure.toFixed(1)}%`,
    );

  svg
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(
      root
        .descendants()
        .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10),
    )
    .join("text")
    .attr("transform", function(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    })
    .attr("dy", "0.35em")
    .text((d) => d.data.compositeLabel + " - " + d.data.compositeCode);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-size", "1.8rem")
    .text(chemicalName);

  const graphHeaderElement = document.getElementById(graphIds.graphTitleId);
  graphHeaderElement.innerHTML = `Dietary exposure estimate by food for ${chemicalName} for ${ageSexGroup} (${years.join(
    ", ",
  )})`;

  const graphElement = document.getElementById(graphIds.graphId);
  graphElement.innerHTML = "";

  if (svg._groups[0][0].children[1].childElementCount) {
    graphElement.append(
      svg
        .attr("viewBox", function autoBox() {
          document.body.appendChild(this);
          const { x, y, width, height } = this.getBBox();
          document.body.removeChild(this);
          return [x, y, width, height];
        })
        .node(),
    );
  } else {
    graphElement.innerHTML = "No data available";
  }
}
