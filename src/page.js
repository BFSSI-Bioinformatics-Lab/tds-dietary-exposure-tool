import { getTranslations, getUserLanguage } from "./translation.js";
import { el } from "./const.js";
import { downloadDataTable } from "./data-table.js";

export async function initializePage() {
  await initializePageText();
  addEventListenersToPage();
}

export async function initializePageText() {
  const data = (await getTranslations()).data;

  Object.keys(data).forEach((key) => {
    if (data[key].isStatic) {
      document.getElementById(key).innerHTML =
        data[key][getUserLanguage()]
          .replaceAll("<", "&lt")
          .replaceAll("\n", "<br/>") + document.getElementById(key).innerHTML;
    }
  });
}

function addEventListenersToPage() {
  [el.howToUse, el.dataInfo].forEach((ele) => {
    ele.container.addEventListener("click", () => {
      ele.content.style.display =
        ele.content.style.display == "none" ? "" : "none";
    });
  });
  [el.downloadConsumptionData, el.downloadContaminentData].forEach((ele) => {
    ele.addEventListener("click", () => {
      downloadDataTable(
        ele.id == el.downloadConsumptionData.id ? "consumption" : "contaminent",
      );
    });
  });
}
