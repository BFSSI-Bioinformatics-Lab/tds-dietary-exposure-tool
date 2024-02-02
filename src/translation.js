/* const userLanguage =
  (navigator.language || navigator.userLanguage) == "fr-CA" ? "fr" : "en"; */

const userLanguage = "en";
let data = null;

async function readJsonFile(fileName) {
  try {
    const response = await fetch(fileName);
    if (!response.ok) {
      throw new Error(`Failed to load JSON file, status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
  }
}
export async function initPage() {
  data = (await readJsonFile("./lang/tds-dietary-exposure-translations.json"))
    .data;

  Object.keys(data).forEach((key) => {
    if (data[key].static) {
      document.getElementById(key).innerHTML =
        data[key][userLanguage]
          .replaceAll("<", "&lt")
          .replaceAll("\n", "<br/>") + document.getElementById(key).innerHTML;
    }
  });
}

export async function getTranslation(id) {
  const userLanguage = "en";
  return await data[id][userLanguage];
}
