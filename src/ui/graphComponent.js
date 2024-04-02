import { GraphTypes, sexGroups } from "../config.js";
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
import { generateColorMapping } from "../util/color.js";
import { displayColorLegend } from "./graph/colorLegend.js";
import { getGroupedBarSvg } from "./graph/groupedBar.js";
import { getStackedBarSvg } from "./graph/stackedBar.js";
import { getSunburstSvg } from "./graph/sunburst.js";
import {
  getActiveFilters,
  getSelectedGraphType,
  updateLodFilterDescription,
  updateSandbox,
} from "./filterComponent.js";
import { displayDataTable } from "./dataTableComponent.js";
import { getTranslations } from "../translation/translation.js";

/**
 * Display a graph based on the selected type
 *
 * Parameters:
 * - data: The TDS data for the graph
 */
export function displayGraph(data) {
  const graphType = getSelectedGraphType();

  const filters = getActiveFilters();

  const foodGroupColorMapping = generateColorMapping(
    Object.keys(data.consumption),
  );
  const sexGroupColorMapping = generateColorMapping(Object.keys(sexGroups));

  const graphMapping = {
    [GraphTypes.RBASG]: {
      graphTitle: `${getTranslations().graphs[GraphTypes.RBASG].title} ${
        filters.chemical
      }, (${filters.years.join(", ")})`,
      colorLegendData: sexGroupColorMapping,
      getDataFn: getRbasg,
      getGraphDataFn: formatRbasgToGroupedBar,
      getSvgFn: getGroupedBarSvg,
      getDataTableDataFn: formatRbsagToDataTable,
      legendTitle: getTranslations().graphs.legend.ageGroup,
      hasReferenceLine: true,
    },
    [GraphTypes.RBF]: {
      graphTitle: `${getTranslations().graphs[GraphTypes.RBF].title} ${
        filters.chemical
      }, ${filters.ageSexGroups}, \(${filters.years.join(", ")}\)`,
      colorLegendMapping: foodGroupColorMapping,
      getDataFn: getRbf,
      getGraphDataFn: formatRbfToSunburst,
      getSvgFn: getSunburstSvg,
      getDataTableDataFn: formatRbfToDataTable,
      legendTitle: getTranslations().graphs.legend.foodGroup,
      hasReferenceLine: false,
    },
    [GraphTypes.RBFG]: {
      graphTitle: `${getTranslations().graphs[GraphTypes.RBFG].title} ${
        filters.chemical
      }, \(${filters.years.join(", ")}\)`,
      colorLegendData: foodGroupColorMapping,
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

  updateLodFilterDescription(data);
  updateSandbox(data, filters);

  const specificData = getDataFn(data, filters);
  const graphData = getGraphDataFn(specificData, filters, colorLegendMapping);
  if (filters.referenceLine && hasReferenceLine) {
    graphData.hr = filters.referenceLine;
  }
  const graphSvg = getSvgFn(graphData);

  el.graphs.title.innerHTML = graphTitle;
  el.graphs.graph.innerHTML = "";
  el.graphs.graph.append(graphSvg || getTranslations().misc.noDataMsg);

  displayColorLegend(colorLegendMapping, legendTitle);

  el.dataTable.dataContainer.classList.remove(classs.HIDDEN);
  const dataTableData = getDataTableDataFn(specificData, filters);
  displayDataTable(dataTableData);

  el.about.container.classList.remove(classs.HIDDEN);
}
