import TotalUsersCharts from "./adminDashboardSections/AdminChart2";
import AppointmentOverview from "./adminDashboardSections/AdminChart1";
import UpcomingAppointments from "./adminDashboardSections/UpcomingAppointmentDashboardAdminDB";
import StatsOverview from "./adminDashboardSections/HeaderOverview";
import DoctorsList from "./adminDashboardSections/ListOfDoctorsAdminDB";

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Section 1: Stats Overview */}
      <StatsOverview />

      {/* Section 2 & 3: Patient Overview & ICU vs OPD Patients */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <AppointmentOverview />
        <TotalUsersCharts />
      </div>

      {/* Section 4 & 5: Upcoming Appointments & Doctors List */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <UpcomingAppointments />
        <DoctorsList />
      </div>
    </div>
  );
}
