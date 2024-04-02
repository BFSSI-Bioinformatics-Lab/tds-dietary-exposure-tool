import { getTDSData } from "./data/dataTranslator.js";
import { classs, el } from "./ui/const.js";
import {
  addEventListenersToPage,
  initializeFilters,
} from "./ui/filterComponent.js";
import { initializePageText } from "./ui/page.js";

async function main() {
  el.misc.loader.classList.remove(classs.HIDDEN);

  await initializePageText();

  const tdsData = await getTDSData();

  addEventListenersToPage(tdsData);

  el.misc.loader.classList.add(classs.HIDDEN);

  initializeFilters(tdsData);
}

main();
