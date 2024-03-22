/**
 * Read a CSV file and return data in a custom format
 *
 * Parameters:
 * - filepath: The path to the CSV file relative to the project root
 *
 * Returns:
 * - A promise that resolves to an object with:
 *   - columnTitles: An array of column titles in the CSV
 *   - rows: An array of objects representing rows in where each key is a column title with a corresponding value
 *   or null if there is an error.
 */
export async function readCSV(filepath) {
  try {
    const rawData = await d3.csv(filepath);

    if (rawData && rawData.columns && rawData.length > 0) {
      return { columnTitles: rawData.columns, rows: [...rawData] };
    } else {
      console.error("Invalid CSV data");
      return null;
    }
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return null;
  }
}

/**
 * Read a JSON file and return data in object format
 *
 * Parameters:
 * - filepath: The path to the CSV file relative to the project root
 *
 * Returns:
 * - A promise that resolves to an object containing JSON data, or null if there is an error
 */

export async function readJSON(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to load JSON file, status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    return null;
  }
}
