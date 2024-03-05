import {
  contaminentOccurenceFileNames,
  el,
  foodConsumptionFileNames,
} from "./const.js";
import { readCSV } from "./data.js";
import { getAgeSexGroupInfo, getYear } from "./helper.js";

export async function downloadDataTable(dataToDownload) {
  let data;

  const id = document.querySelector(".active-graph-select")?.id.split("-")[0];
  const filters = {
    chemicalGroup: el.chemicalGroupFilter.value,
    chemicalName: el.chemicalFilter.value,
    years: Array.from(el.yearFilter.selectedOptions).map(
      (option) => option.value,
    ),
    ageSexGroups: Array.from(el[id + "AgeSexGroupFilter"].selectedOptions).map(
      (option) => option.value,
    ),
    ageSexGroupsIsAgeGroups: id == "rbasg",
  };

  if (dataToDownload == "consumption") {
    data = await downloadConsumptionData(filters);
  } else if (dataToDownload == "contaminent") {
    data = await downloadContaminentData(filters);
  }

  for (const d of data) {
    const csvContent = d3.csvFormat(d);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.download = `${d.fileName}, Data Export, ${new Date().toLocaleString(
      "en-US",
    )}`;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

async function downloadConsumptionData(filters) {
  let filtered_data = [];

  for (const dataInfo of [
    {
      fileName: foodConsumptionFileNames.foodConsumptionPerKgBwFileName,
      exportFileName: "Food Consumption per Kg BW per Day",
    },
    {
      fileName: foodConsumptionFileNames.foodConsumptionPerPersonFileName,
      exportFileName: "Food Consumption per Person per Day",
    },
  ]) {
    const data = await readCSV(dataInfo.fileName);

    const fd = data.filter((row) => {
      const [ageSexGroup, age, _] = getAgeSexGroupInfo(row["population"]);
      return (
        row["Population_group"] == "All people" &&
        filters.ageSexGroups.includes(
          filters.ageSexGroupsIsAgeGroups ? age : ageSexGroup,
        )
      );
    });

    fd.fileName = dataInfo.exportFileName;
    filtered_data.push(fd);
  }

  return filtered_data;
}

async function downloadContaminentData(filters) {
  let filtered_data = [];

  for (const fileName of contaminentOccurenceFileNames) {
    const data = await readCSV(fileName);
    const chemicalGroup = data[0]["Analyte Group"];
    if (chemicalGroup != filters.chemicalGroup) {
      continue;
    }
    const fd = data.filter((row) => {
      return (
        row["Analyte Name"] == filters.chemicalName &&
        filters.years.includes(getYear(row))
      );
    });
    fd.fileName = filters.chemicalGroup + ", " + filters.chemicalName;
    filtered_data.push(fd);
    break;
  }

  return filtered_data;
}
