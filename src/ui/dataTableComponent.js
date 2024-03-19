import { DataType, GraphTypes } from "../config.js";
import { downloadCSV } from "../data/dataDownloader.js";
import {
  getRawFilteredConsumptionData,
  getRawFilteredContaminentData,
} from "../data/dataTranslator.js";
import { formatRbsagToDataTable, getRbasg } from "../graph/rbasg.js";
import { formatRbfToDataTable, getRbf } from "../graph/rbf.js";
import { formatRbfgToDataTable, getRbfg } from "../graph/rbfg.js";
import { getTranslations } from "../translation/translation.js";
import { el } from "./const.js";
import { getActiveFilters } from "./filterComponent.js";

/**
 *
 * Download raw filtered TDS data
 * Parameters:
 * - dataToDownload: either DataType.CONSUMPTION or DataType.CONTAMINENT
 *
 */
export async function downloadTDSData(dataToDownload) {
  const getData = {
    [DataType.CONSUMPTION]: getRawFilteredConsumptionData,
    [DataType.CONTAMINENT]: getRawFilteredContaminentData,
  };

  const data = await getData[dataToDownload]();

  data.forEach((d) => {
    downloadCSV(d);
  });
}

/**
 *
 * Download current graph calculations shown in data table
 * Parameters:
 * - tdsData: formatted TDS data
 * - graphType: the graph the downloaded calculations will be for
 *
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
    filename: "Dietary Exposure Calculations",
    rows: getDataTableDataFn(specificData, filters),
  };
  downloadCSV(data);
}

/*
 *
 * Display calculations and other important TDS data for a current graph
 *
 * Parameters:
 * - data: the data to display, in object format where each key is a column with a corresponding value
 *
 */
export async function displayDataTable(data) {
  const tableContainer = el.dataTable.dataTable;
  tableContainer.innerHTML = "";

  const table = document.createElement("table");

  if (data.length == 0) {
    tableContainer.innerHTML = getTranslations().misc.noDataMsg;
    return;
  }

  const columns = Object.keys(data[0]);

  const headerRow = document.createElement("tr");
  headerRow.classList.add("bold");
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.classList.add("data-table-cell");
    th.textContent = column;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  data.forEach((item) => {
    const row = document.createElement("tr");
    columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = item[column];
      row.appendChild(td);
    });
    table.appendChild(row);
  });
  tableContainer.appendChild(table);
}
