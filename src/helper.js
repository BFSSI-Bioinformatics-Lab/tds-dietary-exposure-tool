export function normalizeAgeSexGroup(ageSexGroup) {
  let age = "";
  let sex = "";
  for (let i = 0; i < ageSexGroup.length; i++) {
    if (ageSexGroup[i] == "F") {
      sex = "Female";
    } else if (ageSexGroup[i] == "M") {
      sex = "Male";
    } else if (!isNaN(ageSexGroup[i])) {
      while (
        i < ageSexGroup.length &&
        ageSexGroup[i] != " " &&
        (!isNaN(ageSexGroup[i]) ||
          ageSexGroup[i] == "+" ||
          ageSexGroup[i] == "-")
      ) {
        age += ageSexGroup[i];
        i++;
      }
    }

    if (age != "" && sex != "") break;
  }
  sex = sex == "" ? "Both" : sex;
  if (age == "1+") age = "All ages (1+)";
  return "Age " + age + ", " + sex;
}

export function sortAgeSexGroup(a, b) {
  // Special case
  if (a.includes("(1+)")) {
    if (b.includes("(1+)")) {
      return a.localeCompare(b);
    }
    return -1;
  } else if (b.includes("(1+)")) {
    return 1;
  }

  // General case
  const regex = /\d+/g;
  const aNumbers = a.match(regex).map(Number);
  const bNumbers = b.match(regex).map(Number);
  for (let i = 0; i < Math.min(aNumbers.length, bNumbers.length); i++) {
    if (aNumbers[i] !== bNumbers[i]) {
      return aNumbers[i] - bNumbers[i];
    }
  }
  return a.localeCompare(b);
}

export function resultValueToNanoGramsPerGram(value, unitOfMeasurement) {
  /*
   * unitOfMeasurment: "ng/g" | "ng/ml" | "µg/g" |"pg/g" | "Bq/Kg"
   */

  switch (unitOfMeasurement) {
    case "ng/g":
      return value;
    case "ng/ml":
      return value * 1e3;
    case "pg/g":
      return value * 1e6;
    case "Bq/Kg":
      return value * 1e-3 * 1e-9;
    default:
      // "µg/g"
      return value * 1e3;
  }
}

export function formatFoodCompositeLabel(foodCopmositeLabel) {
  return foodCopmositeLabel.replace(/_/g, ", ");
}
