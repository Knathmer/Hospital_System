import React from 'react'
import Button from "../../ui/button"
import Input from "../../ui/input"
import { Hospital, Users, Calendar, Bell, Settings, LogOut, BarChart, UserPlus, FileText, AlertTriangle } from "lucide-react"
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
        <Link className="flex items-center justify-center" to="#">
          <Hospital className="h-6 w-6 text-pink-500" />
          <span className="ml-2 text-2xl font-bold text-gray-900">AdminPortal</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
            Staff
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
            Patients
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">
            Reports
          </Link>
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hospital Overview</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart className="h-5 w-5 text-pink-500 mr-2" />
              Hospital Statistics
            </h2>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Total Patients:</span> 1,245
              </li>
              <li>
                <span className="font-medium">Beds Occupied:</span> 78%
              </li>
              <li>
                <span className="font-medium">Average Wait Time:</span> 35 minutes
              </li>
              <li>
                <span className="font-medium">Surgeries Scheduled:</span> 12
              </li>
            </ul>
            <Button className="mt-4 bg-pink-500 text-white hover:bg-pink-600">View Detailed Report</Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 text-pink-500 mr-2" />
              Staff Management
            </h2>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Total Staff:</span> 320
              </li>
              <li>
                <span className="font-medium">Doctors on Duty:</span> 45
              </li>
              <li>
                <span className="font-medium">Nurses on Shift:</span> 120
              </li>
              <li>
                <span className="font-medium">Staff Requests:</span> 8 pending
              </li>
            </ul>
            <Button variant="outline" className="mt-4">Manage Staff</Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="h-5 w-5 text-pink-500 mr-2" />
              System Notifications
            </h2>
            <ul className="space-y-2">
              <li className="text-sm">Emergency Room at 90% capacity</li>
              <li className="text-sm">Maintenance scheduled for MRI machine #2</li>
              <li className="text-sm">New COVID-19 guidelines issued</li>
              <li className="text-sm">Pharmacy inventory running low on key medications</li>
            </ul>
            <Button variant="outline" className="mt-4">View All Notifications</Button>
          </div>
        </div>
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="bg-pink-500 text-white hover:bg-pink-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Staff
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedules
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency Protocols
            </Button>
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="w-32 text-sm text-gray-500">2 hours ago</span>
                <span>New patient admitted to ICU</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 text-sm text-gray-500">5 hours ago</span>
                <span>Emergency staff meeting conducted</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 text-sm text-gray-500">Yesterday</span>
                <span>Updated hospital policies distributed</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 text-sm text-gray-500">2 days ago</span>
                <span>New medical equipment installed in Radiology</span>
              </li>
            </ul>
            <Button variant="link" className="mt-4">View All Activities</Button>
          </div>
        </section>
      </main>
      <footer className="bg-white border-t py-6 px-4 md:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500">
            © 2024 AdminPortal. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Privacy Policy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Terms of Use
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              System Status
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}