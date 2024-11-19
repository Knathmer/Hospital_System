import React from "react";
import Footer from "../../ui/Footer.jsx";
import QuickActionsDoctor from "./sections/QuickActionsDoctor.jsx";
import MainSectionDoctor from "./sections/MainSectionDoctor.jsx";

export default function DoctorDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <main className="flex-1 min-h-screen mx-auto px-4 py-8">
        <MainSectionDoctor user={" "} />
        <QuickActionsDoctor />
      </main>
      <Footer />
    </div>
  );
}