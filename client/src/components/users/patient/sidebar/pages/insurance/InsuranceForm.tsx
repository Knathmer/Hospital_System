// md:grid-cols-2
import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../../../../../ui/Label";
import Input from "../../../../../ui/Input";
//import Select from "../../../../../ui/select/Select";
import SelectItem from "../../../../../ui/select/SelectItem";
import Checkbox from "../../../../../ui/Checkbox";
import FormSubmitButton from "../../../../../ui/buttons/FormSubmitButton";
import Select from "react-select";

import axios from "axios";

// import Link from "next/link"

const insuranceOptions = [
  {
    label: "Blue Cross Blue Shield",
    coverage: ["PPO", "HMO", "POS"],
    value: "bcbs",
  },
  { label: "Aetna", coverage: ["PPO", "HMO", "EPO", "POS"], value: "atena" },
  { label: "Cigna", coverage: ["PPO", "HMO", "POS", "HDHP"], value: "cigna" },
  {
    label: "UnitedHealthcare",
    coverage: ["PPO", "HMO", "POS", "HDHP"],
    value: "uHealth",
  },
  { label: "Humana", coverage: ["PPO", "HMO", "POS"], value: "humana" },
  {
    label: "Anthem",
    coverage: ["PPO", "HMO", "EPO", "Medicaid"],
    value: "anthem",
  },
  {
    label: "Molina Healthcare",
    coverage: ["PPO", "HMO", "Medicaid"],
    value: "mHealth",
  },
];

export default function InsuranceForm() {
  const [formData, setFormData] = useState({
    providerName: "",
    policyNum: null,
    covDetails: "",
    covExpDate: null,
  });

  const [error, setError] = useState("");

  const [coverageOptions, setCoverageOptions] = useState<{ label: string }[]>(
    []
  );

  const handleChange = (e) => {
    //e is the event object
    const { name, value } = e.target; //Breaks down the element where changes took place into name and value (Destructuring input)
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/auth/patient/insurance",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        console.log("Add Insurance Successful!");
        nav("/patient/dashboard?tab=insurance");
      } else {
        setError("Add Insurance failed. Please try again.");
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

  useEffect(() => {
    if (formData.providerName) {
      // Find the selected provider and extract the coverage options
      const selectedProvider = insuranceOptions.find(
        (option) => option.label === formData.providerName
      );

      // Set the coverage options for the selected provider
      if (selectedProvider) {
        setCoverageOptions(
          selectedProvider.coverage.map((coverage) => ({
            label: coverage,
            value: coverage.toLowerCase,
          }))
        );
      } else {
        // If no provider found, reset coverage options to empty
        setCoverageOptions([]);
      }
    } else {
      // If no provider is selected, reset coverage options to empty
      setCoverageOptions([]);
    }
  }, [formData.providerName]);

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/patient/dashboard?tab=dashboard"
            className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-6">Insurance Information</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Primary Insurance</h2>
              <div className="grid grid-cols-1  gap-4 ">
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>

                  <Select
                    placeholder="Provider Name"
                    options={insuranceOptions}
                    isClearable
                    onChange={(option) =>
                      setFormData({
                        ...formData,
                        providerName: option ? option.label : "", // Update provider name
                        // Reset coverage when provider changes
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    type="text"
                    id="policyNum"
                    name="policyNum"
                    value={formData.policyNum}
                    onChange={handleChange}
                    maxLength={12}
                    required
                  />
                </div>
                {/* <div>
                  <Label htmlFor="groupNumber">Group Number</Label>
                  <Input id="groupNumber" />
                </div> */}
                {/* <div>
                  <Label htmlFor="policyHolderName">Policy Holder Name</Label>
                  <Input id="policyHolderName" required />
                </div> */}
                {/* <div>
                  <Label htmlFor="policyHolderDOB">
                    Policy Holder Date of Birth
                  </Label>
                  <Input id="policyHolderDOB" type="date" required />
                </div> */}
                {/* <div>
                  <Label htmlFor="relationshipToPatient">
                    Relationship to Patient
                  </Label>
                  <Select
                    id="relationshipToPatient"
                    name="relationshipToPatient"
                  >
                    <SelectItem value="">Select relationship</SelectItem>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </Select>
                </div> */}
                <div>
                  <Label htmlFor="coverageDetails">Coverage Details</Label>
                  {/* <Input
                    type="text"
                    id="covDetails"
                    name="covDetails"
                    placeholder="e.g., PPO, HMO, etc."
                    value={formData.covDetails}
                    onChange={handleChange}
                    required
                  /> */}
                  <Select
                    options={coverageOptions}
                    isClearable
                    placeholder={"Coverage Plan"}
                    onChange={(option) =>
                      option
                        ? setFormData({
                            ...formData,
                            covDetails: option ? option.label : "",
                          })
                        : null
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="coverageExpirationDate">
                    Coverage Expiration Date
                  </Label>
                  <Input
                    id="covExpDate"
                    name="covExpDate"
                    type="date"
                    value={formData.covExpDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* <div className="space-y-4">
              <h2 className="text-xl font-semibold">Secondary Insurance</h2>
              <div>
                <Label>Do you have secondary insurance?</Label>
                <RadioGroup defaultValue="no">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="secondary-yes" />
                    <Label htmlFor="secondary-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="secondary-no" />
                    <Label htmlFor="secondary-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="secondaryProvider">Insurance Provider</Label>
                  <Input id="secondaryProvider" />
                </div>
                <div>
                  <Label htmlFor="secondaryPolicyNumber">Policy Number</Label>
                  <Input id="secondaryPolicyNumber" />
                </div>
                <div>
                  <Label htmlFor="secondaryGroupNumber">Group Number</Label>
                  <Input id="secondaryGroupNumber" />
                </div>
                <div>
                  <Label htmlFor="secondaryPolicyHolderName">
                    Policy Holder Name
                  </Label>
                  <Input id="secondaryPolicyHolderName" />
                </div>
                <div>
                  <Label htmlFor="secondaryCoverageDetails">
                    Coverage Details
                  </Label>
                  <Input
                    id="secondaryCoverageDetails"
                    placeholder="e.g., PPO, HMO, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryCoverageExpirationDate">
                    Coverage Expiration Date
                  </Label>
                  <Input id="secondaryCoverageExpirationDate" type="date" />
                </div>
              </div>
            </div> */}

            {/* <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="consentToVerify" />
                  <Label htmlFor="consentToVerify">
                    I consent to have my insurance eligibility verified
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="consentToBill" />
                  <Label htmlFor="consentToBill">
                    I consent to have my insurance billed for services rendered
                  </Label>
                </div>
              </div>
            </div> */}

            {/* <div className="space-y-4">
              <h2 className="text-xl font-semibold">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Name</Label>
                  <Input id="emergencyContactName" required />
                </div>
                <div>
                  <Label htmlFor="emergencyContactRelationship">
                    Relationship
                  </Label>
                  <Input id="emergencyContactRelationship" required />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                  <Input id="emergencyContactPhone" type="tel" required />
                </div>
              </div>
            </div> */}

            <div className="flex justify-end space-x-4">
              <FormSubmitButton />
            </div>
          </form>
        </div>
      </main>
      {/* <footer className="bg-white border-t py-6 px-4 md:px-6">
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
      </footer> */}
    </div>
  );
}
