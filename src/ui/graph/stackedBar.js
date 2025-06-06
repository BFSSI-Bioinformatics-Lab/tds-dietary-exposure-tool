/**
 * Generate a stacked bar SVG based on input data
 *
 * Parameters:
 * - data.titleX: The title for the x-axis
 * - data.titleY: The title for the y-axis
 * - data.hr: If provided, a horizontal rule will be placed at this y value
 * - data.children: Child nodes with specific properties
 *   - value: Numeric value associated with the node
 *   - color: Color code for the node
 *   - stack: Stack that the node belongs to
 *   - entry: Entry that the node belongs to. Every entry (values on the x-axis) has one child for every stack.
 *   - info: Additional information for the node tooltip
 *   - sortBy: Value to consider for this node when sorting
 *
 * Returns:
 * - Generated stacked bar SVG as a string
 */
export function getStackedBarSvg(data) {
  if ($.isEmptyObject(data)) return;
  let dataExists = false;

  const width = 1500;
  const height = 600;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 140;
  const marginLeft = 100;

  const series = d3
    .stack()
    .keys(
      d3.union(
        data.children.map((d) => {
          if (d.value) {
            dataExists = true;
          }
          return d.stack;
        }),
      ),
    )
    .value(([, D], key) => D.get(key).value)(
    d3.index(
      data.children,
      (d) => d.entry,
      (d) => d.stack,
    ),
  );

  if (!dataExists) {
    return;
  }

  const x = d3
    .scaleBand()
    .domain(
      new Set(
        data.children
          .sort((a, b) => a.sortBy - b.sortBy)
          .map((obj) => obj.entry),
      ),
    )
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain(
      (() => {
        let max = d3.max(series, (d) => d3.max(d, (d) => d[1]));
        if (data.hr && data.hr > max) {
          max = data.hr;
        }
        return [0, max];
      })(),
    )
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
    .data(series)
    .join("g")
    .attr(
      "fill",
      (d) => data.children.find((child) => child.stack == d.key).color,
    )
    .selectAll("rect")
    .data((D) => D.map((d) => ((d.key = D.key), d)))
    .join("rect")
    .attr("x", (d) => x(d.data[0]))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .append("title")
    .text(
      (d) =>
        data.children.find(
          (child) => child.stack == d.key && child.entry == d.data[0],
        ).info,
    );

  /* Horizontal Axis */

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
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

  /* Horizontal Refernence Line */

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
