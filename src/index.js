import {
  getContaminentOcurrenceData,
  getFoodCompositeData,
  getFoodConsumptionData,
} from "./data.js";

import {
  addEventListenersToButtons,
  addEventListenersToGraphSelects,
  addEventListenersToInputs,
  updateInputsWithAvailableFilters,
} from "./view.js";

async function main() {
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
  );
}

main();
