import { readJsonFile } from "./data.js";

let userLanguage = null;
let data = null;

export function getUserLanguage() {
  /* const userLanguage =
    (navigator.language || navigator.userLanguage) == "fr-CA" ? "fr" : "en"; */
  userLanguage = userLanguage || "en";
  return userLanguage;
}

export async function getTranslations() {
  data =
    data ||
    (await readJsonFile("./lang/tds-dietary-exposure-translations.json"));
  return data;
}

export async function getTranslation(id) {
  return await data.data[id][getUserLanguage()];
}
