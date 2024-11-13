import { useState, useEffect } from 'react'
import { Heart, House, CalendarSearch,  PillBottle, UserRoundSearch ,FolderHeart, CreditCard} from "lucide-react"
import { useLocation, useNavigate } from 'react-router-dom';

// Sidebar Components
import LogoSidebar from './sidebarItems/UserLogoSidebar';
import UserSettingsAndLogout from './sidebarItems/BottomItemsSidebar';
import SidebarToggleButton from '../ui/buttons/SidebarToggleButton';
import AdminNameDisplay from './sidebarItems/WelcomeAdminName';

// Files Linked
import AdminDashboard from '../users/admin/adminDashboard/AdminDashboard';

export default function AdminSidebar() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = {
    "Admin Services": [
        { id: 'dashboard', label: 'Dashboard', icon: House },
    ],
    "Manage User":[
        { id: 'patient-data', label: 'Patient Profiles', icon: FolderHeart },
        { id: 'doctor-data', label: 'Doctor Profiles', icon: UserRoundSearch },
    ],
    "Data Reports": [
      { id: 'billing-data', label: 'Fianical Overview', icon: CreditCard },
      { id: 'prescription-data', label: 'Prescription Analysis', icon: PillBottle },
      { id: 'appointment-data', label: 'Appointment Metrics', icon: CalendarSearch },
    ],
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/doctor/dashboard?tab=${tabId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`transform transition-transform duration-300 fixed h-screen z-50 ${
          isSidebarVisible ? 'translate-x-0 w-64' : '-translate-x-64 w-0'
        } bg-white border-r flex flex-col justify-between`}
      >
        <div>
          <div className="p-4 border-b">
            {/* WomenWell - logo */}
            <LogoSidebar />

            {/* User Profile Image and Name */}
            < AdminNameDisplay />
          </div>

          <nav className="p-4">
            {Object.keys(sidebarItems).map((category) => (
              <div key={category} className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{category}</h4>
                {sidebarItems[category].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === item.id ? 'text-pink-600 bg-pink-100' : 'text-gray-600 hover:bg-gray-200'
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

        {/* User Settings and Logout at the bottom */}
        <UserSettingsAndLogout activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Sidebar Toggle Button near the top, imported as a separate component */}
      <SidebarToggleButton isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

      {/* Main Content - Adjust width based on sidebar visibility */}
      <main
        className={`p-8 flex-1 transition-all duration-300 min-h-screen ${
          isSidebarVisible ? 'ml-64' : 'ml-0'
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </h1>

        {/* Link pages here according to sidebar items */}
        {activeTab === 'dashboard' && (
          <div>
            <p className="text-gray-700">{<AdminDashboard />}</p>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <p className="text-gray-700">Place appointment file here.</p>
            {/* Add appointments content here */}
          </div>
        )}
      </main>
    </div>
  )
}
