import { loadTdsData } from "./data/dataTranslator.js";
import { classs, el } from "./ui/const.js";
import { initializeFilters } from "./ui/filter.js";
import { addEventListenersToPage, initializePageText } from "./ui/page.js";

async function main() {
  el.misc.loader.classList.remove(classs.HIDDEN);
  await initializePageText();
  await loadTdsData();
  addEventListenersToPage();
  initializeFilters();
  el.misc.loader.classList.add(classs.HIDDEN);
}

main();
