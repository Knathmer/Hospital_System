import { useState } from "react";
import DocAppointmentOverview from "./DocAppointmentOverview";
import DocAppointmentCalendar from "./DocAppointmentCalendar";

function DocAppointmentsPage() {
  const [view, setView] = useState("overview"); // 'overview' or 'calendar'

  const toggleView = () => {
    setView(view === "overview" ? "calendar" : "overview");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
          <button
            onClick={toggleView}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
          >
            {view === "overview" ? "View Calendar" : "View List"}
          </button>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {view === "overview" ? (
          <DocAppointmentOverview />
        ) : (
          <DocAppointmentCalendar />
        )}
      </main>
    </div>
  );
}

export default DocAppointmentsPage;
