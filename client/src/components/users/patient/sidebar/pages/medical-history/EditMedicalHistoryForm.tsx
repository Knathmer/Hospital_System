import {
  Heart,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Users,
  Pill,
  Syringe,
  Stethoscope,
  Accessibility,
  AlertCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DefaultButton from "../../../../../ui/buttons/DefaultButton";
import Label from "../../../../../ui/Label";
import Input from "../../../../../ui/Input";
import Checkbox from "../../../../../ui/Checkbox";
import SelectItem from "../../../../../ui/select/SelectItem";
import Select from "../../../../../ui/select/Select";
import axios from "axios";

import {
  useAllergyState,
  useMedicationState,
  useVaccineState,
  useDisabilityState,
  useSurgeryState,
} from "./helpers/EditMedHistoryData";

import {
  toDictAllergy,
  toDictMedication,
  toDictVaccine,
  toDictDisability,
  toDictSurgery,
} from "./helpers/EditMedicalToDict";

import { formatDateForInput } from "../personal-info/PersonalInfoForm";

export default function EditMedicalHistoryForm() {
  const [error, setError] = useState("");

  const {
    vaccines,
    setVaccines,
    addVaccine,
    removeVaccine,
    removedVacs,
    setRemovedVacs,
  } = useVaccineState();

  const {
    medications,
    setMedications,
    addMedication,
    removeMedication,
    removedMeds,
    setRemovedMeds,
  } = useMedicationState();

  const {
    surgeries,
    setSurgeries,
    addSurgery,
    removeSurgery,
    removedSurs,
    setRemovedSurs,
  } = useSurgeryState();

  const {
    allergies,
    setAllergies,
    addAllergy,
    removeAllergy,
    removedAllerg,
    setRemovedAllerg,
  } = useAllergyState();

  const {
    disabilities,
    setDisabilities,
    addDisability,
    removeDisability,
    removedDisas,
    setRemovedDisas,
  } = useDisabilityState();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    allAllergies: allergies,

    allDisabilities: disabilities,

    allMedications: medications,

    allVaccines: vaccines,

    allSurgeries: surgeries,
  });

  const [formDataRemoved, setFormDataRemoved] = useState({
    removedAllergies: removedAllerg,
    removedDisabilities: removedDisas,
    removedMedications: removedMeds,
    removedVaccines: removedVacs,
    removedSurgeries: removedSurs,
  });

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Update formData whenever any related state changes
  useEffect(() => {
    const filteredAllergies = allergies.filter((allergy) => allergy.name);
    console.log("allergy filter", filteredAllergies);
    const filteredDisabilites = disabilities.filter(
      (disability) => disability.name
    );
    console.log("disablilty filter", filteredDisabilites);
    const filteredVaccines = vaccines.filter((vaccine) => vaccine.name);
    console.log("vaccine unfilter", vaccines);
    console.log("vaccine filter", filteredVaccines);
    const filteredSurgeries = surgeries.filter((surgery) => surgery.name);
    console.log("surgeries filter", filteredSurgeries);
    setFormData((prevFormData) => ({
      ...prevFormData,
      allAllergies: allergies,
      allDisabilities: disabilities,
      allMedications: medications,
      allVaccines: vaccines,
      allSurgeries: surgeries,
    }));
  }, [allergies, disabilities, medications, vaccines, surgeries]);

  // Update formDataRemoved whenever any related state changes
  useEffect(() => {
    setFormDataRemoved((prevFormData) => ({
      ...prevFormData,
      removedAllergies: removedAllerg,
      removedDisabilities: removedDisas,
      removedMedications: removedMeds,
      removedVaccines: removedVacs,
      removedSurgeries: removedSurs,
    }));
  }, [removedAllerg, removedDisas, removedMeds, removedVacs, removedSurs]);

  // Step 2: Save initial values to a ref or a separate state
  const [initialFormData, setInitialFormData] = useState(formData);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        "http://localhost:3000/auth/patient/medical-history-info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); //
      if (!response) throw new Error("Network response was not ok");

      console.log("response-med-info2:", response.data.data[0].medication);

      const allergy = toDictAllergy(response.data.data[0].allergy);
      const vaccine = toDictVaccine(response.data.data[0].vaccine);
      const surgery = toDictSurgery(response.data.data[0].surgery);
      const disability = toDictDisability(response.data.data[0].disability);
      const medication = toDictMedication(response.data.data[0].medication);
      // Set the state with fetched data
      setVaccines(vaccine);
      setSurgeries(surgery);
      setAllergies(allergy);
      setDisabilities(disability);
      setMedications(medication);

      setInitialFormData(formData);
    } catch (error) {
      console.error("Error fetching medical history:", error);
    }
  };

  useEffect(() => {
    // On component mount, save the initial form data
    setInitialFormData(formData);
  }, [!isEditing]);

  useEffect(() => {
    // Fetch data from backend
    fetchData();
    if (!isEditing) {
      fetchData();
    }
  }, [!isEditing]);

  const removeMedicalHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.delete(
        "http://localhost:3000/auth/patient/remove-medical-history",

        {
          data: formDataRemoved,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        console.log("Remove Medical History Successful!");
      } else {
        setError("Remove Medical History failed. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Medical History error:", error);
    }
  };

  const updateMedicalHistory = async () => {
    try {
      console.log("ENTER UPDATEMEDHISTORY CLIENT: ");
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }
      console.log("FORM DATA: ", formData);
      console.log("INITIAL FORM DATA: ", initialFormData);
      let filteredFormData = {
        allAllergies: formData.allAllergies.filter(
          (allergy) =>
            !initialFormData.allAllergies.some(
              (initAllergy) =>
                initAllergy.name.trim().toLowerCase() ===
                allergy.name.trim().toLowerCase()
            )
        ),
        allDisabilities: formData.allDisabilities.filter(
          (disability) =>
            !initialFormData.allDisabilities.some(
              (initDis) =>
                initDis.name.trim().toLocaleLowerCase() ===
                disability.name.trim().toLowerCase()
            )
        ),
        allMedications: formData.allMedications.filter(
          (medication) =>
            !initialFormData.allMedications.some(
              (initMed) =>
                initMed.name.trim().toLowerCase() ===
                medication.name.trim().toLowerCase()
            )
        ),
        allVaccines: formData.allVaccines.filter(
          (vaccine) =>
            !initialFormData.allVaccines.some(
              (initVac) =>
                initVac.name.trim().toLowerCase() ===
                vaccine.name.trim().toLowerCase()
            )
        ),
        allSurgeries: formData.allSurgeries.filter(
          (surgery) =>
            !initialFormData.allSurgeries.some(
              (initSurg) =>
                initSurg.name.trim().toLowerCase() ===
                surgery.name.trim().toLowerCase()
            )
        ),
      };

      filteredFormData = {
        allAllergies: filteredFormData.allAllergies.filter(
          (allergy) => allergy.name
        ),
        allDisabilities: filteredFormData.allDisabilities.filter(
          (disability) => disability.name
        ),
        allMedications: filteredFormData.allMedications.filter(
          (medication) => medication.name
        ),
        allVaccines: filteredFormData.allVaccines.filter(
          (vaccine) => vaccine.name
        ),
        allSurgeries: filteredFormData.allSurgeries.filter(
          (surgery) => surgery.name
        ),
      };

      console.log("FILTERED FORM DATA: ", filteredFormData);
      //setFormData(filteredFormData);

      const response = await axios.post(
        "http://localhost:3000/auth/patient/update-medical-history",
        filteredFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        console.log("Update Medical History Successful!");
      } else {
        setError("Update Medical History failed. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Medical History error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    removeMedicalHistory();
    updateMedicalHistory();

    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 shadow-2xl rounded-lg">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <Link
              to="/patient/dashboard?tab=dashboard"
              className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Medical History Form</h1>
              <DefaultButton
                onClick={toggleEditMode}
                className="bg-pink-500 text-white hover:bg-pink-600"
              >
                {isEditing ? (
                  <>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </DefaultButton>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* <div className="space-y-4">
              <h2 className="text-xl font-semibold">Medical History</h2>
              <div>
                <Label>Do you have any allergies?</Label>
                <RadioGroup defaultValue="no" disabled={!isEditing}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="allergies-yes" />
                    <Label htmlFor="allergies-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="allergies-no" />
                    <Label htmlFor="allergies-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="allergies">If yes, please list your allergies:</Label>
                <Textarea id="allergies" placeholder="Enter your allergies here" disabled={!isEditing} />
              </div>
            </div> */}

              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-pink-500" />
                  Family Medical History
                </h2>
                <div className="space-y-2">
                  <Label>
                    Has anyone in your family been diagnosed with the following?
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Heart Disease",
                      "Diabetes",
                      "Cancer",
                      "High Blood Pressure",
                      "Stroke",
                      "Mental Illness",
                    ].map((condition) => (
                      <div
                        key={condition}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={condition.toLowerCase().replace(/\s/g, "-")}
                          disabled={!isEditing}
                        />
                        <Label
                          htmlFor={condition.toLowerCase().replace(/\s/g, "-")}
                        >
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-pink-500" />
                  Allergies
                </h2>
                {allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Allergy name"
                      value={allergy.name}
                      onChange={(e) => {
                        const newAllergies = [...allergies];
                        newAllergies[index].name = e.target.value;
                        setAllergies(newAllergies);
                      }}
                      disabled={
                        (allergy.name ===
                          initialFormData.allAllergies[index]?.name &&
                          initialFormData.allAllergies[index]?.name) ||
                        !isEditing
                      }
                    />
                    <Input
                      placeholder="Reaction"
                      value={allergy.reaction}
                      onChange={(e) => {
                        const newAllergies = [...allergies];
                        newAllergies[index].reaction = e.target.value;
                        setAllergies(newAllergies);
                      }}
                      disabled={
                        (allergy.reaction ===
                          initialFormData.allAllergies[index]?.reaction &&
                          initialFormData.allAllergies[index]?.reaction) ||
                        !isEditing
                      }
                    />

                    <Select
                      id="severity"
                      name="severity"
                      value={allergy.severity}
                      onChange={(e) => {
                        const newAllergies = [...allergies];
                        newAllergies[index].severity = e.target.value;
                        setAllergies(newAllergies);
                      }}
                      disabled={
                        (allergy.severity ===
                          initialFormData.allAllergies[index]?.severity &&
                          initialFormData.allAllergies[index]?.severity) ||
                        !isEditing
                      }
                    >
                      <SelectItem value=""> Select Severity</SelectItem>
                      <SelectItem value="Mild"> Mild</SelectItem>
                      <SelectItem value="Moderate"> Moderate</SelectItem>
                      <SelectItem value="Severe"> Severe</SelectItem>
                    </Select>

                    {isEditing && (
                      <DefaultButton
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAllergy(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DefaultButton>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <DefaultButton
                    type="button"
                    variant="outline"
                    onClick={addAllergy}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Allergy
                  </DefaultButton>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-pink-500" />
                  Current Medications
                </h2>
                {medications.map((medication, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Medication name"
                      value={medication.name}
                      onChange={(e) => {
                        const newMedications = [...medications];
                        newMedications[index].name = e.target.value;
                        setMedications(newMedications);
                      }}
                      disabled={
                        (medication.name ===
                          initialFormData.allMedications[index]?.name &&
                          initialFormData.allMedications[index]?.name) ||
                        !isEditing
                      }
                    />

                    {isEditing && (
                      <DefaultButton
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedication(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DefaultButton>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <DefaultButton
                    type="button"
                    variant="outline"
                    onClick={addMedication}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </DefaultButton>
                )}
                {/* <div>
                <Label htmlFor="medications">
                  Please list any medications you are currently taking:
                </Label>
                <Textarea id="medications" placeholder="Enter your current medications here" disabled={!isEditing} />
              </div> */}
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Syringe className="h-5 w-5 mr-2 text-pink-500" />
                  Vaccination History
                </h2>
                {vaccines.map((vaccine, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Vaccine name"
                      value={vaccine.name}
                      onChange={(e) => {
                        const newVaccines = [...vaccines];
                        newVaccines[index].name = e.target.value;
                        setVaccines(newVaccines);
                      }}
                      disabled={
                        (vaccine.name ===
                          initialFormData.allVaccines[index]?.name &&
                          initialFormData.allVaccines[index]?.name) ||
                        !isEditing
                      }
                    />
                    <Input
                      type="date"
                      value={vaccine.date}
                      onChange={(e) => {
                        const newVaccines = [...vaccines];
                        newVaccines[index].date = e.target.value;
                        setVaccines(newVaccines);
                      }}
                      disabled={
                        (vaccine.date ===
                          initialFormData.allVaccines[index]?.date &&
                          initialFormData.allVaccines[index]?.date) ||
                        !isEditing
                      }
                    />
                    <Input
                      placeholder="Doctor name"
                      value={vaccine.doctor}
                      onChange={(e) => {
                        const newVaccines = [...vaccines];
                        newVaccines[index].doctor = e.target.value;
                        setVaccines(newVaccines);
                      }}
                      disabled={
                        (vaccine.doctor ===
                          initialFormData.allVaccines[index]?.doctor &&
                          initialFormData.allVaccines[index]?.doctor) ||
                        !isEditing
                      }
                    />

                    {isEditing && (
                      <DefaultButton
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeVaccine(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DefaultButton>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <DefaultButton
                    type="button"
                    variant="outline"
                    onClick={addVaccine}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vaccine
                  </DefaultButton>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Accessibility className="h-5 w-5 mr-2 text-pink-500" />
                  Disability Information
                </h2>
                {disabilities.map((disability, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Disability name"
                      value={disability.name}
                      onChange={(e) => {
                        const newDisabilities = [...disabilities];
                        newDisabilities[index].name = e.target.value;
                        setDisabilities(newDisabilities);
                      }}
                      disabled={
                        (disability.name ===
                          initialFormData.allDisabilities[index]?.name &&
                          initialFormData.allDisabilities[index]?.name) ||
                        !isEditing
                      }
                    />

                    {isEditing && (
                      <DefaultButton
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDisability(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DefaultButton>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <DefaultButton
                    type="button"
                    variant="outline"
                    onClick={addDisability}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Disability
                  </DefaultButton>
                )}
                {/* <div>
                <Label>Do you have any disabilities?</Label>
                <RadioGroup defaultValue="no" disabled={!isEditing}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="disability-yes" />
                    <Label htmlFor="disability-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="disability-no" />
                    <Label htmlFor="disability-no">No</Label>
                  </div>
                </RadioGroup>
              </div> */}
                {/* <div>
                <Label htmlFor="disabilities">
                  If yes, please describe your disabilities:
                </Label>
                <Textarea id="disabilities" placeholder="Enter your disability information here" disabled={!isEditing} />
              </div> */}
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-pink-500" />
                  Previous Surgeries
                </h2>
                {surgeries.map((surgery, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Surgery name"
                      value={surgery.name}
                      onChange={(e) => {
                        const newSurgeries = [...surgeries];
                        newSurgeries[index].name = e.target.value;
                        setSurgeries(newSurgeries);
                      }}
                      disabled={
                        (surgery.name ===
                          initialFormData.allSurgeries[index]?.name &&
                          initialFormData.allSurgeries[index]?.name) ||
                        !isEditing
                      }
                    />
                    <Input
                      type="date"
                      value={formatDateForInput(surgery.date)}
                      onChange={(e) => {
                        const newSurgeries = [...surgeries];
                        newSurgeries[index].date = e.target.value;
                        setSurgeries(newSurgeries);
                      }}
                      disabled={
                        (surgery.date ===
                          initialFormData.allSurgeries[index]?.date &&
                          initialFormData.allSurgeries[index]?.date) ||
                        !isEditing
                      }
                    />
                    {isEditing && (
                      <DefaultButton
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSurgery(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DefaultButton>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <DefaultButton
                    type="button"
                    variant="outline"
                    onClick={addSurgery}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Surgery
                  </DefaultButton>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <DefaultButton
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    Cancel
                  </DefaultButton>
                  <DefaultButton
                    type="submit"
                    className="bg-pink-500 text-white hover:bg-pink-600"
                  >
                    Update Medical History
                  </DefaultButton>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
