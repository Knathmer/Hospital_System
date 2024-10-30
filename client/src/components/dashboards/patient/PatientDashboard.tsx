import React from "react";
import { Link } from "react-router-dom";

// import NavbarPatient from "./sections/header/NavbarPatient.jsx";
import QuickActions from "./sections/QuickActionsPatient.jsx";

import MainSectionPatient from "./sections/MainSectionPatient.jsx";
import Footer from "../../ui/Footer.jsx";

export default function PatientDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      {/* <NavbarPatient /> */}
      {/* <NavbarPatient linkTo={"/patient/dashboard"} /> */}
      <main className="flex-1 min-h-screen mx-auto px-4 py-8">
        <MainSectionPatient user={"Sarah"} />
        <QuickActions />
      </main>
      <Footer />
    </div>
  );
}
