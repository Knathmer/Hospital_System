import React from "react";
import { Link } from "react-router-dom";

import NavbarPatient from "./sections/header/navbarPatient.jsx";
import QuickActions from "./sections/quickActions.jsx";

import MainSectionPatient from "./sections/mainSectionPatient.jsx";
import Footer from "../../ui/footer.jsx";

export default function PatientDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient />
      <main className="flex-1 min-h-screen mx-auto px-4 py-8">
        <MainSectionPatient user={"Sarah"} />
        <QuickActions />
      </main>
      <Footer />
    </div>
  );
}
