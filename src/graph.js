import { el } from "./const.js";
import { getTranslation } from "./translation.js";

export function displayGraph(tdsData) {
  const id = document.querySelector(".active-graph-select")?.id.split("-")[0];
  if (!id) return;

  const graphContainerElement = el[id + "GraphContainer"];

  if (!graphContainerElement.classList.contains("active-graph-container")) {
    graphContainerElement.classList.add("active-graph-container");
  }

  const foodGroupColor = d3.scaleOrdinal(
    d3.quantize(
      d3.interpolateRainbow,
      Array.from(Object.keys(tdsData.consumptionData)).length + 1,
    ),
  );
  const sexGroupColor = d3.scaleOrdinal(
    d3.quantize(
      d3.interpolateRainbow,
      Array.from(tdsData.sets.sexGroups).length + 1,
    ),
  );

  Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
    foodGroupColor(foodGroup);
  });
  tdsData.sets.sexGroups.forEach((sex) => {
    sexGroupColor(sex);
  });

  const sel = {
    chemicalName: el.chemicalFilter.value,
    years: Object.keys(tdsData.contaminentOccurenceData),
    lod: el.lodFilter.value,
    availableLods: getTranslation("lod-filter-options"),
    ageSexGroups: Array.from(el[id + "AgeSexGroupFilter"].selectedOptions).map(
      (option) => option.value,
    ),
    showByAgeSexGroup:
      el.rbasgDomainFilter.value ==
      getTranslation("rbasg-domain-filter-options")[0],
    usePercent: el.rbfgRangeFilter.value == "Percentages",
    usePerPersonPerDay:
      el.consumptionUnitsFilter.value ==
      getTranslation("consumption-units-filter-options")[0],
    sortByFood:
      el.rbfSortByFilter.value ==
      getTranslation("rbf-sort-by-filter-options")[0],
  };

  let graph = null;
  if (id == "rbasg") {
    displayAsgColorLegend(tdsData, sexGroupColor);
    graph = getAbsg(tdsData, sel, sexGroupColor);
  } else if (id == "rbfg") {
    displayFoodGroupColorLegend(tdsData, id, foodGroupColor);
    graph = getRbfg(tdsData, sel, foodGroupColor);
  } else if (id == "rbf") {
    displayFoodGroupColorLegend(tdsData, id, foodGroupColor);
    graph = getRbf(tdsData, sel, foodGroupColor);
  }
  el[id + "Graph"].innerHTML = "";
  el[id + "Graph"].append(graph || getTranslation("no-data-available"));
}

function getAbsg(tdsData, sel, color) {
  el.rbasgGraphTitle.innerHTML = `${getTranslation("rbasg-graph-title")} ${
    el.chemicalFilter.value
  } \(${sel.years.join(", ")}\)`;

  const rbasgData = {};

  if (sel.showByAgeSexGroup) {
    sel.ageSexGroups.forEach((age) => {
      rbasgData[age] = {};
      tdsData.sets.sexGroups.forEach((sex) => {
        rbasgData[age][sex] = { value: 0 };
        let numOfContaminentRowsForAgeSex = 0;
        let sumOfContaminentRowsResultsForAgeSex = 0;
        Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
          Object.keys(tdsData.consumptionData[foodGroup]).forEach(
            (foodComposite) => {
              const consumptionRows = tdsData.consumptionData[foodGroup][
                foodComposite
              ]
                .filter((row) => sel.ageSexGroups.includes(row.age))
                .filter((row) => age == row.age && sex == row.sex);
              if (consumptionRows.length == 0) return;

              consumptionRows.forEach((consumptionRow) => {
                let numContaminentRowsForFoodComposite = 0;
                let sumOfContaminentRowsResultsForFoodComposite = 0;

                sel.years.forEach((year) => {
                  tdsData.contaminentOccurenceData[year].forEach(
                    (contaminentRow) => {
                      if (
                        contaminentRow.sampleCode.includes(foodComposite) ||
                        contaminentRow.productDescription.includes(
                          foodComposite,
                        )
                      ) {
                        let result = contaminentRow.resultValue;

                        if (contaminentRow.resultValue == 0) {
                          if (sel.lod == sel.availableLods.exclude) {
                            return;
                          } else if (sel.lod == 0) {
                            result = 0;
                          } else if (sel.lod == sel.availableLods.half) {
                            result = contaminentRow.lod / 2;
                          } else if (sel.lod == sel.availableLods.full) {
                            result = contaminentRow.lod;
                          }
                        }
                        numContaminentRowsForFoodComposite++;
                        sumOfContaminentRowsResultsForFoodComposite += result;
                      }
                    },
                  );
                });
                const meanContaminentOccurence =
                  sumOfContaminentRowsResultsForFoodComposite /
                    numContaminentRowsForFoodComposite || 0;
                const dietaryExposureToContaminent =
                  (sel.usePerPersonPerDay
                    ? consumptionRow.meanGramsPerPersonPerDay
                    : consumptionRow.meanGramsPerKgBWPerDay) *
                  meanContaminentOccurence;

                numOfContaminentRowsForAgeSex += 1;
                sumOfContaminentRowsResultsForAgeSex +=
                  dietaryExposureToContaminent;
              });
            },
          );
        });
        rbasgData[age][sex].value =
          sumOfContaminentRowsResultsForAgeSex /
            numOfContaminentRowsForAgeSex || 0;
      });
    });
  } else {
    sel.years.forEach((year) => {
      rbasgData[year] = {};
      tdsData.sets.sexGroups.forEach((sex) => {
        rbasgData[year][sex] = { value: 0 };
        let numDietaryExposuresForYear = 0;
        let sumOfDietaryExposuresForYear = 0;
        Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
          Object.keys(tdsData.consumptionData[foodGroup]).forEach(
            (foodComposite) => {
              const consumptionRows = tdsData.consumptionData[foodGroup][
                foodComposite
              ].filter(
                (row) => sel.ageSexGroups.includes(row.age) && sex == row.sex,
              );
              if (consumptionRows.length == 0) return;

              consumptionRows.forEach((consumptionRow) => {
                let numContaminentRowsForFoodComposite = 0;
                let sumOfContaminentRowsResultsForFoodComposite = 0;
                tdsData.contaminentOccurenceData[year].forEach(
                  (contaminentRow) => {
                    if (
                      contaminentRow.sampleCode.includes(foodComposite) ||
                      contaminentRow.productDescription.includes(foodComposite)
                    ) {
                      let result = contaminentRow.resultValue;

                      if (contaminentRow.resultValue == 0) {
                        if (sel.lod == sel.availableLods.exclude) {
                          return;
                        } else if (sel.lod == 0) {
                          result = 0;
                        } else if (sel.lod == sel.availableLods.half) {
                          result = contaminentRow.lod / 2;
                        } else if (sel.lod == sel.availableLods.full) {
                          result = contaminentRow.lod;
                        }
                      }
                      numContaminentRowsForFoodComposite++;
                      sumOfContaminentRowsResultsForFoodComposite += result;
                    }
                  },
                );
                const meanContaminentOccurence =
                  sumOfContaminentRowsResultsForFoodComposite /
                    numContaminentRowsForFoodComposite || 0;
                const dietaryExposureToContaminent =
                  (sel.usePerPersonPerDay
                    ? consumptionRow.meanGramsPerPersonPerDay
                    : consumptionRow.meanGramsPerKgBWPerDay) *
                  meanContaminentOccurence;

                numDietaryExposuresForYear += 1;
                sumOfDietaryExposuresForYear += dietaryExposureToContaminent;
              });
            },
          );
        });
        rbasgData[year][sex].value =
          sumOfDietaryExposuresForYear / numDietaryExposuresForYear || 0;
      });
    });
  }

  const unitsOfMeasurement = Object.values(
    tdsData.contaminentOccurenceData,
  )[0][0].unitsOfMeasurement;

  const consumptionUnits =
    getTranslation("consumption-units")[
      sel.usePerPersonPerDay ? "perPersonPerDay" : "perKgBodyweightPerDay"
    ];

  const groupedBarData = {
    entries: [],
    rangeTitle: `${getTranslation("rbasg-graph-text").range} (${
      unitsOfMeasurement.split("/")[0]
    }${consumptionUnits})`,
    domainTitle: sel.showByAgeSexGroup
      ? getTranslation("rbasg-graph-text").domain.byAgeGroup
      : getTranslation("rbasg-graph-text").domain.byYear,
  };

  const infoText = getTranslation("rbasg-graph-text").infoText;

  Object.keys(rbasgData).forEach((entry) => {
    Object.keys(rbasgData[entry]).forEach((sex) => {
      const row = rbasgData[entry][sex];
      groupedBarData.entries.push({
        entry: entry,
        group: sex,
        value: row.value,
        color: color(sex),
        info: `${infoText.dietaryExposure}: ${row.value.toFixed(1)} ${
          unitsOfMeasurement.split("/")[0]
        }${consumptionUnits})
${sel.showByAgeSexGroup ? infoText.ageGroup : infoText.year}: ${
          sel.showByAgeSexGroup ? `${entry} ${sex}` : entry
        }`,
      });
    });
  });

  return getGroupedBar(groupedBarData);
}

function getRbfg(tdsData, sel, color) {
  el.rbfgGraphTitle.innerHTML = `${getTranslation("rbfg-graph-title")} ${
    el.chemicalFilter.value
  } \(${sel.years.join(", ")}\)`;

  const rbfgData = {};
  sel.ageSexGroups.forEach((ageSexGroup) => (rbfgData[ageSexGroup] = {}));

  Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
    sel.ageSexGroups.forEach(
      (ageSexGroup) => (rbfgData[ageSexGroup][foodGroup] = 0),
    );

    Object.keys(tdsData.consumptionData[foodGroup]).forEach((foodComposite) => {
      const consumptionRows = tdsData.consumptionData[foodGroup][
        foodComposite
      ].filter((row) => sel.ageSexGroups.includes(row.ageSexGroup));
      if (consumptionRows.length == 0) return;

      consumptionRows.forEach((consumptionRow) => {
        let numContaminentRowsForFoodComposite = 0;
        let sumOfContaminentRowsResultsForFoodComposite = 0;

        sel.years.forEach((year) => {
          tdsData.contaminentOccurenceData[year].forEach((contaminentRow) => {
            if (
              contaminentRow.sampleCode.includes(foodComposite) ||
              contaminentRow.productDescription.includes(foodComposite)
            ) {
              let result = contaminentRow.resultValue;

              if (contaminentRow.resultValue == 0) {
                if (sel.lod == sel.availableLods.exclude) {
                  return;
                } else if (sel.lod == 0) {
                  result = 0;
                } else if (sel.lod == sel.availableLods.half) {
                  result = contaminentRow.lod / 2;
                } else if (sel.lod == sel.availableLods.full) {
                  result = contaminentRow.lod;
                }
              }
              numContaminentRowsForFoodComposite++;
              sumOfContaminentRowsResultsForFoodComposite += result;
            }
          });
        });
        const meanContaminentOccurence =
          sumOfContaminentRowsResultsForFoodComposite /
            numContaminentRowsForFoodComposite || 0;
        const dietaryExposureToContaminent =
          (sel.usePerPersonPerDay
            ? consumptionRow.meanGramsPerPersonPerDay
            : consumptionRow.meanGramsPerKgBWPerDay) * meanContaminentOccurence;

        rbfgData[consumptionRow.ageSexGroup][foodGroup] +=
          dietaryExposureToContaminent;
      });
    });
  });

  const unitsOfMeasurement = Object.values(
    tdsData.contaminentOccurenceData,
  )[0][0].unitsOfMeasurement;

  const consumptionUnits =
    getTranslation("consumption-units")[
      sel.usePerPersonPerDay ? "perPersonPerDay" : "perKgBodyweightPerDay"
    ];

  const stackedBarData = {
    entries: [],
    rangeTitle: sel.usePercent
      ? getTranslation("rbfg-graph-text").range.percent
      : `${getTranslation("rbfg-graph-text").range.absolute} (${
          unitsOfMeasurement.split("/")[0]
        }${consumptionUnits})`,
    domainTitle: getTranslation("rbfg-graph-text").domain,
  };

  Object.keys(rbfgData).forEach((ageSexGroup) => {
    const sum = Object.values(rbfgData[ageSexGroup]).reduce((a, b) => a + b, 0);
    Object.keys(rbfgData[ageSexGroup]).forEach((foodGroup) => {
      const [age, sexGroup] = ageSexGroup.split(" ");
      const dietaryExposureToContaminent =
        (sel.usePercent
          ? (rbfgData[ageSexGroup][foodGroup] / sum) * 100
          : rbfgData[ageSexGroup][foodGroup]) || 0;
      const contributionInfo = sel.usePercent
        ? `${dietaryExposureToContaminent.toFixed(2)}% `
        : `${dietaryExposureToContaminent.toFixed(2)} ${
            unitsOfMeasurement.split("/")[0] + consumptionUnits
          } `;
      stackedBarData.entries.push({
        entry: age + sexGroup[0],
        sortBy: sexGroup,
        stack: foodGroup,
        contribution: dietaryExposureToContaminent,
        info: `${foodGroup} (${ageSexGroup})
${
  sel.usePercent
    ? getTranslation("rbfg-graph-text").range.percent
    : getTranslation("rbfg-graph-text").range.absolute
}: ${contributionInfo} `,
      });
    });
  });

  return getStackedBar(stackedBarData, color);
}

function getRbf(tdsData, sel, color) {
  el.rbfGraphTitle.innerHTML = `${getTranslation("rbf-graph-title")} ${
    sel.chemicalName
  } \, ${sel.ageSexGroups} \, \(${sel.years.join(", ")} \)`;

  const dietaryExposureForFoodGroup = {};
  const rbfData = {};

  let sumOfDietaryExposuresToContaminents = 0;
  Object.keys(tdsData.consumptionData).forEach((foodGroup) => {
    dietaryExposureForFoodGroup[foodGroup] = 0;
    Object.keys(tdsData.consumptionData[foodGroup]).forEach((foodComposite) => {
      const consumptionRow = tdsData.consumptionData[foodGroup][
        foodComposite
      ].find((row) => sel.ageSexGroups.includes(row.ageSexGroup));
      if (!consumptionRow) return;

      rbfData[foodComposite] = {
        foodGroup,
        foodComposite,
        foodCompositeDescription: consumptionRow.foodCompositeDescription,
        unitsOfContaminentMeasurement: "",
      };

      let numContaminentRowsForFoodComposite = 0;
      let sumOfContaminentRowsResultsForFoodComposite = 0;

      sel.years.forEach((year) => {
        tdsData.contaminentOccurenceData[year].forEach((contaminentRow) => {
          if (
            contaminentRow.sampleCode.includes(foodComposite) ||
            contaminentRow.productDescription.includes(foodComposite)
          ) {
            rbfData[foodComposite].unitsOfContaminentMeasurement =
              contaminentRow.unitsOfMeasurement;

            let result = contaminentRow.resultValue;

            if (contaminentRow.resultValue == 0) {
              if (sel.lod == sel.availableLods.exclude) {
                return;
              } else if (sel.lod == 0) {
                result = 0;
              } else if (sel.lod == sel.availableLods.half) {
                result = contaminentRow.lod / 2;
              } else if (sel.lod == sel.availableLods.full) {
                result = contaminentRow.lod;
              }
            }
            numContaminentRowsForFoodComposite++;
            sumOfContaminentRowsResultsForFoodComposite += result;
          }
        });
      });
      const meanConsumptionOfFoodComposite = sel.usePerPersonPerDay
        ? consumptionRow.meanGramsPerPersonPerDay
        : consumptionRow.meanGramsPerKgBWPerDay;
      const meanContaminentOccurence =
        sumOfContaminentRowsResultsForFoodComposite /
          numContaminentRowsForFoodComposite || 0;
      const dietaryExposureToContaminent =
        meanConsumptionOfFoodComposite * meanContaminentOccurence;
      sumOfDietaryExposuresToContaminents += dietaryExposureToContaminent;

      rbfData[foodComposite] = {
        ...rbfData[foodComposite],
        meanContaminentOccurence,
        dietaryExposureToContaminent,
        meanConsumptionOfFoodComposite,
      };
      dietaryExposureForFoodGroup[foodGroup] += dietaryExposureToContaminent;
    });
  });

  const sunburstData = { title: sel.chemicalName, children: [] };

  const infoText = getTranslation("rbf-graph-text").infoText;

  Object.values(rbfData).forEach((row) => {
    row.percentDietaryExposureToContaminent =
      (row.dietaryExposureToContaminent / sumOfDietaryExposuresToContaminents) *
      100;

    sunburstData.children.push({
      color: color(row.foodGroup),
      value: row.percentDietaryExposureToContaminent,
      sortBy: sel.sortByFood
        ? row.percentDietaryExposureToContaminent
        : dietaryExposureForFoodGroup[row.foodGroup] +
          row.percentDietaryExposureToContaminent,
      title: row.foodCompositeDescription + " (" + row.foodComposite + ")",
      info: `${row.foodCompositeDescription} (${row.foodComposite})
${infoText.titles.dietaryExposure}: ${row.dietaryExposureToContaminent.toFixed(
        1,
      )} ${row.unitsOfContaminentMeasurement.split("/")[0]}${
        getTranslation("consumption-units")[
          sel.usePerPersonPerDay ? "perPersonPerDay" : "perKgBodyweightPerDay"
        ]
      }
${
  infoText.titles.percentDietaryExposure
}: ${row.percentDietaryExposureToContaminent.toFixed(1)}%
    ${
      infoText.titles.contaminentOccurence
    }: ${row.meanContaminentOccurence.toFixed(1)} ${
      row.unitsOfContaminentMeasurement
    }
${
  infoText.titles.foodConsumption
}: ${row.meanConsumptionOfFoodComposite.toFixed(1)} ${
        infoText.consumptionUnits[
          sel.usePerPersonPerDay ? "perPersonPerDay" : "perKgBodyweightPerDay"
        ]
      } `,
    });
  });

  return getSunburst(sunburstData);
}

/*
 *
 *
 *
 *
 *
 */

function displayAsgColorLegend(tdsData, color) {
  el.rbasgLegendContent.innerHTML = "";
  tdsData.sets.sexGroups.forEach((g) => {
    const legendItemElement = document.createElement("div");
    legendItemElement.classList.add("graph-legend-item");
    const legendItemColorElement = document.createElement("div");
    legendItemColorElement.classList.add("graph-legend-item-color");
    const legendItemTextElement = document.createElement("div");
    legendItemTextElement.classList.add("graph-legend-item-text");
    legendItemColorElement.style.backgroundColor = color(g);
    legendItemTextElement.innerHTML = g;
    legendItemElement.append(legendItemColorElement);
    legendItemElement.append(legendItemTextElement);
    el.rbasgLegendContent.appendChild(legendItemElement);
  });
}

function displayFoodGroupColorLegend(tdsData, id, color) {
  el[id + "LegendContent"].innerHTML = "";
  Object.keys(tdsData.consumptionData).forEach((g) => {
    const legendItemElement = document.createElement("div");
    legendItemElement.classList.add("graph-legend-item");
    const legendItemColorElement = document.createElement("div");
    legendItemColorElement.classList.add("graph-legend-item-color");
    const legendItemTextElement = document.createElement("div");
    legendItemTextElement.classList.add("graph-legend-item-text");
    legendItemColorElement.style.backgroundColor = color(g);
    legendItemTextElement.innerHTML = g;
    legendItemElement.append(legendItemColorElement);
    legendItemElement.append(legendItemTextElement);
    el[id + "LegendContent"].appendChild(legendItemElement);
  });
}

function getSunburst(data) {
  const radius = 928 / 2;

  const partition = (data) =>
    d3.partition().size([2 * Math.PI, radius])(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.data.sortBy - a.data.sortBy),
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
          .map((d) => d.data.info)} `,
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

  let dataExists = false;
  const series = d3
    .stack()
    .keys(
      d3.union(
        stackedBarData.entries.map((d) => {
          if (d.contribution) {
            dataExists = true;
          }
          return d.stack;
        }),
      ),
    )
    .value(([, D], key) => D.get(key).contribution)(
    d3.index(
      stackedBarData.entries,
      (d) => d.entry,
      (d) => d.stack,
    ),
  );

  if (!dataExists) {
    return;
  }

  const x = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        stackedBarData.entries,
        (D) => -d3.sum(D, (d) => 0),
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
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .style("font-size", "0.6rem")
    .call((g) => g.selectAll(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
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

function getGroupedBar(groupedBarData) {
  const width = 928;
  const height = 600;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 60;
  const marginLeft = 60;

  // Prepare the scales for positional and color encodings.
  // Fx encodes the state.
  const fx = d3
    .scaleBand()
    .domain(new Set(groupedBarData.entries.map((d) => d.entry)))
    .rangeRound([marginLeft, width - marginRight])
    .paddingInner(0.1);

  // Both x and color encode the age class.
  const ages = new Set(groupedBarData.entries.map((d) => d.group));

  const x = d3
    .scaleBand()
    .domain(ages)
    .rangeRound([0, fx.bandwidth()])
    .padding(0.05);

  // Y encodes the height of the bar.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(groupedBarData.entries, (d) => d.value)])
    .nice()
    .rangeRound([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Append a group for each state, and a rect for each age.
  svg
    .append("g")
    .selectAll()
    .data(d3.group(groupedBarData.entries, (d) => d.entry))
    .join("g")
    .attr("transform", ([entry]) => `translate(${fx(entry)}, 0)`)
    .selectAll()
    .data(([, d]) => d)
    .join("rect")
    .attr("x", (d) => x(d.group))
    .attr("y", (d) => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.value))
    .attr("fill", (d) => d.color)
    .append("title")
    .text((d) => d.info);

  // Append the horizontal axis.
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(fx).tickSizeOuter(0))
    .call((g) => g.selectAll(".domain").remove());

  // Append the vertical axis.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call((g) => g.selectAll(".domain").remove());

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - marginTop)
    .attr("class", "graph-axis-title")
    .style("text-anchor", "middle")
    .text(groupedBarData.domainTitle);
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", height / 2)
    .attr("class", "graph-axis-title")
    .attr("transform", `rotate(-90, 15, ${height / 2})`)
    .style("text-anchor", "middle")
    .text(groupedBarData.rangeTitle);

  return svg.node();
}
