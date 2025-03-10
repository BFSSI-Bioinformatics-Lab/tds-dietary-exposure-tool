import { classes, el } from "../const.js";

/*
 * Display a color legend
 *
 * Parameters:
 * - data: An object mapping labels to colors for display
 * - title: The titleEl of the legend section
 */
export function displayColorLegendSection(data, title) {
  const legendSection = document.createElement("div");
  legendSection.classList.add(classes.GRAPH_LEGEND_SECTION);

  const titleEl = document.createElement("div");
  titleEl.classList.add(classes.GRAPH_LEGEND_TITLE);
  titleEl.innerHTML = title;

  const contentEl = document.createElement("div");
  contentEl.classList.add(classes.GRAPH_LEGEND_CONTENT);

  Object.values(data).forEach((mapping) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add(classes.GRAPH_LEGEND_ITEM);

    const colorEl = document.createElement("div");
    const labelEl = document.createElement("div");
    colorEl.classList.add(classes.GRAPH_LEGEND_COLOR);

    colorEl.style.backgroundColor = mapping.color;
    labelEl.innerHTML = mapping.label;

    itemEl.append(colorEl);
    itemEl.append(labelEl);
    contentEl.appendChild(itemEl);
  });

  legendSection.appendChild(titleEl);
  legendSection.appendChild(contentEl);

  el.graphs.legend.container.appendChild(legendSection);
}

export function displayTextLegendSection(data, title) {
  const legendSection = document.createElement("div");
  legendSection.classList.add(classes.GRAPH_LEGEND_SECTION);

  const titleEl = document.createElement("div");
  titleEl.classList.add(classes.GRAPH_LEGEND_TITLE);
  titleEl.innerHTML = title;

  const contentEl = document.createElement("div");
  contentEl.classList.add(classes.GRAPH_LEGEND_CONTENT);

  Object.values(data).forEach((mapping) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add(classes.GRAPH_LEGEND_ITEM);

    const labelEl = document.createElement("div");
    labelEl.innerHTML = mapping.short + " - " + mapping.label;

    itemEl.append(labelEl);
    contentEl.appendChild(itemEl);
  });

  legendSection.appendChild(titleEl);
  legendSection.appendChild(contentEl);

  el.graphs.legend.container.appendChild(legendSection);
}
