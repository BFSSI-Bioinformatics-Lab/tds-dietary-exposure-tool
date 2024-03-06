import { el } from "../const.js";

/*
 *
 * Display a color legend on the provided HTML element
 *
 * Parameters:
 * - data: An object mapping labels to colors for display
 * - title: The title of the legend
 *
 */
export function displayColorLegend(data, title) {
  el.graphs.legend.title.innerHTML = title

  const contentEl = el.graphs.legend.content;
  contentEl.innerHTML = "";

  Object.keys(data).forEach((label) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("graph-legend-item");

    const colorEl = document.createElement("div");
    const labelEl = document.createElement("div");
    colorEl.classList.add("graph-legend-item-color");

    colorEl.style.backgroundColor = data[label];
    labelEl.innerHTML = label;

    itemEl.append(colorEl);
    itemEl.append(label);
    contentEl.appendChild(itemEl);
  });
}
