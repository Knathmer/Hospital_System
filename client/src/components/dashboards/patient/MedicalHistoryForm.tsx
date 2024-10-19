import React from "react";

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import NavbarPatient from "../../ui/dashboard/patient/navbarPatient";
import FamilyHistory from "../../ui/dashboard/patient/tabs/medical-history/sections/familyHistory";
import Surgeries from "../../ui/dashboard/patient/tabs/medical-history/sections/surgeries";
import Disabilities from "../../ui/dashboard/patient/tabs/medical-history/sections/disabilities";
import Vaccines from "../../ui/dashboard/patient/tabs/medical-history/sections/vaccines";
import Medications from "../../ui/dashboard/patient/tabs/medical-history/sections/medications";
import Footer from "../../ui/footer";
import Allergies from "../../ui/dashboard/patient/tabs/medical-history/sections/allergies";
import FormSubmitButton from "../../ui/buttons/formSubmitButton";
import AdditionalInfo from "../../ui/dashboard/patient/tabs/medical-history/sections/additionalInfo";

export default function MedicalHistoryForm() {
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
          <form className="space-y-6">
            <FamilyHistory />

            <Allergies />

            <Medications />

            <Vaccines />

            <Disabilities />

            <Surgeries />

            <AdditionalInfo />

            <FormSubmitButton />
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
