/**
 * Generate a sunburst SVG based on input data
 *
 * Parameters:
 * - data.titleX: Title for the x-axis
 * - data.titleY: Title for the y-axis
 * - data.hr: If provided, a horizontal rule will be placed at this y value
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
  const marginBottom = 100;
  const marginLeft = 100;

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

  const y = d3
    .scaleLinear()
    .domain(
      (() => {
        let max = d3.max(data.children, (d) => d.value);
        if (data.hr && data.hr > max) {
          max = data.hr;
        }
        return [0, max];
      })(),
    )
    .nice()
    .rangeRound([height - marginBottom, marginTop]);

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

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

  /* Horizontal Axis */

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(fx).tickSizeOuter(0))
    .call((g) => g.selectAll(".domain").remove())
    .selectAll("text")
    .attr("class", "graph-x-axis-text")
    .style("text-anchor", "end")
    .attr("dx", "-.2em")
    .attr("dy", ".8em")
    .attr("transform", "rotate(-45)");

  svg
    .append("line")
    .attr("x1", marginLeft)
    .attr("y1", height - marginBottom + 1)
    .attr("x2", marginLeft)
    .attr("y2", marginTop)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - marginTop)
    .text(data.titleX)
    .attr("class", "graph-axis-title")
    .attr("fill", "var(--fontColour)");

  /* Vertical Axis */

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call((g) => g.selectAll(".domain").remove())
    .selectAll("text")
    .attr("class", "graph-y-axis-text");

  svg
    .append("line")
    .attr("x1", marginLeft)
    .attr("y1", height - marginBottom)
    .attr("x2", width)
    .attr("y2", height - marginBottom)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", (height - marginBottom) / 2)
    .attr("transform", `rotate(-90, 20, ${(height - marginBottom) / 2})`)
    .style("text-anchor", "middle")
    .text(data.titleY)
    .attr("class", "graph-axis-title")
    .attr("fill", "var(--fontColour)");

  /* Horizontal Reference Line */

  if (data.hr) {
    svg
      .append("line")
      .attr("x1", marginLeft)
      .attr("y1", y(data.hr))
      .attr("x2", width - marginRight)
      .attr("y2", y(data.hr))
      .attr("stroke", "red")
      .attr("stroke-width", 2);
  }

  return svg.node();
}
