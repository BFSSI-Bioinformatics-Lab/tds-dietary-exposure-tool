export async function readCSV(filepath) {
  try {
    return await d3.csv(filepath);
  } catch (error) {
    console.error("Error reading CSV file:", error);
  }
}

export async function readJsonFile(fileName) {
  try {
    const response = await fetch(fileName);
    if (!response.ok) {
      throw new Error(`Failed to load JSON file, status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
  }
}
