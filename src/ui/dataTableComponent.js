import { DataType, GraphTypes, getTranslations, Translation, DataTableHeader } from "../const.js";
import { downloadCSVFromData, formatDownloadName, downloadCSV } from "../data/dataDownloader.js";
import {
  getRawFilteredConsumptionData,
  getRawFilteredContaminantData,
} from "../data/dataTranslator.js";
import { formatRbsagToDataTable, getRbasg } from "../graph/rbasg.js";
import { formatRbfToDataTable, getRbf } from "../graph/rbf.js";
import { formatRbfgToDataTable, getRbfg } from "../graph/rbfg.js";
import { TableTools } from "../util/data.js";
import { el} from "./const.js";
import { getActiveFilters } from "./filter.js";

/**
 * Download raw filtered TDS data
 * Parameters:
 * - dataToDownload: either DataType.CONSUMPTION or DataType.CONTAMINANT
 */
export async function downloadTDSData(dataToDownload) {
  const getData = {
    [DataType.CONSUMPTION]: getRawFilteredConsumptionData,
    [DataType.CONTAMINANT]: getRawFilteredContaminantData,
  };

  const data = await getData[dataToDownload]();

  data.forEach((d, ind) => {
    const freePreviousObjects = ind == 0;
    downloadCSVFromData(d, freePreviousObjects);
  });
}

export async function downloadTemplate() {
  const [consumptionData, contaminantData] = await Promise.all([
    d3.csv(`data/consumption/${i18next.language}/template.csv`),
    d3.csv(`data/contaminant/${i18next.language}/template.csv`)
  ]);

  const consumptionCSVContent = TableTools.createCSVContent([consumptionData.columns]);
  const contaminantCSVContent = TableTools.createCSVContent([contaminantData.columns]);

  downloadCSV({fileName: Translation.translate("dataTable.exportNames.consumptionTemplate"), csvContent: consumptionCSVContent});
  downloadCSV({fileName: Translation.translate("dataTable.exportNames.contaminantTemplate"), csvContent: contaminantCSVContent, freePreviousObjects: false});
}


// updateTable(data, selector): Updates the data in the table
// Note:
// - based off Jquery's Datatables: https://datatables.net/
export function updateTable(selector, columnInfo, data, dataTableKwargs = undefined) {
    let dataTable;
    if (DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
    }

    $(`${selector} tbody`).empty();
    $(`${selector} thead`).empty();

    const dataTableTranslations = Translation.translate("dataTableTemplate", { returnObjects: true });
    if (dataTableKwargs === undefined) {
      dataTableKwargs = {
        autoWidth: false,
        language: dataTableTranslations,
        columns: columnInfo,
        scrollCollapse: true,
        scrollX: true,
        scrollY: '500px'
      }
    }

    dataTable = $(selector).DataTable(dataTableKwargs);

    dataTable.clear();
    dataTable.rows.add(data);
    dataTable.columns.adjust();
    dataTable.draw();
}

/**
 * Download current graph calculations shown in data table
 * Parameters:
 * - tdsData: formatted TDS data
 * - graphType: the graph the downloaded calculations will be for
 */
export function downloadDataTable(tdsData, graphType) {
  const filters = getActiveFilters();

  const graphMapping = {
    [GraphTypes.RBASG]: {
      getDataFn: getRbasg,
      getDataTableDataFn: formatRbsagToDataTable,
    },
    [GraphTypes.RBF]: {
      getDataFn: getRbf,
      getDataTableDataFn: formatRbfToDataTable,
    },
    [GraphTypes.RBFG]: {
      getDataFn: getRbfg,
      getDataTableDataFn: formatRbfgToDataTable,
    },
  };
  const [getDataFn, getDataTableDataFn] = Object.values(
    graphMapping[graphType],
  );

  const specificData = getDataFn(tdsData, filters);
  const data = {
    filename: getTranslations().dataTable.exportNames.calculations,
    rows: getDataTableDataFn(specificData, filters),
    csvFilename: ""
  };

  data.rows = data.rows.map((row) => {
    return Object.keys(row).reduce((acc, column) => {
      acc[Translation.translate(`dataTable.headers.${column}`)] = row[column];
      return acc;
    }, {});
  });

  data.csvFilename = formatDownloadName(data.filename);
  downloadCSVFromData(data);
}

/**
 * Display calculations and other important TDS data for a current graph
 *
 * Parameters:
 * - data: the data to display, in object format where each key is a column (a DataTableHeader) with a corresponding value
 */
export async function displayDataTable(data, filters) {
  const tableId = "#data-table";
  const table = d3.select(el.dataTable.dataTable);
  const tableNoContentContainer = d3.select(el.dataTable.dataTableNoContentContainer);

  const noData = data.length == 0;
  tableNoContentContainer.classed("d-none", !noData);
  table.classed("d-none", noData);

  if (noData) {
    tableNoContentContainer.innerHTML = getTranslations().misc.noDataMsg;
    return;
  }

  // clean up the data
  for (const row of data) {
    const includeSuppresed = row[DataTableHeader.INCLUDED_SUPPRESSED];
    if (includeSuppresed === undefined) continue;

    if (!includeSuppresed) {
      row[DataTableHeader.INCLUDED_SUPPRESSED] = "";
      continue;
    }
 
    let newIncludedSuppressed = row[DataTableHeader.INCLUDED_SUPPRESSED].map((suppressedEntry) => String(suppressedEntry));
    row[DataTableHeader.INCLUDED_SUPPRESSED] = newIncludedSuppressed.join("; ");
  }

  const columns = Object.keys(data[0]);
  const tableColInfo = columns.map((columnKey) => {
      return {"title": Translation.translate(`dataTable.headers.${columnKey}`, {}, false), "data": columnKey};
  });

  updateTable(tableId, tableColInfo, data);

  // adjust the column widths
  const tableColInfoLen = tableColInfo.length;
  const columnWidths = [];

  for (let i = 0; i < tableColInfoLen; ++i) {
    columnWidths.push("250px");
  }

  columnWidths[tableColInfoLen - 1] = "500px";
  columnWidths[tableColInfoLen - 2] = "500px";
  columnWidths[tableColInfoLen - 3] = "500px";

  for (let i = 0; i < tableColInfoLen; ++i) {
    const columnWidth = columnWidths[i];
    d3.selectAll(`.dataTable th:nth-child(${i + 1})`)
      .style("min-width", columnWidth);

    d3.selectAll(`.dataTable td:nth-child(${i + 1})`)
      .style("min-width", columnWidth);
  }
}
