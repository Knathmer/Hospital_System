import { useState } from 'react'
import { Heart, Calendar, FileText, CalendarClock } from "lucide-react"
// import { Link } from 'react-router-dom';

// Sidebar Components
import LogoSidebar from '../dashboards/patient/sidebar/sidebarItems/UserLogoSidebar';
// import PatientNameDisplay from '../dashboards/patient/sidebar/sidebarItems/WelcomeUserName';
import DoctorNameDisplay from '../dashboards/patient/sidebar/sidebarItems/WelcomeDocName';
import UserSettingsAndLogout from '../dashboards/patient/sidebar/sidebarItems/BottomItemsSidebar';
import SidebarToggleButton from '../ui/buttons/SidebarToggleButton';

// Files Linked

export default function DocDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const sidebarItems = {
  
    "Services": [
      { id: 'dashboard', label: 'Home', icon: Heart },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'schedule', label: 'Schedule', icon: CalendarClock },
      { id: 'patients-list', label: 'Patient', icon: FileText },
    //   { id: 'patient-records', label: 'Medication', icon: PillBottle },
    ],
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`transform transition-transform duration-300 fixed h-screen z-50 ${
          isSidebarVisible ? 'translate-x-0 w-64' : '-translate-x-64 w-0'
        } bg-white border-r flex flex-col justify-between`}
      >
        <div>
          <div className="p-4 border-b">
            {/* WomenWell - logo */}
            < LogoSidebar />
            
            {/* User Profile Image and Name */}
            < DoctorNameDisplay />
          </div>
          
          <nav className="p-4">
            {Object.keys(sidebarItems).map((category) => (
              <div key={category} className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{category}</h4>
                {sidebarItems[category].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
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


      {/* Main Content */}
    <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </h1>
        
       {/* Link pages here to according sidebar items */}
        {activeTab === 'dashboard' && (
            <div>
            <p className="text-gray-700">Place dashboard file here</p>
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