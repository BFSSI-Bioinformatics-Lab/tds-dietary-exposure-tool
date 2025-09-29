import { GraphLegendTypes, GraphTypes, sexGroups, getTranslations, Translation } from "../const.js";
import { classes, el, ToolTipIdDict } from "./const.js";
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
import {
  displayColorLegendSection,
  displayTextLegendSection,
} from "./graph/colorLegend.js";
import { getGroupedBarSvg } from "./graph/groupedBar.js";
import { getStackedBarSvg } from "./graph/stackedBar.js";
import { getSunburstSvg } from "./graph/sunburst.js";
import {
  getActiveFilters,
  getSelectedGraphType,
  updateLodFilterDescription,
  updateSandbox,
  rbfgLegendOnClick,
  drawToolTips
} from "./filter.js";
import { displayDataTable } from "./dataTableComponent.js";
import { getAgeSexDisplay } from "../util/data.js";


const SexGroupColours = {
  [sexGroups.B]: "var(--bothSexColour)",
  [sexGroups.F]: "var(--femaleColour)",
  [sexGroups.M]: "var(--maleColour)"
}

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

  if (graphType == GraphTypes.RBFG) {
    const allFoodGroups = Translation.translate("graphs.legend.allFoodGroups");
    foodGroupColorMapping[allFoodGroups] = {label: allFoodGroups, color: "#A1A1A1" };
  }

  const sexGroupColorMapping = Object.keys(sexGroups).reduce((acc, sex) => {
      acc[sex] = {
        label: getTranslations().graphs.legend.sexGroups[sex],
        color: SexGroupColours[sex],
      };
      return acc;
    }, {});

  const sexGroupTextMapping = Object.keys(sexGroups).reduce((acc, sex) => {
    acc[sex] = {
      label: getTranslations().graphs.legend.sexGroups[sex],
      short: getTranslations().misc.sexGroups[sex],
    };
    return acc;
  }, {});

  const colorLegendMapping = {
    sexGroup: {
      mapping: sexGroupColorMapping,
      title: getTranslations().graphs.legend.sexGroup,
      type: GraphLegendTypes.COLOR,
    },
    sexGroupText: {
      mapping: sexGroupTextMapping,
      title: getTranslations().graphs.legend.sexGroup,
      type: GraphLegendTypes.TEXT,
    },
    foodGroup: {
      mapping: foodGroupColorMapping,
      title: getTranslations().graphs.legend.foodGroup,
      type: GraphLegendTypes.COLOR,
    },
  };

  const graphMapping = {
    [GraphTypes.RBASG]: {
      graphTitle: filters.showByAgeSexGroup? Translation.translate(`graphs.${GraphTypes.RBASG}.titleByAgeGroups`, {chemical: filters.chemical, selectedYears: filters.years.join(", ")}) : Translation.translate(`graphs.${GraphTypes.RBASG}.titleByYears`, {chemical: filters.chemical, ageGroups: filters.ageGroups.join(", ")}),
      colorLegendMappings: [colorLegendMapping.sexGroup],
      getDataFn: getRbasg,
      getGraphDataFn: formatRbasgToGroupedBar,
      getSvgFn: getGroupedBarSvg,
      getDataTableDataFn: formatRbsagToDataTable,
      hasReferenceLine: true,
    },
    [GraphTypes.RBF]: {
      graphTitle: Translation.translate(`graphs.${GraphTypes.RBF}.title`, {chemical: filters.chemical, ageSex: (filters.ageSexGroups[0] !== undefined) ? getAgeSexDisplay(filters.ageSexGroups[0]) : "", selectedYears: filters.years.join(", ")}),
      colorLegendMappings: [
        colorLegendMapping.foodGroup,
        colorLegendMapping.sexGroupText,
      ],
      getDataFn: getRbf,
      getGraphDataFn: formatRbfToSunburst,
      getSvgFn: getSunburstSvg,
      getDataTableDataFn: formatRbfToDataTable,
      hasReferenceLine: false,
    },
    [GraphTypes.RBFG]: {
      graphTitle: Translation.translate(`graphs.${GraphTypes.RBFG}.title`, {chemical: filters.chemical, selectedYears: filters.years.join(", ")}),
      colorLegendMappings: [
        colorLegendMapping.foodGroup,
        colorLegendMapping.sexGroupText,
      ],
      getDataFn: getRbfg,
      getGraphDataFn: formatRbfgToStackedBar,
      getSvgFn: getStackedBarSvg,
      getDataTableDataFn: formatRbfgToDataTable,
      hasReferenceLine: !filters.usePercent,
    },
  };

  const [
    graphTitle,
    colorLegendMappings,
    getDataFn,
    getGraphDataFn,
    getSvgFn,
    getDataTableDataFn,
    hasReferenceLine,
  ] = Object.values(graphMapping[graphType]);

  updateLodFilterDescription(data, filters);
  updateSandbox(data, filters);

  const specificData = getDataFn(data, filters);
  const graphData = getGraphDataFn(
    specificData,
    filters,
    colorLegendMappings[0].mapping,
  );

  if (filters.referenceLine && hasReferenceLine) {
    graphData.hr = filters.referenceLine;
  }

  el.graphs.container.classList.remove(classes.HIDDEN);

  el.graphs.legend.container.innerHTML = "";
  colorLegendMappings.forEach((legendMapping) => {
    if (legendMapping.type == GraphLegendTypes.COLOR) {
      const legendOnClick = (graphType == GraphTypes.RBFG) ? rbfgLegendOnClick : undefined;
      displayColorLegendSection(legendMapping.mapping, legendMapping.title, legendOnClick);

      if (graphType == GraphTypes.RBFG) {
        const toolTipElements = d3.select(`.${classes.GRAPH_LEGEND_TITLE}`);
        const toolTipTextFunc = (data) => { return Translation.translateWebNotes(`graphs.${GraphTypes.RBFG}.titleInfo`); };

        drawToolTips(ToolTipIdDict.title, toolTipElements, toolTipTextFunc);
      }


    } else {
      displayTextLegendSection(legendMapping.mapping, legendMapping.title);
    }
  });

  el.graphs.title.innerHTML = graphTitle;
  el.graphs.graph.innerHTML = "";

  const graphSvg = getSvgFn(graphData, el.graphs.graph);
  if (!graphSvg) {
    el.graphs.graph.append(getTranslations().misc.noDataMsg);
  }

  el.graphs.saveGraph.classList.remove(classes.HIDDEN);
  const dataTableData = getDataTableDataFn(specificData, filters);
  displayDataTable(dataTableData, filters);
}

/**
 *
 * Capturing and downloading the currently displayed graph
 *
 */
export async function downloadGraph() {
  const styles = getComputedStyle(document.querySelector(':root'));
  const backgroundColour = styles.getPropertyValue('--background');

  let sourceText = d3.select(el.graphs.container);
  sourceText = sourceText.select(`.${classes.GRAPH_SOURCE_TEXT}`);

  await sourceText.attr("visibility", "visible");

  await html2canvas(el.graphs.container, { logging: false, backgroundColor: backgroundColour }).then(
    function (canvas) {
      var link = document.createElement("a");
      link.download = getTranslations().graphs.saveGraph.filename;
      link.href = canvas.toDataURL();
      link.click();
    },
  );

  await sourceText.attr("visibility", "hidden");
}
