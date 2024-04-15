import { DataType, GraphTypes } from "../config.js";
import { downloadCSV } from "../data/dataDownloader.js";
import {
  getRawFilteredConsumptionData,
  getRawFilteredContaminantData,
} from "../data/dataTranslator.js";
import { formatRbsagToDataTable, getRbasg } from "../graph/rbasg.js";
import { formatRbfToDataTable, getRbf } from "../graph/rbf.js";
import { formatRbfgToDataTable, getRbfg } from "../graph/rbfg.js";
import { getTranslations } from "../translation/translation.js";
import { classs, el } from "./const.js";
import { getActiveFilters } from "./filterComponent.js";

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
  downloadCSV(data);
}

/*
 * Display calculations and other important TDS data for a current graph
 *
 * Parameters:
 * - data: the data to display, in object format where each key is a column with a corresponding value
 */
export async function displayDataTable(data, filters) {
  const tableContainer = el.dataTable.dataTable;
  tableContainer.innerHTML = "";

  const table = document.createElement("table");

  if (data.length == 0) {
    tableContainer.innerHTML = getTranslations().misc.noDataMsg;
    return;
  }

  const columns = Object.keys(data[0]);

  const headerRow = document.createElement("tr");
  headerRow.classList.add(classs.BOLD);
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.classList.add(classs.DATA_TABLE_CELL);
    th.textContent = getTranslations().dataTable.headers[column];
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  const convertToPlainNumber = (value) => {
    if (!value || typeof value !== "string") return NaN;
    const strippedValue = value.replace(/[^\d.-]/g, "");
    if (!strippedValue || isNaN(strippedValue)) return NaN;
    return Number(strippedValue);
  };

  data.sort((a, b) => {
    const sortBy = filters.dataTableSortBy;
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    const numValueA = !isNaN(valueA)
      ? Number(valueA)
      : convertToPlainNumber(valueA);
    const numValueB = !isNaN(valueB)
      ? Number(valueB)
      : convertToPlainNumber(valueB);

    if (!isNaN(numValueA) && !isNaN(numValueB)) {
      return numValueA - numValueB;
    } else {
      const nameA = String(valueA).toLowerCase();
      const nameB = String(valueB).toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    }
  });

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

/*
 * Display table providing additional information about the tool
 */
export async function displayAboutTable() {
  const data = getTranslations().about.table;

  const tableContainer = el.about.tableContainer;
  tableContainer.innerHTML = "";

  const table = document.createElement("table");

  data.forEach((item) => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = item.header;
    th.classList.add(classs.BOLD);
    row.appendChild(th);
    const td = document.createElement("td");
    td.textContent = item.value;
    row.appendChild(td);
    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}
