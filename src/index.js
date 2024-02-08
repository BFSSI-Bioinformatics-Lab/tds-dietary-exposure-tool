import { filterTdsDataAndUpdateGraph, initializeFilters } from "./filter.js";
import { initializePage } from "./page.js";
import { loadTdsData } from "./tds.js";

async function main() {
  initializePage();

  const tdsData = await loadTdsData();

  initializeFilters(tdsData);
  filterTdsDataAndUpdateGraph(tdsData);
}

main();
