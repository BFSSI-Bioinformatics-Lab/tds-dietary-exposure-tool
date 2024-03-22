import { getTranslations } from "../translation/translation.js";

/**
 * Download data in CSV format
 *
 * Parameters:
 * - An object that represents downloadable data
 *   - rows: Array of objects, where each object has column titles as keys with corresponding values
 *   - filename: Formatted filename
 */
export function downloadCSV(data) {
  const csvContent = d3.csvFormat(data.rows);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.download = `${data.filename}, ${getTranslations().dataTable.exportNames.dataExport
    }, ${new Date().toLocaleString("en-US")}`;
  link.href = window.URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
