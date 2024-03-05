export function getSex(ageSexGroup) {
  let sex = "";
  for (let i = 0; i < ageSexGroup.length; i++) {
    if (ageSexGroup[i] == "F") {
      sex = "Female";
    } else if (ageSexGroup[i] == "M") {
      sex = "Male";
    }
    if (sex) break;
  }
  if (!sex) {
    sex = "Both";
  }
  return sex;
}

export function getAge(ageSexGroup) {
  let age = "";
  for (let i = 0; i < ageSexGroup.length; i++) {
    if (!isNaN(ageSexGroup[i])) {
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
    if (age) break;
  }
  return age;
}

export function sortAgeSexGroup(a, b) {
  const getRange = (age) => {
    let s = age.split("+");
    if (s.length == 2) {
      return [s[0], -1];
    } else {
      s = age.split("-");
      return [s[0], s[1]];
    }
  };

  const [aAge, aSex] = a.split(" ");
  const [bAge, bSex] = b.split(" ");

  const aAgeRange = getRange(aAge).map((s) => Number(s));
  const bAgeRange = getRange(bAge).map((s) => Number(s));

  if (aAge == bAge) {
    return aSex - bSex;
  } else if (aAgeRange[0] == bAgeRange[0]) {
    return aAgeRange[1] - bAgeRange[1];
  } else {
    return aAgeRange[0] - bAgeRange[0];
  }
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

export function lodOrMdlIsValid(chemicalGroup) {
  if (chemicalGroup == "Radionuclide") {
    return false;
  }
  return true;
}
