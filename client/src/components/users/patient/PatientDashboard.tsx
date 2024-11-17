import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import envConfig from "../../../envConfig.js";

// import NavbarPatient from "./sections/header/NavbarPatient.jsx";
import QuickActions from "./sections/QuickActionsPatient.jsx";

import MainSectionPatient from "./sections/MainSectionPatient.jsx";
import Footer from "../../ui/Footer.jsx";

export default function PatientDashboard() {
  const [name, setName] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-patient-name`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setName(response.data); // Set the name in state
      } catch (error) {
        console.error("Error fetching patient name:", error);
        // Handle error appropriately
      }
    };
    fetchUserName();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-pink-50 shadow-2xl rounded-lg">
      {/* <NavbarPatient /> */}
      {/* <NavbarPatient linkTo={"/patient/dashboard"} /> */}
      <main className="flex-1 container min-h-screen mx-auto px-4 py-8">
        <MainSectionPatient user={name.firstName} />
        <QuickActions />
      </main>
    </div>
  );
}
