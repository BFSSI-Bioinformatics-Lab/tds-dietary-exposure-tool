import { el } from "./const.js";
import { resultValueToNanoGramsPerGram } from "./helper.js";
import { getTranslation } from "./translation.js";

export function displayGraph(tdsData) {
  const id = document.querySelector(".active-graph-select")?.id.split("-")[0];
  if (!id) return;

  const graphContainerElement = el[id + "GraphContainer"];

  if (!graphContainerElement.classList.contains("active-graph-container")) {
    graphContainerElement.classList.add("active-graph-container");
  }

  console.log(tdsData);

  const color = d3.scaleOrdinal(
    d3.quantize(
      d3.interpolateRainbow,
      Array.from(Object.keys(tdsData.consumptionData)).length + 1,
    ),
  );
  Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
    color(foodGroup);
  });

  if (id == "rbasg") {
    displayAbsg(tdsData);
  } else if (id == "rbfg" || id == "rbf") {
    displayColorLegend(tdsData, id, color);
    if (id == "rbfg") {
      displayRbfg(tdsData, color);
    } else if (id == "rbf") {
      displayRbf(tdsData, color);
    }
  }
}

async function displayAbsg(tdsData) {
  el.rbasgGraphTitle.innerHTML = await getTranslation("rbasg-graph-title");
  el.rbasgGraph.innerHTML = "Graph in development";
}

async function displayRbfg(tdsData, color) {
  const years = Object.keys(tdsData.contaminentOccurenceData);
  const lod = el.lodFilter.value;
  const ageSexGroups = Array.from(el.rbfgAgeSexGroupFilter.selectedOptions).map(
    (option) => option.value,
  );
  const isPercent = el.rbfgRangeFilter.value == "Percentages";

  el.rbfgGraphTitle.innerHTML = `${await getTranslation("rbfg-graph-title")} ${
    el.chemicalFilter.value
  } (${years.join(", ")})`;

  const rbfgData = {};
  ageSexGroups.forEach((ageSexGroup) => (rbfgData[ageSexGroup] = {}));

  Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
    ageSexGroups.forEach(
      (ageSexGroup) => (rbfgData[ageSexGroup][foodGroup] = 0),
    );
    Object.keys(tdsData.consumptionData[foodGroup]).forEach((foodComposite) => {
      const consumptionRows = tdsData.consumptionData[foodGroup][
        foodComposite
      ].filter((row) => ageSexGroups.includes(row.ageSexGroup));
      if (consumptionRows.length == 0) return;

      consumptionRows.forEach((consumptionRow) => {
        let numContaminentRows = 0;
        let sumOfContaminentRows = 0;

        years.forEach((year) => {
          tdsData.contaminentOccurenceData[year].forEach((contaminentRow) => {
            if (
              contaminentRow.sampleCode.includes(foodComposite) ||
              contaminentRow.productDescription.includes(foodComposite)
            ) {
              let resultValue = contaminentRow.resultValue;

              if (contaminentRow.resultValue == 0) {
                if (lod == "Exclude") {
                  return;
                } else if (lod == 0) {
                  resultValue = 0;
                } else if (lod == "1/2 LOD") {
                  resultValue = contaminentRow.lod / 2;
                } else if (lod == "LOD") {
                  resultValue = contaminentRow.lod;
                }
              }
              numContaminentRows++;
              sumOfContaminentRows += resultValueToNanoGramsPerGram(
                resultValue,
                contaminentRow.unitsOfMeasurement,
              );
            }
          });
        });
        const occurence = sumOfContaminentRows / numContaminentRows || 0;
        const dietaryExposure =
          consumptionRow.meanGramsPerPersonPerDay * occurence;

        rbfgData[consumptionRow.ageSexGroup][foodGroup] += dietaryExposure;
      });
    });
  });

  const stackedBarData = {
    entries: [],
    rangeTitle: isPercent ? "% of Total Exposure" : "Dietary Exposure (ng/g)",
    domainTitle: "Age-Sex Groups",
  };

  Object.keys(rbfgData).forEach((ageSexGroup) => {
    const sum = Object.values(rbfgData[ageSexGroup]).reduce((a, b) => a + b, 0);
    Object.keys(rbfgData[ageSexGroup]).forEach((foodGroup) => {
      const [age, sexGroup] = ageSexGroup.split(" ");
      const contribution = isPercent
        ? (rbfgData[ageSexGroup][foodGroup] / sum) * 100
        : rbfgData[ageSexGroup][foodGroup];
      const contributionInfo = isPercent
        ? contribution.toFixed(2) + "%"
        : contribution.toFixed(4) + " ng/g";
      stackedBarData.entries.push({
        entry: age + sexGroup[0],
        stack: foodGroup,
        contribution,
        info: foodGroup + "\n" + contributionInfo + "\n" + ageSexGroup,
      });
    });
  });

  el.rbfgGraph.innerHTML = "";
  el.rbfgGraph.append(getStackedBar(stackedBarData, color));
}

async function displayRbf(tdsData, color) {
  const chemicalName = el.chemicalFilter.value;
  const ageSexGroup = el.rbfAgeSexGroupFilter.value;
  const lod = el.lodFilter.value;
  const years = Object.keys(tdsData.contaminentOccurenceData);

  el.rbfGraphTitle.innerHTML = `${await getTranslation(
    "rbf-graph-title",
  )} ${chemicalName}, ${ageSexGroup}, (${years.join(", ")})`;
  el.rbfGraph.innerHTML = await getTranslation("no-data-available");

  const rbfData = {};

  let sumOfDietaryExposures = 0;
  Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
    Object.keys(tdsData.consumptionData[foodGroup]).forEach((foodComposite) => {
      const consumptionRow = tdsData.consumptionData[foodGroup][
        foodComposite
      ].find((row) => row.ageSexGroup == ageSexGroup);
      if (!consumptionRow) return;

      rbfData[foodComposite] = {
        foodGroup,
        foodComposite,
        foodCompositeDescription: consumptionRow.foodCompositeDescription,
      };

      let numContaminentRows = 0;
      let sumOfContaminentRows = 0;

      years.forEach((year) => {
        tdsData.contaminentOccurenceData[year].forEach((contaminentRow) => {
          if (
            contaminentRow.sampleCode.includes(foodComposite) ||
            contaminentRow.productDescription.includes(foodComposite)
          ) {
            rbfData[foodComposite].unitsOfMeasurement =
              contaminentRow.unitsOfMeasurement;

            let resultValue = contaminentRow.resultValue;

            if (contaminentRow.resultValue == 0) {
              if (lod == "Exclude") {
                return;
              } else if (lod == 0) {
                resultValue = 0;
              } else if (lod == "1/2 LOD") {
                resultValue = contaminentRow.lod / 2;
              } else if (lod == "LOD") {
                resultValue = contaminentRow.lod;
              }
            }
            numContaminentRows++;
            sumOfContaminentRows += resultValue;
          }
        });
      });
      const occurence =
        resultValueToNanoGramsPerGram(
          sumOfContaminentRows,
          rbfData[foodComposite].unitsOfMeasurement,
        ) / numContaminentRows || 0;
      const dietaryExposure =
        consumptionRow.meanGramsPerPersonPerDay * occurence;
      sumOfDietaryExposures += dietaryExposure;

      rbfData[foodComposite].occurence = occurence;
      rbfData[foodComposite].dietaryExposure = dietaryExposure;
      rbfData[foodComposite].consumption =
        consumptionRow.meanGramsPerPersonPerDay;
    });
  });

  const sunburstData = { children: [] };

  sunburstData.title = chemicalName;
  Object.values(rbfData).forEach((row) => {
    row.percentDietaryExposure =
      (row.dietaryExposure / sumOfDietaryExposures) * 100;

    sunburstData.children.push({
      color: color(row.foodGroup),
      value: row.percentDietaryExposure,
      title: row.foodCompositeDescription + " - " + row.foodComposite,
      info:
        row.foodCompositeDescription +
        " - " +
        row.foodComposite +
        "\n" +
        "DE: " +
        row.dietaryExposure.toFixed(1) +
        " ng/day" +
        "\n" +
        "PDE: " +
        row.percentDietaryExposure.toFixed(1) +
        "%" +
        "\n" +
        "Occurence: " +
        row.occurence.toFixed(1) +
        " ng/g" +
        "\n" +
        "Consumption: " +
        row.consumption.toFixed(1) +
        " g/person/day",
    });
  });

  el.rbfGraph.innerHTML = "";
  el.rbfGraph.append(await getSunburst(sunburstData));
}

/*
 *
 *
 *
 *
 *
 */

function displayColorLegend(tdsData, id, color) {
  el[id + "LegendContent"].innerHTML = "";
  Object.keys(tdsData.consumptionData).forEach((grouping) => {
    const legendItemElement = document.createElement("div");
    legendItemElement.classList.add("graph-legend-item");
    const legendItemColorElement = document.createElement("div");
    legendItemColorElement.classList.add("graph-legend-item-color");
    const legendItemTextElement = document.createElement("div");
    legendItemTextElement.classList.add("graph-legend-item-text");
    legendItemColorElement.style.backgroundColor = color(grouping);
    legendItemTextElement.innerHTML = grouping;
    legendItemElement.append(legendItemColorElement);
    legendItemElement.append(legendItemTextElement);
    el[id + "LegendContent"].appendChild(legendItemElement);
  });
}

async function getSunburst(data) {
  const radius = 928 / 2;

  const partition = (data) =>
    d3.partition().size([2 * Math.PI, radius])(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.data.value - a.data.value),
    );

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - 1);

  const root = partition(data);

  const svg = d3.create("svg");

  svg
    .append("g")
    .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(root.descendants().filter((d) => d.depth))
    .join("path")
    .attr("fill", (d) => d.data.color)
    .attr("d", arc)
    .append("title")
    .text(
      (d) =>
        `${d
          .ancestors()
          .filter((d) => d.depth > 0)
          .map((d) => d.data.info)}`,
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
    .attr("transform", function (d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y}, 0) rotate(${
        x < 180 ? 0 : 180
      })`;
    })
    .attr("dy", "0.35em")
    .attr("width", 100)
    .text((d) => {
      const maxLength = 30;
      const str = d.data.title;
      if (str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
      }
      return str;
    });

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-size", "1.8rem")
    .text(data.title);

  if (svg._groups[0][0].children[1].childElementCount) {
    return svg
      .attr("viewBox", function autoBox() {
        document.body.appendChild(this);
        const { x, y, width, height } = this.getBBox();
        document.body.removeChild(this);
        return [x, y, width, height];
      })
      .node();
  }
}

function getStackedBar(stackedBarData, color) {
  const width = 1300;
  const height = 800;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 50;
  const marginLeft = 60;

  const series = d3
    .stack()
    .keys(d3.union(stackedBarData.entries.map((d) => d.stack)))
    .value(([, D], key) => D.get(key).contribution)(
    d3.index(
      stackedBarData.entries,
      (d) => d.entry,
      (d) => d.stack,
    ),
  );

  const x = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        stackedBarData.entries,
        (D) => -d3.sum(D, (d) => d.contribution),
        (d) => d.entry,
      ),
    )
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
    .rangeRound([height - marginBottom, marginTop]);

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  svg
    .append("g")
    .selectAll()
    .data(series)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((D) => D.map((d) => ((d.key = D.key), d)))
    .join("rect")
    .attr("x", (d) => x(d.data[0]))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .append("title")
    .text(
      (d) =>
        stackedBarData.entries.filter(
          (entry) => entry.stack == d.key && entry.entry == d.data[0],
        )[0].info,
    );

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .style("font-size", "0.6rem")
    .call((g) => g.selectAll(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .style("font-size", "0.6rem")
    .call((g) => g.selectAll(".domain").remove());

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .attr("class", "graph-axis-title")
    .style("text-anchor", "middle")
    .text(stackedBarData.domainTitle);
  svg
    .append("text")
    .attr("x", 15)
    .attr("y", height / 2)
    .attr("class", "graph-axis-title")
    .attr("transform", `rotate(-90, 15, ${height / 2})`)
    .style("text-anchor", "middle")
    .text(stackedBarData.rangeTitle);

  return svg.node();
}
