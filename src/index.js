import { getTDSData } from "./data/dataTranslator.js";
import {
  addEventListenersToPage,
  initializeFilters,
} from "./ui/filterComponent.js";
import { initializePageText } from "./ui/page.js";

async function main() {
  await initializePageText();

  const tdsData = await getTDSData();

  addEventListenersToPage(tdsData);
  initializeFilters(tdsData);
}

main();
