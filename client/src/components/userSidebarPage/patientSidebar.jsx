import { useState } from 'react'
import { Heart, Calendar, FileText, PillBottle, CreditCard, ShieldPlus,Settings, LogOut } from "lucide-react"
import { Link } from 'react-router-dom';

export default function SimplifiedDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const sidebarItems = {
    "Patient Services": [
      { id: 'dashboard', label: 'Dashboard', icon: Heart },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'medical-records', label: 'Medical Records', icon: FileText },
      { id: 'medication', label: 'Medication', icon: PillBottle },
    ],
    "Billing & Payments": [
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'insurance', label: 'Insurance', icon: ShieldPlus },
    ],
    // this is commented out incase we want to move these items up
    // "Account Settings": [
    //   { id: 'settings', label: 'Settings', icon: Settings },
    //   { id: 'logout', label: 'Logout', icon: LogOut },
    // ]
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
          </div>
          <nav className="p-4">
            {Object.keys(sidebarItems).map((category) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                {sidebarItems[category].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-semibold rounded-lg ${
                      activeTab === item.id ? 'text-pink-600 bg-pink-50' : 'text-gray-600 hover:bg-gray-100'
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
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Account Settings</h4>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-2 text-sm font-semibold rounded-lg ${
              activeTab === 'settings' ? 'text-pink-600 bg-pink-50' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>

          <button className="flex items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-gray-600 rounded-lg hover:bg-gray-100">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
    <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </h1>
        
        {activeTab === 'dashboard' && (
            <div>
            <p className="text-gray-600">Place dashboard file here</p>
            </div>
        )}

        {activeTab === 'appointments' && (
            <div>
            <p className="text-gray-600">place appoint file here.</p>
            {/* Add appointments content here */}
            </div>
        )}

        {/* Similar blocks for other tabs like medical-records, medication, billing, insurance, etc. */}
    </main>
    </div>
  )
}
