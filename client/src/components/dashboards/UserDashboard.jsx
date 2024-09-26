import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Import components for different dashboard sections
// import AdminDashboard from './AdminDashboard';
// import DoctorDashboard from './DoctorDashboard';
// import PatientDashboard from './PatientDashboard';

const UserDashboard = ({ userRole }) => {
  // Define available routes for each role
  const roleRoutes = {
    admin: [
      { path: 'overview', component: AdminDashboard, label: 'Overview' },
      { path: 'users', component: AdminUserManagement, label: 'User Management' },
      { path: 'reports', component: AdminReports, label: 'Reports' },
    ],
    doctor: [
      { path: 'overview', component: DoctorDashboard, label: 'Overview' },
      { path: 'appointments', component: DoctorAppointments, label: 'Appointments' },
      { path: 'patients', component: DoctorPatients, label: 'Patients' },
    ],
    patient: [
      { path: 'overview', component: PatientDashboard, label: 'Overview' },
      { path: 'appointments', component: PatientAppointments, label: 'My Appointments' },
      { path: 'records', component: PatientRecords, label: 'Medical Records' },
    ],
  };

  const routes = roleRoutes[userRole] || roleRoutes.patient;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Welcome, {userRole}</p>
        </div>
        <nav className="mt-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-10">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="/" element={<Navigate to="overview" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// Placeholder components for different dashboard sections
// const AdminUserManagement = () => <div>Admin User Management</div>;
// const AdminReports = () => <div>Admin Reports</div>;
// const DoctorAppointments = () => <div>Doctor Appointments</div>;
// const DoctorPatients = () => <div>Doctor Patients</div>;
// const PatientAppointments = () => <div>Patient Appointments</div>;
// const PatientRecords = () => <div>Patient Medical Records</div>;

export default UserDashboard;