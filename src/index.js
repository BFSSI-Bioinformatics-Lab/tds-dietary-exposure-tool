import {
  getContaminentOcurrenceData,
  getFoodCompositeData,
  getFoodConsumptionData,
} from "./data.js";

import { initPage } from "./translation.js";

import {
  addEventListenersToButtons,
  addEventListenersToGraphSelects,
  addEventListenersToInputs,
  updateInputsWithAvailableFilters,
} from "./view.js";

async function main() {
  initPage();

  const contaminentOccurenceData = await getContaminentOcurrenceData();
  const foodConsumptionData = await getFoodConsumptionData();
  const foodCompositeData = await getFoodCompositeData();

  addEventListenersToButtons();
  addEventListenersToGraphSelects(
    foodCompositeData,
    foodConsumptionData,
    contaminentOccurenceData,
  );
  addEventListenersToInputs(
    foodCompositeData,
    foodConsumptionData,
    contaminentOccurenceData,
  );
  updateInputsWithAvailableFilters(
    foodConsumptionData,
    contaminentOccurenceData,
    true,
    true,
  );
}

main();
