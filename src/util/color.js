/*
 * Generates a color mapping for a given set of labels.
 *
 * Parameters:
 * - An array of labels.
 *
 * Returns:
 * - A mapping from label to color.
 */
export function generateColorMapping(labels) {
  const mapping = {};

  const colorFunction = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, labels.length + 1),
  );

  labels.forEach((l) => {
    mapping[l] = colorFunction(l);
  });

  return mapping;
}
