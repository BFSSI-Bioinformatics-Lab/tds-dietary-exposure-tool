/**
 * Generate a stacked bar SVG based on input data
 *
 * Parameters:
 * - data.titleX: The title for the x-axis
 * - data.titleY: The title for the y-axis
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
  if (!data) return;
  let dataExists = false;

  const width = 1500;
  const height = 600;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 60;
  const marginLeft = 60;

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
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
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

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call((g) => g.selectAll(".domain").remove());

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
