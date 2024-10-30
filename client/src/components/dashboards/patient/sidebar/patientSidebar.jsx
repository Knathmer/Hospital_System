import { useState } from 'react';
import { Heart, Calendar, FileText, PillBottle, CreditCard, ShieldPlus} from 'lucide-react';
import { Link } from 'react-router-dom';

// Sidebar items/sections
import LogoSidebar from './sidebarItems/UserLogoSidebar.jsx';
import UserSettingsAndLogout from './sidebarItems/BottomItemsSidebar.jsx';
import UserNameDisplay from './sidebarItems/WelcomeUserName.jsx';

// Files attached to sidebar item
import PatientDashboard from '../PatientDashboard.tsx';
import SidebarToggleButton from '../../../ui/buttons/SidebarToggleButton.jsx';

export default function PatientSidebar() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const sidebarItems = {
    'Patient Services': [
      { id: 'dashboard', label: 'Dashboard', icon: Heart },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'medical-records', label: 'Medical Records', icon: FileText },
      { id: 'medication', label: 'Medication', icon: PillBottle },
    ],
    'Billing & Payments': [
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'insurance', label: 'Insurance', icon: ShieldPlus },
    ],
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
            <UserNameDisplay />
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
            <PatientDashboard />
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
  );
}