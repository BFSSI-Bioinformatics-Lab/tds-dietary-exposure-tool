import { IDCs, LODs, ageGroupToIDCAgeGroup, getTranslations } from "../const.js";
import { lodOrMdlIsValid } from "./data.js";

/**
 * Return the occurrence value for a given row in the TDS contaminant data.
 * This value could change from the occurrence value already existing in the data, based upon
 * the current filters and LOD levels.
 */
export function getOccurrenceForContaminantEntry(row, filters) {
  let result = row.occurrence;

  if (row.occurrence == 0) {
    if (!lodOrMdlIsValid(row.chemicalGroup)) {
      return 0;
    }
    if (filters.lod == LODs.Exclude) {
      return 0;
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
 * Calculate the exposure to a contaminet for a given food composite.
 *
 * Parameters:
 *  - consumption: The mean consumption of a food composite
 *  - occurrence: The contaminant occurrence value
 *  - filters: Currently selected filters. Required to check for and handle special cases.
 *  - age: Age that the consumption value is for. Required for handling special cases.
 */
export function getContaminantExposure(
  meanConsumptionOfFoodComposite,
  meanContaminantOccurrence,
  filters,
  age,
) {
  // Special case when calculating radionuclide occurrence
  if (filters.chemicalGroup == getTranslations().tdsData.values.radionuclides) {
    const IDC = IDCs[filters.chemical][ageGroupToIDCAgeGroup[age]];
    return (
      // Unit: mSv/year
      ((meanContaminantOccurrence * meanConsumptionOfFoodComposite) / 1000) *
      IDC *
      365
    );
  }

  return meanConsumptionOfFoodComposite * meanContaminantOccurrence;
}

/**
 * Get composite info for a given TDS consumption row
 */
export function getCompositeInfo(row) {
  return row.compositeDesc + " (" + row.composite + ")";
}

/*
 * Generates a color mapping for a given set of labels.
 *
 * Parameters:
 * - An array of object where each key has a inner text and color fields.
 *
 * Returns:
 * - A mapping from key to color and label.
 */
export function generateColorMapping(mapping) {
  const colorFunction = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, Object.keys(mapping).length + 1),
  );

  mapping = Object.keys(mapping).reduce((acc, key) => {
    acc[key] = { ...mapping[key], color: colorFunction(key) };
    return acc;
  }, {});

  return mapping;
}
