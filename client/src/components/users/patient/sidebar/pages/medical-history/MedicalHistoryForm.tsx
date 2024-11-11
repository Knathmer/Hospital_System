import React, { useState, useEffect } from "react";

import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import NavbarPatient from "../../../sections/header/NavbarPatient";
import FamilyHistory from "./sections/FamilyHistory";
import Surgeries from "./sections/Surgeries";
import Disabilities from "./sections/Disabilities";
import Vaccines from "./sections/Vaccines";
import Medications from "./sections/Medications";
import Footer from "../../../../../ui/Footer";
import Allergies from "./sections/Allergies";
import FormSubmitButton from "../../../../../ui/buttons/FormSubmitButton";

import axios from "axios";

export default function MedicalHistoryForm() {
  const [allergies, setAllergies] = useState([
    { name: "", reaction: null, severity: null },
  ]);
  const [disabilities, setDisablilities] = useState([{ name: "" }]);
  const [vaccines, setVaccines] = useState([
    { name: "", date: null, doctor: null },
  ]);
  const [surgeries, setSurgeries] = useState([
    { name: "", date: null, doctor: null },
  ]);
  const [formData, setFormData] = useState({
    allAllergies: allergies,
    allDisabilities: disabilities,
    allVaccines: vaccines,
    allSurgeries: surgeries,
  });

  const [error, setError] = useState("");
  const nav = useNavigate();

  // Update formData when allergies change
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
    setFormData((prevState) => ({
      ...prevState,
      allAllergies: filteredAllergies,
      allDisabilities: filteredDisabilites,
      allVaccines: filteredVaccines,
      allSurgeries: filteredSurgeries,
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
        nav("/edit-medical-history");
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
      <NavbarPatient linkTo={"/patient/dashboard?tab=dashboard"} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/patient/dashboard?tab=dashboard"
            className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-6">Medical History Form</h1>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <FamilyHistory />

            <Allergies allergies={allergies} setAllergies={setAllergies} />

            <Medications />

            <Vaccines vaccines={vaccines} setVaccines={setVaccines} />

            <Disabilities
              disabilities={disabilities}
              setDisablilities={setDisablilities}
            />

            <Surgeries surgeries={surgeries} setSurgeries={setSurgeries} />

            <FormSubmitButton />
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
