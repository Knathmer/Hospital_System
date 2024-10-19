import React from "react";

// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import Input from "../../ui/input";
import OnChangeInput from "../../ui/onChangeInput";
import OnClickButton from "../../ui/onClickButton";
import NavButton from "../../ui/navButton";

export default function MedicalHistoryForm() {
  const [vaccines, setVaccines] = useState([{ name: "", date: "" }]);
  const [surgeries, setSurgeries] = useState([{ name: "", date: "" }]);

  const addVaccine = () => {
    setVaccines([...vaccines, { name: "", date: "" }]);
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
          <h1 className="text-3xl font-bold mb-6">Medical History Form</h1>
          <form className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {/* <Label htmlFor="firstName">First Name</Label> */}
                  <Input id="firstName" isRequired={true} />
                </div>
                <div>
                  {/* <Label htmlFor="lastName">Last Name</Label> */}
                  <Input id="lastName" isRequired={true} />
                </div>
                <div>
                  {/* <Label htmlFor="dateOfBirth">Date of Birth</Label> */}
                  <Input id="dateOfBirth" type="date" isRequired={true} />
                </div>
                <div>
                  {/* <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Medical History</h2>
              <div>
                {/* <Label>Do you have any allergies?</Label> */}
                {/* <RadioGroup defaultValue="no"> */}
                <div className="flex items-center space-x-2">
                  {/* <RadioGroupItem value="yes" id="allergies-yes" />
                    <Label htmlFor="allergies-yes">Yes</Label> */}
                </div>
                <div className="flex items-center space-x-2">
                  {/* <RadioGroupItem value="no" id="allergies-no" />
                    <Label htmlFor="allergies-no">No</Label> */}
                </div>
                {/* </RadioGroup> */}
              </div>
              <div>
                {/* <Label htmlFor="allergies">
                  If yes, please list your allergies:
                </Label> */}
                {/* <Textarea
                  id="allergies"
                  placeholder="Enter your allergies here"
                /> */}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Current Medications</h2>
              <div>
                {/* <Label htmlFor="medications">
                  Please list any medications you are currently taking:
                </Label> */}
                {/* <Textarea
                  id="medications"
                  placeholder="Enter your current medications here"
                /> */}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Vaccination History</h2>
              {vaccines.map((vaccine, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <OnChangeInput
                    placeholder="Vaccine name"
                    value={vaccine.name}
                    onChange={(e) => {
                      const newVaccines = [...vaccines];
                      newVaccines[index].name = e.target.value;
                      setVaccines(newVaccines);
                    }}
                  />
                  <OnChangeInput
                    type="date"
                    value={vaccine.date}
                    onChange={(e) => {
                      const newVaccines = [...vaccines];
                      newVaccines[index].date = e.target.value;
                      setVaccines(newVaccines);
                    }}
                  />
                  <OnClickButton
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeVaccine(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </OnClickButton>
                </div>
              ))}
              <OnClickButton
                type="button"
                variant="outline"
                onClick={addVaccine}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vaccine
              </OnClickButton>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Disability Information</h2>
              <div>
                {/* <Label>Do you have any disabilities?</Label>
                <RadioGroup defaultValue="no">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="disability-yes" />
                    <Label htmlFor="disability-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="disability-no" />
                    <Label htmlFor="disability-no">No</Label>
                  </div>
                </RadioGroup> */}
              </div>
              <div>
                {/* <Label htmlFor="disabilities">
                  If yes, please describe your disabilities:
                </Label>
                <Textarea
                  id="disabilities"
                  placeholder="Enter your disability information here"
                /> */}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Previous Surgeries</h2>
              {surgeries.map((surgery, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <OnChangeInput
                    placeholder="Surgery name"
                    value={surgery.name}
                    onChange={(e) => {
                      const newSurgeries = [...surgeries];
                      newSurgeries[index].name = e.target.value;
                      setSurgeries(newSurgeries);
                    }}
                  />
                  <OnChangeInput
                    type="date"
                    value={surgery.date}
                    onChange={(e) => {
                      const newSurgeries = [...surgeries];
                      newSurgeries[index].date = e.target.value;
                      setSurgeries(newSurgeries);
                    }}
                  />
                  <OnClickButton
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSurgery(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </OnClickButton>
                </div>
              ))}
              <OnClickButton
                type="button"
                variant="outline"
                onClick={addSurgery}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Surgery
              </OnClickButton>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Family Medical History</h2>
              <div className="space-y-2">
                {/* <Label>
                  Has anyone in your family been diagnosed with the following?
                </Label> */}
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
                      {/* <Checkbox
                        id={condition.toLowerCase().replace(/\s/g, "-")}
                      />
                      <Label
                        htmlFor={condition.toLowerCase().replace(/\s/g, "-")}
                      >
                        {condition}
                      </Label> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <div>
                {/* <Label htmlFor="additionalInfo">
                  Is there anything else you would like us to know about your
                  medical history?
                </Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Enter any additional information here"
                /> */}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <NavButton variant="outline">Save as Draft</NavButton>
              <NavButton className="bg-pink-500 text-white hover:bg-pink-600">
                Submit Form
              </NavButton>
            </div>
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
