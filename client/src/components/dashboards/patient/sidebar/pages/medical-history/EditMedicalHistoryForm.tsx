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
import React, { useState } from "react";
import DefaultButton from "../../../../../ui/buttons/DefaultButton";
import Label from "../../../../../ui/Label";
import Input from "../../../../../ui/Input";
import Checkbox from "../../../../../ui/Checkbox";

export default function EditMedicalHistoryForm() {
  const [vaccines, setVaccines] = useState([
    { name: "", date: "", doctor: "" },
  ]);
  const [surgeries, setSurgeries] = useState([{ name: "", date: "" }]);
  const [allergies, setAllergies] = useState([
    { name: "", reaction: "", severity: "" },
  ]);
  const [disabilities, setDisablilities] = useState([{ name: "" }]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    allAllergies: allergies,
    allDisabilities: disabilities,
    allVaccines: vaccines,
    allSurgeries: surgeries,
  });

  const addVaccine = () => {
    setVaccines([...vaccines, { name: "", date: "", doctor: "" }]);
  };

  const removeVaccine = (index: number) => {
    setVaccines(vaccines.filter((_, i) => i !== index));
  };

  const addSurgery = () => {
    setSurgeries([...surgeries, { name: "", date: "" }]);
  };

  const removeSurgery = (index: number) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  const addAllergy = () => {
    setAllergies([...allergies, { name: "", reaction: "", severity: "" }]);
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addDisability = () => {
    setDisablilities([...disabilities, { name: "" }]);
  };

  const removeDisability = (index: number) => {
    setDisablilities(disabilities.filter((_, i) => i !== index));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
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
            to="#"
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
          <form className="space-y-6">
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
              <h2 className="text-xl font-semibold">Current Medications</h2>
              <div>
                <Label htmlFor="medications">
                  Please list any medications you are currently taking:
                </Label>
                {/* <Textarea id="medications" placeholder="Enter your current medications here" disabled={!isEditing} /> */}
              </div>
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
              <div>
                <Label htmlFor="disabilities">
                  If yes, please describe your disabilities:
                </Label>
                {/* <Textarea id="disabilities" placeholder="Enter your disability information here" disabled={!isEditing} /> */}
              </div>
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

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <DefaultButton variant="outline">Save as Draft</DefaultButton>
                <DefaultButton className="bg-pink-500 text-white hover:bg-pink-600">
                  Submit Form
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
