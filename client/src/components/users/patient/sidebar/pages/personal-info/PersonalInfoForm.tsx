// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  UserPlus,
  Edit2,
} from "lucide-react";
import Label from "../../../../../ui/Label";
import Input from "../../../../../ui/Input";
import Checkbox from "../../../../../ui/Checkbox";
import DefaultButton from "../../../../../ui/buttons/DefaultButton";
import FormSubmitButton from "../../../../../ui/buttons/FormSubmitButton";

import axios from "axios";
// import Link from "next/link"

const fetchPersonalInfoData = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }
    // Fetch insurance information
    const response = await axios.get(
      "http://localhost:3000/auth/patient/personal-info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Personal Info Select Result:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching personal info:", error);
  }
};

const formatDateForInput = (dateString) => {
  if (!dateString) return ""; // Handle empty case
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    //country: "",
    emergencyContactFirstName: "",
    emergencyContactLastName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const loadPersonalInfoData = async () => {
      let data = await fetchPersonalInfoData();

      let pInfo = data[0];
      let pAddr = data[1];
      let pEContact = data[2];

      console.log("pInfo: ", pInfo[0]);
      if (pInfo.length > 0) {
        pInfo = pInfo[0];
        setFormData((prevData) => ({
          ...prevData,
          firstName: pInfo.firstName,
          lastName: pInfo.lastName,
          dateOfBirth: formatDateForInput(pInfo.dateOfBirth),
          gender: pInfo.gender,
          email: pInfo.email,
          phone: pInfo.phoneNumber,
        }));
      }

      console.log("pAddr: ", pAddr[0]);
      if (pAddr.length > 0) {
        pAddr = pAddr[0];
        setFormData((prevData) => ({
          ...prevData,
          streetAddress: pAddr.addrStreet || "",
          city: pAddr.addrCity || "",
          state: pAddr.addrState || "",
          zipCode: pAddr.addrZip || "",
        }));
      }

      console.log("pEContact: ", pEContact[0]);
      if (pEContact.length > 0) {
        pEContact = pEContact[0];
        setFormData((prevData) => ({
          ...prevData,
          emergencyContactFirstName: pEContact.firstName,
          emergencyContactLastName: pEContact.lastName,
          emergencyContactRelationship: pEContact.relationship,
          emergencyContactPhone: pEContact.emergencyPhoneNumber,
          emergencyContactEmail: pEContact.emergencyEmail,
        }));
      }
    };
    if (!isEditing) {
      loadPersonalInfoData();
    }
  }, [!isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [error, setError] = useState("");

  const updatePersonalInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(
        "http://localhost:3000/auth/patient/update-personal-info",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        console.log("Update Personal info Successful!");
      } else {
        setError("Update Personal Info failed. Please try again.");
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
      console.error("Personal Info error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    updatePersonalInfo();

    setError("");

    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <Link
              to="#"
              className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Personal Information
              </h1>
              <DefaultButton onClick={() => setIsEditing(!isEditing)}>
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
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                  <User className="h-5 w-5 mr-2 text-pink-500" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="dateOfBirth"
                      className="text-sm font-medium text-gray-700"
                    >
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      type="date"
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-gray-700"
                    >
                      Gender
                    </Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      className="mt-1"
                      required
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                  Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="streetAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-700"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="state"
                      className="text-sm font-medium text-gray-700"
                    >
                      State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="zipCode"
                      className="text-sm font-medium text-gray-700"
                    >
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  {/* <div>
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div> */}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-pink-500" />
                  Emergency Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="emergencyContactFirstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </Label>
                    <Input
                      id="emergencyContactFirstName"
                      name="emergencyContactFirstName"
                      value={formData.emergencyContactFirstName}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="emergencyContactLastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="emergencyContactLastName"
                      name="emergencyContactLastName"
                      value={formData.emergencyContactLastName}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="emergencyContactRelationship"
                      className="text-sm font-medium text-gray-700"
                    >
                      Relationship
                    </Label>
                    <Input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="emergencyContactPhone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      type="tel"
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="emergencyContactEmail"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="emergencyContactEmail"
                      type="email"
                      name="emergencyContactEmail"
                      value={formData.emergencyContactEmail}
                      className="mt-1"
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end space-x-4">
                {isEditing && (
                  <>
                    <DefaultButton
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </DefaultButton>
                    <DefaultButton type="submit">
                      Update Personal Information
                    </DefaultButton>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
