import { useState } from 'react'
import { Heart, Calendar, FileText, Settings, LogOut } from "lucide-react"
import { Link } from 'react-router-dom';

export default function SimplifiedDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'medical-history', label: 'Medical History', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="ml-2 text-xl font-bold text-gray-900">WomenWell</span>
          </Link>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => (
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
          <button className="flex items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-gray-600 rounded-lg hover:bg-gray-100">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </h1>
        <p className="text-gray-600">
          Content for {activeTab} will be displayed here.
        </p>
      </main>
    </div>
  )
}
