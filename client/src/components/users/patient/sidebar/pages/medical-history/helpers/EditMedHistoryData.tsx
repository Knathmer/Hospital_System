import React, { useState } from "react";

export const useAllergyState = () => {
  // Base allergy
  const [allergies, setAllergies] = useState([
    { name: "", reaction: "", severity: "" },
  ]);

  // Removed allergy
  const [removedAllerg, setRemovedAllerg] = useState([
    { name: "", reaction: "", severity: "" },
  ]);

  // Functions
  const addAllergy = () => {
    setAllergies([...allergies, { name: "", reaction: "", severity: "" }]);
  };

  const removeAllergy = (index: number) => {
    setRemovedAllerg([
      ...removedAllerg,
      {
        name: allergies[index].name,
        reaction: allergies[index].reaction,
        severity: allergies[index].severity,
      },
    ]);
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  return {
    allergies,
    setAllergies,
    addAllergy,
    removeAllergy,
    removedAllerg,
    setRemovedAllerg,
  };
};

export const useMedicationState = () => {
  const [medications, setMedications] = useState([{ name: "" }]);

  const [removedMeds, setRemovedMeds] = useState([{ name: "" }]);

  const addMedication = () => {
    setMedications([...medications, { name: "" }]);
  };

  const removeMedication = (index: number) => {
    setRemovedMeds([...removedMeds, { name: medications[index].name }]);
    setMedications(medications.filter((_, i) => i !== index));
  };

  return {
    medications,
    setMedications,
    addMedication,
    removeMedication,
    removedMeds,
    setRemovedMeds,
  };
};

export const useVaccineState = () => {
  const [vaccines, setVaccines] = useState([
    { name: "", date: "", doctor: "" },
  ]);

  const [removedVacs, setRemovedVacs] = useState([
    { name: "", date: "", doctor: "" },
  ]);

  const addVaccine = () => {
    setVaccines([...vaccines, { name: "", date: "", doctor: "" }]);
  };

  const removeVaccine = (index: number) => {
    console.log("removedVacs0: ", removedVacs);
    // Create the new removed vaccine object
    const removedVaccine = {
      name: vaccines[index].name,
      date: vaccines[index].date,
      doctor: vaccines[index].doctor,
    };

    setRemovedVacs((prevRemovedVacs) => [...prevRemovedVacs, removedVaccine]);
    console.log("removedVacs: ", removedVacs);
    setVaccines(vaccines.filter((_, i) => i !== index));
  };

  return {
    vaccines,
    setVaccines,
    addVaccine,
    removeVaccine,
    removedVacs,
    setRemovedVacs,
  };
};

export const useDisabilityState = () => {
  const [disabilities, setDisabilities] = useState([{ name: "" }]);
  const [removedDisas, setRemovedDisas] = useState([{ name: "" }]);

  const addDisability = () => {
    setDisabilities([...disabilities, { name: "" }]);
  };

  const removeDisability = (index: number) => {
    setRemovedDisas([...removedDisas, { name: disabilities[index].name }]);
    setDisabilities(disabilities.filter((_, i) => i !== index));
  };

  return {
    disabilities,
    setDisabilities,
    addDisability,
    removeDisability,
    removedDisas,
    setRemovedDisas,
  };
};

export const useSurgeryState = () => {
  const [surgeries, setSurgeries] = useState([{ name: "", date: "" }]);

  // Removed variables

  const [removedSurs, setRemovedSurs] = useState([{ name: "", date: "" }]);

  const addSurgery = () => {
    setSurgeries([...surgeries, { name: "", date: "" }]);
  };

  const removeSurgery = (index: number) => {
    setRemovedSurs([
      ...removedSurs,
      { name: surgeries[index].name, date: surgeries[index].date },
    ]);
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  return {
    surgeries,
    setSurgeries,
    addSurgery,
    removeSurgery,
    removedSurs,
    setRemovedSurs,
  };
};
