import { Translation } from "../const.js";


let ActiveURLObjIds = [];


// formatDownloadName(filename): Formats the name for a download
export function formatDownloadName(filename) {
  return `${filename}, ${Translation.translate("dataTable.exportNames.dataExport")}, ${new Date().toLocaleString("en-US")}`;
}


// downloadCSV(csvConvent): Exports some table as a CSV file
// Note: For large CSV files, their string content are so big, that they take up
//  all of the browser's memory and end up not downloading the file.
//  We want to slowly stream the data download using 'URL.CreateObjectURL'.
//  https://stackoverflow.com/questions/30167326/unable-to-download-large-data-using-javascript
//
// WARNING: Remember to FREE UP the memory of the newly created URL object by calling 'URL.revokeObjectURL'
//  https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static
export function downloadCSV({csvContent, fileName = "", freePreviousObjects = true, saveNewObjId = true} = {}) {
    if (freePreviousObjects) {
      for (const objId of ActiveURLObjIds) {
        URL.revokeObjectURL(objId);
      }

      ActiveURLObjIds = [];
    }

    const universalBOM = "\uFEFF";

    // creates a temporary link for exporting the table
    const link = document.createElement('a');
    var urlObjId = URL.createObjectURL( new Blob( [universalBOM + csvContent], {type:'text/csv;charset=utf-8'} ) );
    link.setAttribute('href', urlObjId);
    link.setAttribute('download', `${fileName}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (saveNewObjId) {
      ActiveURLObjIds.push(urlObjId);
    }

    return urlObjId;
}

/**
 * Download data in CSV format
 *
 * Parameters:
 * - An object that represents downloadable data
 *   - rows: Array of objects, where each object has column titles as keys with corresponding values
 *   - filename: Formatted filename
 */
export function downloadCSVFromData(data, freePreviousObjects = true) {
  const csvContent = d3.csvFormat(data.rows);
  return downloadCSV({csvContent: csvContent, fileName: data.csvFilename, freePreviousObjects: freePreviousObjects});
}
