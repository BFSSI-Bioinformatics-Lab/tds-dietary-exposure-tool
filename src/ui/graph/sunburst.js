/**
 *
 * Generate a sunburst SVG based on input data
 *
 * Parameters:
 * - data.title: The title of the sunburst chart (displayed in the center)
 * - data.children: Array of child nodes with specific properties
 *   - value: Numeric value associated with the node
 *   - color: Color code for the node
 *   - title: Node title that will be displayed
 *   - info: Additional information for the node tooltip
 *   - sortBy: Array of values to consider for this node when sorting
 *
 * Returns:
 * - Generated sunburst SVG as a string
 *
 */
export function getSunburstSvg(data) {
  if (!data) return;
  let dataExists = false;

  const width = 700;
  const height = width;
  const arcPadding = 1;
  const margin = 1;

  const root = d3.hierarchy(data, (d) => d.children);

  root.sum((d) => {
    if (d.value) {
      dataExists = true;
    }
    return Math.max(0, d.value);
  });

  if (!dataExists) {
    return;
  }

  root.sort((a, b) => {
    if (b.data.sortBy[0] != a.data.sortBy[0]) {
      return b.data.sortBy[0] - a.data.sortBy[0];
    }
    return b.data.sortBy[1] - a.data.sortBy[1];
  });

  const startAngle = 0; // Starting angle
  const endAngle = 2 * Math.PI; // Ending angle
  const radius = Math.min(width - 2 * margin, height - 2 * margin) / 2; // Outer radius
  d3.partition().size([endAngle - startAngle, radius])(root); // Polar coordinates: x (angle), y (radius)

  const arc = d3
    .arc()
    .startAngle((d) => d.x0 + startAngle)
    .endAngle((d) => d.x1 + startAngle)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, (2 * arcPadding) / radius))
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - arcPadding);

  const svg = d3
    .create("svg")
    .attr("viewBox", [
      2 * margin - width / 2,
      2 * margin - height / 2,
      width,
      height,
    ])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-size", "0.8rem")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-size", "1.5rem")
    .text(data.title);

  const cell = svg.selectAll("a").data(root.descendants()).join("a");

  cell
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => d.data.color || "rgba(0,0,0,0)");

  cell
    .filter((d) => ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
    .append("text")
    .attr("transform", (d) => {
      if (!d.depth) return;
      const x = (((d.x0 + d.x1) / 2 + startAngle) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    })
    .attr("dy", "0.32em")
    .text((d) => {
      if (d.data.children) {
        return;
      }
      const maxLength = 30;
      const str = d.data.title;
      if (str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
      }
      return str;
    });

  cell.append("title").text((d) => d.data.info);

  return svg.node();
}
