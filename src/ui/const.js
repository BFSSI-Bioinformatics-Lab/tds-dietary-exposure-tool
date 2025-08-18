import { GraphTypes } from "../const.js";


// Ids for the different types of tooltips
export let ToolTipIdDict = {
  title: "titleInfo"
};

let ToolTipIdLst = Object.values(ToolTipIdDict);
export const TooltipIds = new Set(ToolTipIdLst);
export const TooTipIdsStr = ToolTipIdLst.map((id) => `#${id}`).join(", ");

export const classes = {
  HIDDEN: "hidden",
  DISABLED: "disabled",
  BOLD: "bold",
  RED: "red",
  FILTER: "filter",
  FILTER_BORDER: "filter-border",
  ACTIVE_GRAPH_SELECT: "active-graph-select",
  SANDBOX_BUTTON: "sandbox-button",
  OVERRIDE_ITEM: "override-item-container",
  OVERRIDE_VALUE: "override-item-value",
  FILTER_ADDITIONAL_ACTIVE: "filter-additional-active",
  FILTER_ADDITIONAL_RBASG: "filter-additional-rbasg",
  FILTER_ADDITIONAL_RBF: "filter-additional-rbf",
  FILTER_ADDITIONAL_RBFG: "filter-additional-rbfg",
  GRAPH_LEGEND_SECTION: "legend-section",
  GRAPH_LEGEND_TITLE: "legend-title",
  GRAPH_LEGEND_CONTENT: "legend-content",
  GRAPH_LEGEND_ITEM: "legend-item",
  GRAPH_LEGEND_CLICKALBE_ITEM: "clickable-legend-item",
  GRAPH_LEGEND_COLOR: "legend-item-color",
  GRAPH_LEGEND_ITEM_TEXT: "legend-item-text",
  DATA_TABLE_CELL: "data-table-cell",
  DATA_TABLE_HEADER: "data-table-header",
  DATA_TABLE_HEADER_ARROWS: "data-table-header-arrows",
  DATA_TABLE_HEADER_ARROWS_INACTIVE: "data-table-header-arrows-inactive",
  MULTI_SEL_SUBTITLE: "multi-sel-subtitle",
  MULTI_SEL_ALL_SUBTITLE: "multi-sel-all-subtitle",
  NOTE_ELEMENT: "note-element"
};

export const text = {
  arrowDown: "&darr;",
  arrowUp: "&uarr;",
};

export const el = {
  /*
   * Introductory Text Elements
   */

  header: {
    title: document.getElementById("title"),
    information: {
      howToUse: {
        button: document.getElementById("how-to-use-button"),
        content: document.getElementById("how-to-use-content"),
        arrowDown: document.getElementById("how-to-use-arrow-down"),
        arrowRight: document.getElementById("how-to-use-arrow-right"),
      },
      moreInfo: {
        button: document.getElementById("more-info-button"),
        content: document.getElementById("more-info-content"),
        arrowDown: document.getElementById("more-info-arrow-down"),
        arrowRight: document.getElementById("more-info-arrow-right"),
      },
    },
    languageButton: document.getElementById("language-button"),
    subtitle: document.getElementById("subtitle"),
  },

  /*
   * Filters and Filter Titles
   */

  filters: {
    containers: document.querySelectorAll("." + classes.FILTER),
    hiddenContainers: document.querySelectorAll(
      "." + classes.FILTER + "." + classes.HIDDEN,
    ),
    containersMap: {
      consumptionUnits: document.getElementById(
        "filter-consumption-units-container",
      ),
    },
    titles: {
      graphSelectTitle: document.getElementById("graph-select-title"),
      rbasgGraphSelectSubtitle: document.querySelector("#rbasg-graph-select .graph-select-subtitle"),
      rbfgGraphSelectSubtitle: document.querySelector("#rbfg-graph-select .graph-select-subtitle"),
      rbfGraphSelectSubtitle: document.querySelector("#rbf-graph-select .graph-select-subtitle"),
      filtersTitle: document.getElementById("filters-title"),
      chemicalGroup: document.getElementById("filter-chemical-group-title"),
      chemical: document.getElementById("filter-chemical-title"),
      years: document.getElementById("filter-year-title"),
      multisSels: document.querySelectorAll("." + classes.MULTI_SEL_SUBTITLE),
      multisSelAlls: document.querySelectorAll(
        "." + classes.MULTI_SEL_ALL_SUBTITLE,
      ),
      lod: document.getElementById("filter-lod-title"),
      lodSubtitle: document.getElementById("filter-lod-subtitle"),
      consumptionUnits: document.getElementById(
        "filter-consumption-units-title",
      ),
      rbasgAgeGroup: document.getElementById(
        "filter-rbasg-age-group-filter-title",
      ),
      rbasgSexGroup: document.getElementById("filter-rbasg-sex-title"),
      rbasgDomain: document.getElementById("filter-rbasg-domain-title"),
      rbfAgeSexGroup: document.getElementById("filter-rbf-age-sex-group-title"),
      rbfSortBy: document.getElementById("filter-rbf-sort-by-title"),
      rbfgAge: document.getElementById("filter-rbfg-age-title"),
      rbfgSex: document.getElementById("filter-rbfg-sex-title"),
      rbfgRange: document.getElementById("filter-rbfg-range-title"),
      referenceLine: document.getElementById("filter-reference-line-title"),
      overrideFood: document.getElementById("filter-override-food-title"),
      overrideValue: document.getElementById("filter-override-value-title"),
    },
    borders: document.querySelectorAll("." + classes.FILTER_BORDER),
    resetButton: document.getElementById("filter-reset-button"),
    sandbox: {
      openButton: document.getElementById("sandbox-open-button"),
      closeButton: document.getElementById("sandbox-close-button"),
      resetButton: document.getElementById("sandbox-reset-button"),
      container: document.getElementById("sandbox-container"),
      title: document.getElementById("sandbox-title"),
      subtitle: document.getElementById("sandbox-subtitle"),
      referenceLineTitle: document.getElementById("reference-line-title"),
      overrideTitle: document.getElementById("override-title"),
      overrideSubtitle: document.getElementById("override-subtitle"),
      addOverrideButton: document.getElementById("override-add-button"),
      overridesList: document.getElementById("overrides-list-container"),
      showSuppressedTitle: document.getElementById("show-suppressed-title"),
      showSuppressedSubtitle: document.getElementById(
        "show-suppressed-subtitle",
      ),
      showSuppressedButton: document.getElementById(
        "filter-show-suppressed-button",
      ),
    },
    inputs: {
      chemicalGroup: document.getElementById("filter-chemical-group-select"),   
      chemical: document.getElementById("filter-chemical-select"),
      years: document.getElementById("filter-year-select"),
      lod: document.getElementById("filter-lod-select"),
      consumptionUnits: document.getElementById(
        "filter-consumption-units-select",
      ),
      referenceLine: document.getElementById("filter-reference-line-select"),
      overrideFood: document.getElementById("filter-override-food-select"),
      overrideValue: document.getElementById("filter-override-value-select"),
    },
  },

  /*
   * Graphs and Legend
   */

  graphs: {
    container: document.getElementById("graph-content"),
    title: document.getElementById("graph-title"),
    titleContainer: document.getElementById("graph-title-container"),
    graph: document.getElementById("graph"),
    saveGraph: document.getElementById("save-graph-title"),
    saveGraphContainer: document.getElementById("save-graph-container"),

    [GraphTypes.RBASG]: {
      graphSelect: document.getElementById("rbasg-graph-select"),
      filterContainers: document.querySelectorAll(
        "." + classes.FILTER_ADDITIONAL_RBASG,
      ),
      filters: {
        age: document.getElementById("filter-rbasg-age-group-select"),
        sex: document.getElementById("filter-rbasg-sex-select"),
        domain: document.getElementById("filter-rbasg-domain-select"),
      },
    },

    [GraphTypes.RBF]: {
      graphSelect: document.getElementById("rbf-graph-select"),
      filterContainers: document.querySelectorAll(
        "." + classes.FILTER_ADDITIONAL_RBF,
      ),
      filters: {
        sortBy: document.getElementById("filter-rbf-sort-by-select"),
        ageSexGroup: document.getElementById("filter-rbf-age-sex-group-select")
      },
    },

    [GraphTypes.RBFG]: {
      graphSelect: document.getElementById("rbfg-graph-select"),
      filterContainers: document.querySelectorAll(
        "." + classes.FILTER_ADDITIONAL_RBFG,
      ),
      filters: {
        range: document.getElementById("filter-rbfg-range-select"),
        age: document.getElementById("filter-rbfg-age-select"),
        sex: document.getElementById("filter-rbfg-sex-select")
      },
    },

    legend: {
      container: document.getElementById("legend-container"),
    },
  },

  /*
   * Data Tables
   */

  dataTable: {
    dropdown: {
      button: document.getElementById("data-table-title"),
      content: document.getElementById("data-table-container"),
      arrowDown: document.getElementById("data-table-arrow-right"),
      arrowRight: document.getElementById("data-table-arrow-down"),
    },
    dataContainer: document.getElementById("data-container"),
    title: document.getElementById("data-table-title"),
    container: document.getElementById("data-table-container"),
    dataTable: document.getElementById("data-table"),
    dataTableNoContentContainer: document.getElementById("dataTableNoContent"),
    buttons: {
      downloadConsumptionData: document.getElementById(
        "download-consumption-data-button",
      ),
      downloadContaminantData: document.getElementById(
        "download-contaminant-data-button",
      ),
      downloadDataTable: document.getElementById("download-data-table-button"),
    },
  },

  /*
   * About section
   */

  about: {
    dropdown: {
      button: document.getElementById("about-title"),
      content: document.getElementById("about-table-container"),
      arrowDown: document.getElementById("about-arrow-right"),
      arrowRight: document.getElementById("about-arrow-down"),
    },
    container: document.getElementById("about-container"),
    title: document.getElementById("about-title"),
    tableContainer: document.getElementById("about-table-container"),
    table: document.getElementById("about-table"),
  },

  /*
   * Misc.
   */

  misc: {
    pageContainer: document.getElementById("pageContainer"),
    loader: document.getElementById("loader"),
  },
};


export class Visuals {
    // getNextTextY(textY, numOfTextLines): Retrives the next y-position for the texts
    //  in a text box
    static getNextTextY(textY, numOfTextLines, fontSize, lineSpacing) {
        return textY +  (numOfTextLines + 1) * fontSize + numOfTextLines * lineSpacing;
    }

    // drawWrappedText(text, numLines):
    //   Draws the text to be wrapped around the textbox by creating
    //      tspan elements to fit text into a given width
    static drawWrappedText({textGroup = null, text = "", width = 0, textX = 0, textY = 0, 
                            numLines = [0], fontSize = 12, lineSpacing = 1, clear = true} = {}) {
        let textAnchor = textGroup.attr("text-anchor");
        if (textAnchor == "middle") {
            textX += width / 2;
        }

        // remove any existing text
        if (clear) {
            textGroup.selectAll("tspan").remove();
        }

        let textParts = text;
        if ((typeof text === 'string')) {
          textParts = [{text: text, atts: {}}];
        }

        const tspanXPos = textX;
        let currentTextY = textY;
        const textPartsLen = textParts.length;
        let prevTextNodeLen = 0;
        let textNodes = [textGroup.append("tspan").attr("y", currentTextY).attr("x", tspanXPos + prevTextNodeLen)];

        for (let i = 0; i < textPartsLen; ++i) {
          const textPart = textParts[i];
          const textPartIsString = typeof textPart === 'string';
          const currentText = (textPartIsString) ? textPart : textPart.text;

          const words = currentText.split(" ");
          const wordsLen = words.length;
          let textNode = textNodes[textNodes.length - 1];


          for (let j = 0; j < wordsLen; ++j) {
            const word = words[j];
            textNode = textNodes[textNodes.length - 1];
            const line = textNode.text();
            const lineArr = line.split(" ");

            lineArr.push(word);
            textNode.text(lineArr.join(" "));

            if (textNode.node().getComputedTextLength() > width - prevTextNodeLen) {
              lineArr.pop();
              currentTextY = Visuals.getNextTextY(textY, numLines[0], fontSize, lineSpacing);
              const joinedLines = (i == 0 && j == 0) ? "" : lineArr.join(" ");

              textNode.text(joinedLines);
              textNode = textGroup.append("tspan")
                  .attr("x", tspanXPos)
                  .attr("y", currentTextY)
                  .text(word);

              textNodes.push(textNode);
              numLines[0]++;

            } else {
              const joinedLines = (i == 0 && j == 0) ? word : lineArr.join(" ");
              textNode.text(joinedLines);
              textNodes[textNodes.length - 1] = textNode;
            }

            prevTextNodeLen = textNode.node().getComputedTextLength();
          }
        }

        numLines[0]++;
    }  

    // drawSingleLineText(text, TextY): Draws the text on a single line in the textbox
    static drawSingleLineText({textGroup = null, text = "", textX = 0, textY = 0, clear = true, letterSpacing = 1} = {}) {
        let textAnchor = textGroup.attr("text-anchor");
        if (textAnchor == "middle") {
            textX += width / 2;
        }

        // remove any existing text
        if (clear) {
            textGroup.selectAll("tspan").remove();
        }

        let textParts = text;
        if ((typeof text === 'string')) {
          textParts = [{text: text, atts: {}}];
        }

        let totalWidth = 0;

        for (const textPart of textParts) {
          const textPartIsString = typeof textPart === 'string';
          const currentText = (textPartIsString) ? textPart : textPart.text;
          const atts = (textPartIsString) ? {} : textPart.atts;

          const textNode = textGroup.append("tspan")
            .attr("x", textX)
            .attr("y", textY)
            .text(currentText);

          for (const attName in atts) {
            textNode.attr(attName, atts[attName]);
          }

          const textWidth = textNode.node().getComputedTextLength();
          totalWidth += textWidth;
          textX += textWidth + letterSpacing;
        }

        return totalWidth;
    }

    // drawText(): Draws text on 'textGroup'
    // Note: 'text' is either a string or a list of strings
    static drawText({textGroup = null, text = "", textX = 0, textY = 0, width = 0, 
                    fontSize = 12, lineSpacing = 1, textWrap = "Wrap", paddingLeft = 0, paddingRight = 0} = {}) {

        const origTextY = textY;
        let textLines = text;
        let linesWritten = 0;
        let clear = true;
        let line = "";

        if (typeof textLines === 'string') {
            textLines = [textLines];
        }

        const textLinesLen = textLines.length;

        // draws many lines of wrapped text that are each seperated by a newline
        if (textWrap == "Wrap") {
            let numLines = [0];

            for (let i = 0; i < textLinesLen; ++i) {
                line = textLines[i];
                numLines = [0];

                if (i > 0) {
                    clear = false;
                }

                Visuals.drawWrappedText({textGroup, text: line, width, textX, textY, numLines, fontSize, lineSpacing, clear});
                numLines = numLines.filter((line) => !isNaN(line));
                linesWritten += numLines[0];
                textY = Visuals.getNextTextY(origTextY, linesWritten, fontSize, lineSpacing) - fontSize;
            }

            textY -= fontSize;

        // draws many lines of text on a single line with each text seperated by a newline
        } else if (textWrap == "NoWrap") {
            textY += fontSize;

            for (let i = 0; i < textLinesLen; ++i) {
                line = textLines[i];

                if (i > 0) {
                    clear = false;
                }

                let lineWidth = Visuals.drawSingleLineText({textGroup, text: line, textX, textY, clear});
                width = Math.max(paddingLeft + lineWidth + paddingRight, width);

                linesWritten += 1;
                textY = Visuals.getNextTextY(origTextY, linesWritten, fontSize, lineSpacing);
            }
        }

        return {width, textBottomYPos: textY - lineSpacing - fontSize};
    }

}