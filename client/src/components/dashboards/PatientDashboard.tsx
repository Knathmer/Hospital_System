import React from "react";
import { Link } from "react-router-dom";

import NavbarPatient from "../ui/dashboard/patient/navbarPatient.jsx";
import QuickActions from "../ui/dashboard/patient/sections/quickActions.jsx";

import MainSectionPatient from "../ui/dashboard/patient/sections/mainSectionPatient.jsx";

export default function PatientDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient />
      <main className="flex-1 min-h-screen mx-auto px-4 py-8">
        <MainSectionPatient user="Sarah" />
        <QuickActions />
      </main>
      <footer className="bg-white border-t py-6 px-4 md:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500">
            © 2024 PatientPortal. All rights reserved.
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
