import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  User,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import Button from "../ui/button.jsx";
import NavbarPatient from "../ui/dashboard/patient/navbarPatient.jsx";
import QuickActions from "../ui/dashboard/patient/sections/quickActions.jsx";
import UpcomingAppointmentsContainer from "../ui/dashboard/patient/sections/containers/upcomingAppointmentsContainer.jsx";
import TestResultsContainer from "../ui/dashboard/patient/sections/containers/testResultsContainer.jsx";

export default function PatientDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <NavbarPatient />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome back, Sarah</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UpcomingAppointmentsContainer />
          <TestResultsContainer />
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="h-5 w-5 text-pink-500 mr-2" />
              Notifications
            </h2>
            <ul className="space-y-2">
              <li className="text-sm">
                Reminder: Your annual check-up is in 2 weeks
              </li>
              <li className="text-sm">
                New message from Dr. Johnson about your recent lab results
              </li>
            </ul>
            <Button variant="outline" className="mt-4">
              See All Notifications
            </Button>
          </div>
        </div>
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
