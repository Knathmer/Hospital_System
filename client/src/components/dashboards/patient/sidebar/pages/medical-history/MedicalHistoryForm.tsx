import React, { useState, useEffect } from "react";

import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import NavbarPatient from "../../../sections/header/navbarPatient";
import FamilyHistory from "./sections/familyHistory";
import Surgeries from "./sections/surgeries";
import Disabilities from "./sections/disabilities";
import Vaccines from "./sections/vaccines";
import Medications from "./sections/medications";
import Footer from "../../../../../ui/footer";
import Allergies from "./sections/allergies";
import FormSubmitButton from "../../../../../ui/buttons/formSubmitButton";
import AdditionalInfo from "./sections/additionalInfo";
import axios from "axios";

export default function MedicalHistoryForm() {
  const [allergies, setAllergies] = useState([
    { name: null, reaction: null, severity: "" },
  ]);
  const [disabilities, setDisablilities] = useState([{ name: "" }]);
  const [vaccines, setVaccines] = useState([
    { name: "", date: "", doctor: null },
  ]);
  const [surgeries, setSurgeries] = useState([
    { name: "", date: "", doctor: null },
  ]);
  const [formData, setFormData] = useState({
    allAllergies: allergies,
    allDisabilities: disabilities,
    allVaccines: vaccines,
    allSurgeries: surgeries,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Update formData when allergies change
  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      allAllergies: allergies,
      allDisabilities: disabilities,
      allVaccines: vaccines,
      allSurgeries: surgeries,
    }));
  }, [allergies, disabilities, vaccines, surgeries]);

  // const handleChange = (e) => {
  //   //e is the event object
  //   const { name, value } = e.target; //Breaks down the element where changes took place into name and value (Destructuring input)
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:3000/auth/patient/medical-history",
        formData,
        {
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
  };
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/patient/dashboard"
            className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-6">Medical History Form</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FamilyHistory />

            <Allergies allergies={allergies} setAllergies={setAllergies} />

            <Medications />

            <Vaccines vaccines={vaccines} setVaccines={setVaccines} />

            <Disabilities
              disabilities={disabilities}
              setDisablilities={setDisablilities}
            />

            <Surgeries surgeries={surgeries} setSurgeries={setSurgeries} />

            <AdditionalInfo />

            <FormSubmitButton />
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
