import { classs, el } from "../const.js";

/*
 * Display a color legend on the provided HTML element
 *
 * Parameters:
 * - data: An object mapping labels to colors for display
 * - title: The title of the legend
 */
export function displayColorLegend(data, title) {
  el.graphs.legend.title.innerHTML = title;

  const contentEl = el.graphs.legend.content;
  contentEl.innerHTML = "";

  Object.values(data).forEach((mapping) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add(classs.GRAPH_LEGEND_ITEM);

    const colorEl = document.createElement("div");
    const labelEl = document.createElement("div");
    colorEl.classList.add(classs.GRAPH_LEGEND_COLOR);

    colorEl.style.backgroundColor = mapping.color;
    labelEl.innerHTML = mapping.label;

    itemEl.append(colorEl);
    itemEl.append(labelEl);
    contentEl.appendChild(itemEl);
  });
}
