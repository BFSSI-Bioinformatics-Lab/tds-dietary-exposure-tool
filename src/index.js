import { getTDSData } from "./data/dataTranslator.js";
import {
  addEventListenersToPage,
  initializeFilters,
} from "./ui/filterComponent.js";
import { initializePageText } from "./ui/page.js";

async function main() {
  await initializePageText();
  addEventListenersToPage();

  const tdsData = await getTDSData();

  initializeFilters(tdsData);
}

main();
