/**
 * Generate a sunburst SVG based on input data
 *
 * Parameters:
 * - data.titleX: Title for the x-axis
 * - data.titleY: Title for the y-axis
 * - data.children: Child nodes with specific properties
 *   - value: Numeric value associated with the node
 *   - color: Color code for the node
 *   - group: Grouping that the node belongs to
 *   - entry: Entry that the node belongs to. Each entry on the x-axis has one child for every group.
 *   - info: Additional information for the node tooltip
 *
 * Returns:
 * - Generated sunburst SVG as a string
 */
export function getGroupedBarSvg(data) {
  if (!data) return;
  let dataExists = false;

  const width = 1500;
  const height = 600;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 60;
  const marginLeft = 60;

  // Prepare the scales for positional and color encodings.
  // Fx encodes the state.
  const fx = d3
    .scaleBand()
    .domain(new Set(data.children.map((d) => d.entry)))
    .rangeRound([marginLeft, width - marginRight])
    .paddingInner(0.1);

  const groups = new Set(data.children.map((d) => d.group));

  const x = d3
    .scaleBand()
    .domain(groups)
    .rangeRound([0, fx.bandwidth()])
    .padding(0.05);

  // Y encodes the height of the bar.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data.children, (d) => d.value)])
    .nice()
    .rangeRound([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Append a group for each state, and a rect for each age.
  svg
    .append("g")
    .selectAll()
    .data(d3.group(data.children, (d) => d.entry))
    .join("g")
    .attr("transform", ([entry]) => `translate(${fx(entry)}, 0)`)
    .selectAll()
    .data(([, d]) => d)
    .join("rect")
    .attr("x", (d) => x(d.group))
    .attr("y", (d) => {
      if (d.value != 0) {
        dataExists = true;
      }
      return y(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.value))
    .attr("fill", (d) => d.color)
    .append("title")
    .text((d) => d.info);

  if (!dataExists) {
    return;
  }

  // Append the horizontal axis.
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(fx).tickSizeOuter(0))
    .call((g) => g.selectAll(".domain").remove());

  // Append the vertical axis.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call((g) => g.selectAll(".domain").remove());

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - marginTop)
    .attr("class", "graph-axis-title")
    .style("text-anchor", "middle")
    .text(data.titleX);
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", height / 2)
    .attr("class", "graph-axis-title")
    .attr("transform", `rotate(-90, 15, ${height / 2})`)
    .style("text-anchor", "middle")
    .text(data.titleY);

  return svg.node();
}
