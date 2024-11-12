export const toDictAllergy = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [{ name: "", reaction: "", severity: "" }];
  }
  const listOfObjects = list.map((item) => {
    return {
      name: item.allergen || "",
      reaction: item.reaction || "",
      severity: item.severity || "",
    };
  });
  return listOfObjects;
};

export const toDictVaccine = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [{ name: "", date: "", doctor: "" }];
  }
  const listOfObjects = list.map((item) => {
    return {
      name: item.vaccineName ? item.vaccineName : "",
      date: item.dateAdministered || "",
      doctor: "",
    };
  });
  return listOfObjects;
};

export const toDictSurgery = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [{ name: "", date: "" }];
  }
  const listOfObjects = list.map((item) => {
    return {
      name: item.surgeryType || "",
      date: item.surgeryDateTime || "",
    };
  });
  return listOfObjects;
};

export const toDictDisability = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [{ name: "" }];
  }
  const listOfObjects = list.map((item) => {
    return {
      name: item.disabilityType || "",
    };
  });
  return listOfObjects;
};

export const toDictMedication = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [{ name: "" }];
  }
  const listOfObjects = list.map((item) => {
    console.log("item-med:");
    return {
      name: item.medicationName,
    };
  });
  return listOfObjects;
};
