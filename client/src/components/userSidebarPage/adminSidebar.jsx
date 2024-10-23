import { useState } from 'react'
import { Heart, House, Logs, UserRoundPen ,Settings, LogOut, UserCog, ChartSpline , ShieldAlert} from "lucide-react"
import { Link } from 'react-router-dom';
import AdminDashboard from './doctorSidebarItems/admin-dashboard';

export default function SimplifiedDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const sidebarItems = {
    "Quick Access": [
        { id: 'dashboard', label: 'Home', icon: House },
        { id: 'recent-activity', label: 'Recent Activity', icon: Logs },
    ],
    "User & Role Management": [
      { id: 'manage-user', label: 'Manage user', icon: UserCog},
      { id: 'patients-records', label: 'Edit Patient Records', icon: UserRoundPen },
      { id: 'user-logs', label: 'Access Logs', icon: Logs},
    ],
    "Reports & Insights": [
    { id: 'reports', label: 'Reports', icon: ChartSpline},
    { id: 'security', label: 'Security Alerts', icon: ShieldAlert},
    ],
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">WomenWell</span>
            </Link>
            {/* User Profile Image */}
            <div className="flex items-center mt-6 p-4 bg-pink-50 rounded-lg shadow-md">
              <div className="mr-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Doctor"
                  className="w-20 h-20 rounded-full object-cover border-2 border-pink-500"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-pink-600">Welcome</h2>
                <p className="text-sm text-gray-700">Dr. John Doe</p>
              </div>
            </div>
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
        <div className="p-4 border-t">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account Settings</h4>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab === 'settings' ? 'text-pink-600 bg-pink-100' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>

          <button className="flex items-center w-full px-4 py-2 mt-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
    <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </h1>

       {/* Link pages here to according sidebar items */}
        {activeTab === 'dashboard' && (
            <div>
            <p className="text-gray-700">{<AdminDashboard/>}</p>
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