import { GraphTypes, sexGroups } from "../const.js";
import { classs, el } from "./const.js";
import {
  formatRbasgToGroupedBar,
  formatRbsagToDataTable,
  getRbasg,
} from "../graph/rbasg.js";
import {
  formatRbfToDataTable,
  formatRbfToSunburst,
  getRbf,
} from "../graph/rbf.js";
import {
  formatRbfgToDataTable,
  formatRbfgToStackedBar,
  getRbfg,
} from "../graph/rbfg.js";
import { generateColorMapping } from "../util/graph.js";
import { displayColorLegend } from "./graph/colorLegend.js";
import { getGroupedBarSvg } from "./graph/groupedBar.js";
import { getStackedBarSvg } from "./graph/stackedBar.js";
import { getSunburstSvg } from "./graph/sunburst.js";
import {
  getActiveFilters,
  getSelectedGraphType,
  updateLodFilterDescription,
  updateSandbox,
} from "./filter.js";
import { displayDataTable } from "./dataTableComponent.js";
import { getTranslations } from "../translation/translation.js";
import { getAgeSexDisplay } from "../util/data.js";

/**
 *
 * Display a graph based on the selected type
 *
 * Parameters:
 * - data: The filtered TDS data for the graph
 *
 */
export function displayGraph(data) {
  const graphType = getSelectedGraphType();

  const filters = getActiveFilters();

  const foodGroupColorMapping = generateColorMapping(
    Object.keys(data.consumption).reduce((acc, foodGroup) => {
      acc[foodGroup] = { label: foodGroup, color: null };
      return acc;
    }, {}),
  );
  const sexGroupColorMapping = generateColorMapping(
    Object.keys(sexGroups).reduce((acc, sex) => {
      acc[sex] = {
        label: getTranslations().graphs.legend.sexGroups[sex],
        color: null,
      };
      return acc;
    }, {}),
  );

  const graphMapping = {
    [GraphTypes.RBASG]: {
      graphTitle: `${getTranslations().graphs[GraphTypes.RBASG].title}, ${
        filters.chemical
      }`,
      colorLegendMapping: sexGroupColorMapping,
      getDataFn: getRbasg,
      getGraphDataFn: formatRbasgToGroupedBar,
      getSvgFn: getGroupedBarSvg,
      getDataTableDataFn: formatRbsagToDataTable,
      legendTitle: getTranslations().graphs.legend.sexGroup,
      hasReferenceLine: true,
    },
    [GraphTypes.RBF]: {
      graphTitle: `${getTranslations().graphs[GraphTypes.RBF].title}, ${
        filters.chemical
      }, ${getAgeSexDisplay(filters.ageSexGroups[0])}`,
      colorLegendMapping: foodGroupColorMapping,
      getDataFn: getRbf,
      getGraphDataFn: formatRbfToSunburst,
      getSvgFn: getSunburstSvg,
      getDataTableDataFn: formatRbfToDataTable,
      legendTitle: getTranslations().graphs.legend.foodGroup,
      hasReferenceLine: false,
    },
    [GraphTypes.RBFG]: {
      graphTitle: `${getTranslations().graphs[GraphTypes.RBFG].title}, ${
        filters.chemical
      }, ${getAgeSexDisplay(filters.ageSexGroups[0])}`,
      colorLegendMapping: foodGroupColorMapping,
      getDataFn: getRbfg,
      getGraphDataFn: formatRbfgToStackedBar,
      getSvgFn: getStackedBarSvg,
      getDataTableDataFn: formatRbfgToDataTable,
      legendTitle: getTranslations().graphs.legend.foodGroup,
      hasReferenceLine: !filters.usePercent,
    },
  };

  const [
    graphTitle,
    colorLegendMapping,
    getDataFn,
    getGraphDataFn,
    getSvgFn,
    getDataTableDataFn,
    legendTitle,
    hasReferenceLine,
  ] = Object.values(graphMapping[graphType]);

  updateLodFilterDescription(data, filters);
  updateSandbox(data, filters);

  const specificData = getDataFn(data, filters);
  const graphData = getGraphDataFn(specificData, filters, colorLegendMapping);
  if (filters.referenceLine && hasReferenceLine) {
    graphData.hr = filters.referenceLine;
  }
  const graphSvg = getSvgFn(graphData);

  el.graphs.container.classList.remove(classs.HIDDEN);

  el.graphs.title.innerHTML = graphTitle;
  el.graphs.graph.innerHTML = "";
  el.graphs.graph.append(graphSvg || getTranslations().misc.noDataMsg);

  displayColorLegend(colorLegendMapping, legendTitle);

  el.graphs.saveGraph.classList.remove(classs.HIDDEN);
  el.dataTable.dataContainer.classList.remove(classs.HIDDEN);
  const dataTableData = getDataTableDataFn(specificData, filters);
  displayDataTable(dataTableData, filters);

  el.about.container.classList.remove(classs.HIDDEN);
}

/**
 *
 * Capturing and downloading the currently displayed graph
 *
 */
export function downloadGraph() {
  const footer = document.createElement("div");
  footer.innerText = getTranslations().graphs.saveGraph.footer;
  el.graphs.saveGraphContainer.appendChild(footer);

  html2canvas(el.graphs.saveGraphContainer, { logging: false }).then(
    function (canvas) {
      var link = document.createElement("a");
      link.download = getTranslations().graphs.saveGraph.filename;
      link.href = canvas.toDataURL();
      link.click();
    },
  );

  el.graphs.saveGraphContainer.removeChild(footer);
}
