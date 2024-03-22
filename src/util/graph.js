import { IDCs, LODs, ageGroupToIDCAgeGroup } from "../config.js";
import { getTranslations } from "../translation/translation.js";
import { lodOrMdlIsValid } from "./data.js";

/**
 *
 * Return the occurence value for a given row in the TDS contaminent data.
 * This value could change from the occurence value already existing in the data, based upon
 * the current filters and LOD levels.
 *
 */
export function getOccurenceForContaminentEntry(row, filters) {
  let result = row.occurence;

  if (row.occurence == 0) {
    if (!lodOrMdlIsValid(row.chemicalGroup)) {
      return 0;
    }
    if (filters.lod == LODs.Exclude) {
      return;
    } else if (filters.lod == LODs[0]) {
      result = 0;
    } else if (filters.lod == LODs["1/2 LOD"]) {
      result = row.lod / 2;
    } else if (filters.lod == LODs.LOD) {
      result = row.lod;
    }
  }

  return result;
}

/**
 *
 * Calculate the exposure to a contaminet for a given food composite.
 *
 * Parameters:
 *  - consumption: The mean consumption of a food composite
 *  - occurence: The contaminent occurence value
 *  - filters: Currently selected filters. Required to check for and handle special cases.
 *  - age: Age that the consumption value is for. Required for handling special cases.
 *
 */
export function getContaminentExposure(
  meanConsumptionOfFoodComposite,
  meanContaminentOccurence,
  filters,
  age,
) {
  // Special case when calculating radionuclide occurence
  if (filters.chemicalGroup == getTranslations().tdsData.values.radionuclides) {
    const IDC = IDCs[filters.chemical][ageGroupToIDCAgeGroup[age]];
    return (
      // Unit: mSv/year
      ((meanContaminentOccurence * meanConsumptionOfFoodComposite) / 1000) *
      IDC *
      365
    );
  }

  return meanConsumptionOfFoodComposite * meanContaminentOccurence;
}

/**
 *
 * Get composite info for a given TDS consumption row
 *
 */
export function getCompositeInfo(row) {
  return row.compositeDesc + " (" + row.composite + ")";
}
