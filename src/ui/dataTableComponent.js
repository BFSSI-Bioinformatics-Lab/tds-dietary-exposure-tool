import { DataType, GraphTypes, SortByDir } from "../const.js";
import { downloadCSV } from "../data/dataDownloader.js";
import {
  getRawFilteredConsumptionData,
  getRawFilteredContaminantData,
} from "../data/dataTranslator.js";
import { formatRbsagToDataTable, getRbasg } from "../graph/rbasg.js";
import { formatRbfToDataTable, getRbf } from "../graph/rbf.js";
import { formatRbfgToDataTable, getRbfg } from "../graph/rbfg.js";
import { getTranslations } from "../translation/translation.js";
import { classs, el, text } from "./const.js";
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
 * - data: the data to display, in object format where each key is a column (a DataTableHeader) with a corresponding value
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

  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");
  tableHeaderRow.classList.add(classs.BOLD);
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.classList.add(classs.DATA_TABLE_CELL);
    const header = document.createElement("div");
    header.classList.add(classs.DATA_TABLE_HEADER);
    header.textContent = getTranslations().dataTable.headers[column];
    const arrows = document.createElement("span");
    arrows.classList.add(classs.DATA_TABLE_HEADER_ARROWS);
    const arrowUp = document.createElement("span");
    arrowUp.innerHTML = text.arrowUp;
    const arrowDown = document.createElement("span");
    arrowDown.innerHTML = text.arrowDown;

    [arrowUp, arrowDown].forEach((arrow) => {
      arrows.appendChild(arrow);
      arrow.classList.add(classs.DATA_TABLE_HEADER_ARROWS_INACTIVE);
    });

    if (filters.dataTableSortBy.column == column) {
      if (filters.dataTableSortBy.dir == SortByDir.ASC) {
        arrowDown.classList.remove(classs.DATA_TABLE_HEADER_ARROWS_INACTIVE);
      } else {
        arrowUp.classList.remove(classs.DATA_TABLE_HEADER_ARROWS_INACTIVE);
      }
    }

    addEventListernToDataTableHeader(arrowUp, arrowDown, column, data, filters);
    header.appendChild(arrows);
    th.appendChild(header);
    tableHeaderRow.appendChild(th);
  });
  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  data.sort((a, b) => {
    const sortBy = filters.dataTableSortBy;
    let valueA = a[sortBy.column]?.replace(/,/g, "").replace(/%/g, "");
    let valueB = b[sortBy.column]?.replace(/,/g, "").replace(/%/g, "");
    if (!isNaN(parseFloat(valueA))) {
      valueA = parseFloat(valueA);
      valueB = parseFloat(valueB);
    }
    if (valueA < valueB) return sortBy.dir == SortByDir.ASC ? -1 : 1;
    if (valueA > valueB) return sortBy.dir == SortByDir.ASC ? 1 : -1;
    return 0;
  });

  const body = document.createElement("tbody");
  data.forEach((item) => {
    const row = document.createElement("tr");
    columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = item[column];
      row.appendChild(td);
    });
    body.append(row);
  });
  table.appendChild(body);
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
