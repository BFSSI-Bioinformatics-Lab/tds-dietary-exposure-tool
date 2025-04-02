import { DataType, GraphTypes, SortByDir, getTranslations, Translation, DataTableHeader } from "../const.js";
import { downloadCSV } from "../data/dataDownloader.js";
import {
  getRawFilteredConsumptionData,
  getRawFilteredContaminantData,
} from "../data/dataTranslator.js";
import { formatRbsagToDataTable, getRbasg } from "../graph/rbasg.js";
import { formatRbfToDataTable, getRbf } from "../graph/rbf.js";
import { formatRbfgToDataTable, getRbfg } from "../graph/rbfg.js";
import { classes, el, text } from "./const.js";
import { getActiveFilters } from "./filter.js";
import { addEventListernToDataTableHeader } from "./page.js";

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

  data.forEach((d) => {
    downloadCSV(d);
  });
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
  };
  data.rows = data.rows.map((row) => {
    return Object.keys(row).reduce((acc, column) => {
      acc[getTranslations().dataTable.headers[column]] = row[column];
      return acc;
    }, {});
  });

  downloadCSV(data);
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

  const headerTranslations = getTranslations().dataTable.headers;
  const tableColInfo = columns.map((columnKey) => {
      return {"title": headerTranslations[columnKey], "data": columnKey};
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

/*
 * Display table providing additional information about the tool
 */
export async function displayAboutTable() {
  const tableId = "#about-table";
  const tableColInfo = [
    {title: "header", data: "header"},
    {title: "value", data: "value"}
  ]

  const data = getTranslations().about.table;
  const dataTableTranslations = Translation.translate("dataTableTemplate", { returnObjects: true });

  const dataTableKwargs = {
    language: dataTableTranslations,
    columns: tableColInfo,
    info: false,
    paging: false
  }

  updateTable(tableId, tableColInfo, data, dataTableKwargs);
}
