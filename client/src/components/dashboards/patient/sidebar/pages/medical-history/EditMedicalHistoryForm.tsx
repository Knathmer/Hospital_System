"use client";

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
// import Link from "next/link"
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DefaultButton from "../../../../../ui/buttons/DefaultButton";
import Label from "../../../../../ui/Label";
import Input from "../../../../../ui/Input";
import Checkbox from "../../../../../ui/Checkbox";
import SelectItem from "../../../../../ui/select/SelectItem";
import Select from "../../../../../ui/select/Select";
import axios from "axios";

export default function EditMedicalHistoryForm() {
  const [error, setError] = useState("");
  const [vaccines, setVaccines] = useState([
    { name: "", date: "", doctor: "" },
  ]);
  const [medications, setMedications] = useState([{ name: "" }]);
  const [surgeries, setSurgeries] = useState([{ name: "", date: "" }]);
  const [allergies, setAllergies] = useState([
    { name: "", reaction: "", severity: "" },
  ]);
  const [disabilities, setDisabilities] = useState([{ name: "" }]);

  const [removedMeds, setRemovedMeds] = useState([{ name: "" }]);
  const [removedVacs, setRemovedVacs] = useState([
    { name: "", date: "", doctor: "" },
  ]);
  const [removedSurs, setRemovedSurs] = useState([{ name: "", date: "" }]);
  const [removedAllerg, setRemovedAllerg] = useState([
    { name: "", reaction: "", severity: "" },
  ]);
  const [removedDisas, setRemovedDisas] = useState([{ name: "" }]);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    allAllergies: allergies,
    removedAllergies: removedAllerg,
    allDisabilities: disabilities,
    removedDisabilities: removedDisas,
    allMedications: medications,
    removedMedications: removedMeds,
    allVaccines: vaccines,
    removedVaccines: removedVacs,
    allSurgeries: surgeries,
    removedSurgeries: removedSurs,
  });

  const addMedication = () => {
    setMedications([...medications, { name: "" }]);
  };

  const removeMedication = (index: number) => {
    setRemovedMeds([...removedMeds, { name: medications[index].name }]);
    setMedications(medications.filter((_, i) => i !== index));
  };

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

  const addDisability = () => {
    setDisabilities([...disabilities, { name: "" }]);
  };

  const removeDisability = (index: number) => {
    setRemovedDisas([...removedDisas, { name: disabilities[index].name }]);
    setDisabilities(disabilities.filter((_, i) => i !== index));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const toDictAllergy = (list) => {
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

  const toDictVaccine = (list) => {
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

  const toDictSurgery = (list) => {
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

  const toDictDisability = (list) => {
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

  const toDictMedication = (list) => {
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

  // Update formData whenever any related state changes
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      allAllergies: allergies,
      removedAllergies: removedAllerg,
      allDisabilities: disabilities,
      removedDisabilities: removedDisas,
      allMedications: medications,
      removedMedications: removedMeds,
      allVaccines: vaccines,
      removedVaccines: removedVacs,
      allSurgeries: surgeries,
      removedSurgeries: removedSurs,
    }));
  }, [
    allergies,
    removedAllerg,
    disabilities,
    removedDisas,
    medications,
    removedMeds,
    vaccines,
    removedVacs,
    surgeries,
    removedSurs,
  ]);

  useEffect(() => {
    // Fetch data from backend
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
      } catch (error) {
        console.error("Error fetching medical history:", error);
      }
    };
    if (!isEditing) {
      fetchData();
    }
  }, [!isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.delete(
        "http://localhost:3000/auth/patient/remove-medical-history",

        {
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        console.log("Add Medical History Successful!");
      } else {
        setError("Add Medical History failed. Please try again.");
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
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
        <Link className="flex items-center justify-center" to="#">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="ml-2 text-2xl font-bold text-gray-900">
            WomenWell
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#"
          >
            Appointments
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#"
          >
            Profile
          </Link>
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/patient/dashboard"
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
              <h2 className="text-xl font-semibold">Family Medical History</h2>
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
              <h2 className="text-xl font-semibold">Allergies</h2>
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
                    disabled={!isEditing}
                  />
                  <Input
                    placeholder="Reaction"
                    value={allergy.reaction}
                    onChange={(e) => {
                      const newAllergies = [...allergies];
                      newAllergies[index].reaction = e.target.value;
                      setAllergies(newAllergies);
                    }}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
              <h2 className="text-xl font-semibold">Current Medications</h2>
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
                    disabled={!isEditing}
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
              <h2 className="text-xl font-semibold">Vaccination History</h2>
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
                    disabled={!isEditing}
                  />
                  <Input
                    type="date"
                    value={vaccine.date}
                    onChange={(e) => {
                      const newVaccines = [...vaccines];
                      newVaccines[index].date = e.target.value;
                      setVaccines(newVaccines);
                    }}
                    disabled={!isEditing}
                  />
                  <Input
                    placeholder="Doctor name"
                    value={vaccine.doctor}
                    onChange={(e) => {
                      const newVaccines = [...vaccines];
                      newVaccines[index].doctor = e.target.value;
                      setVaccines(newVaccines);
                    }}
                    disabled={!isEditing}
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
              <h2 className="text-xl font-semibold">Disability Information</h2>
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
                    disabled={!isEditing}
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
              <h2 className="text-xl font-semibold">Previous Surgeries</h2>
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
                    disabled={!isEditing}
                  />
                  <Input
                    type="date"
                    value={surgery.date}
                    onChange={(e) => {
                      const newSurgeries = [...surgeries];
                      newSurgeries[index].date = e.target.value;
                      setSurgeries(newSurgeries);
                    }}
                    disabled={!isEditing}
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
      </main>
      <footer className="bg-white border-t py-6 px-4 md:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500">
            © 2024 WomenWell. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Privacy Policy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Terms of Use
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Contact Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
