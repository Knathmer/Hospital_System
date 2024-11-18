import { useState, useEffect } from "react";
import {
  House,
  FolderHeart,
  UserRoundSearch,
  CalendarSearch,
  PillBottle,
  CreditCard,
  Tablets,
  BookOpen,
  NotebookPen
  FileHeart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Sidebar Components
import LogoSidebar from "./sidebarItems/UserLogoSidebar";
import UserSettingsAndLogout from "./sidebarItems/BottomItemsSidebar";
import SidebarToggleButton from "../ui/buttons/SidebarToggleButton";
import AdminNameDisplay from "./sidebarItems/WelcomeAdminName";

// Files Linked
import AdminDashboard from "../users/admin/adminDashboard/AdminDashboard";
import PrescriptionSummaryReport from "../users/admin/reports/PrescriptionSummaryReport";
import AppointmentAnalytics from "../users/admin/sections/appointmentReport/appointmentAnalytics";
import DoctorReports from "../users/admin/reports/adminDoctorReport";
import DoctorManagement from "../users/admin/sections/doctorManagement/doctorManagement";
import PatientManagement from "../users/admin/sections/patientManagement/patientManagement";

import RegisterDoctor from "../users/admin/sections/doctorRegistration";

import PatientReports from "../users/admin/sections/patientReport/PatientReport";


export default function AdminSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = {
    "Admin Services": [{ id: "dashboard", label: "Dashboard", icon: House }],
    "Manage User": [
      { id: "manage-patients", label: "Patient Profiles", icon: FolderHeart },
      { id: "manage-doctors", label: "Doctor Profiles", icon: UserRoundSearch },
      { id: "register-doctor", label: "Doctor Registration", icon: NotebookPen },
    ],
    "Data Reports": [
      { id: "billing-data", label: "Financial Overview", icon: CreditCard },
      {
        id: "prescription-analysis",
        label: "Prescription Analysis",
        icon: PillBottle,
      },
      {
        id: "appointment-data",
        label: "Appointment Metrics",
        icon: CalendarSearch,
      },
      { id: "doctor-data", label: "Doctor Reports", icon: BookOpen}, //Icon is currently placeholder
      { id: "patient-data", label: "Patient Reports", icon: FileHeart},
    ],
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/admin/dashboard?tab=${tabId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`transform transition-transform duration-300 fixed h-screen z-50 ${
          isSidebarVisible ? "translate-x-0 w-64" : "-translate-x-64 w-0"
        } bg-white border-r flex flex-col justify-between overflow-y-auto`}
      >
        <div>
          <div className="p-4 border-b">
            <LogoSidebar />
            <AdminNameDisplay />
          </div>
          <nav className="p-4">
            {Object.keys(sidebarItems).map((category) => (
              <div key={category} className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {category}
                </h4>
                {sidebarItems[category].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === item.id
                        ? "text-pink-600 bg-pink-100"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <UserSettingsAndLogout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </aside>

      {/* Sidebar Toggle Button */}
      <SidebarToggleButton
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <main
        className={`p-8 flex-1 transition-all duration-300 min-h-screen ${
          isSidebarVisible ? "ml-64" : "ml-0"
        }`}
      >
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "manage-patients" && <PatientManagement />}
        {activeTab === "manage-doctors" && <DoctorManagement />}
        {activeTab === "register-doctor" && <RegisterDoctor />}
        {activeTab === "billing-data" && <div>bill stuff</div>}
        {activeTab === "prescription-analysis" && (
          <div>
            <PrescriptionSummaryReport />
          </div>
        )}

        {activeTab === "appointment-data" && <AppointmentAnalytics />}
        
        {activeTab === "doctor-data" && <DoctorReports />}
        {activeTab === "patient-data" && <PatientReports />}
        
      </main>
    </div>
  );
}
