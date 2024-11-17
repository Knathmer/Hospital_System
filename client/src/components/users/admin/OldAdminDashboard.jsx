// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, Users, UserPlus, FileText, Settings } from 'lucide-react';

// const AdminDashboard = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-pink-50">
//       <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
//         <Link className="flex items-center justify-center" to="/">
//           <Heart className="h-6 w-6 text-pink-500" />
//           <span className="ml-2 text-2xl font-bold text-gray-900">WomenWell Admin</span>
//         </Link>
//       </header>
//       <main className="flex-1 p-4">
//         <div className="max-w-4xl mx-auto space-y-8">
//           <div className="text-center">
//             <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
//             <p className="mt-2 text-lg text-gray-600">Welcome, Admin! Here you can manage users, doctors, and system settings.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Link to="/admin/manage-patients" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//               <Users className="h-8 w-8 text-pink-500 mr-4" />
//               <span className="text-xl font-semibold text-gray-800">Manage Patients</span>
//             </Link>
//             <Link to="/admin/manage-doctors" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//               <UserPlus className="h-8 w-8 text-pink-500 mr-4" />
//               <span className="text-xl font-semibold text-gray-800">Manage Doctors</span>
//             </Link>
//             <Link to="/admin/system-reports" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//               <FileText className="h-8 w-8 text-pink-500 mr-4" />
//               <span className="text-xl font-semibold text-gray-800">System Reports</span>
//             </Link>
//             <Link to="/admin/settings" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//               <Settings className="h-8 w-8 text-pink-500 mr-4" />
//               <span className="text-xl font-semibold text-gray-800">Settings</span>
//             </Link>
//           </div>
//           <div className="text-center">
//             <Link
//               to="/admin/register-doctor"
//               className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
//             >
//               Register Doctor
//             </Link>
//           </div>
//         </div>
//       </main>
//       <footer className="py-6 text-center border-t bg-white">
//         <p className="text-sm text-gray-500">
//           © 2024 WomenWell. All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default AdminDashboard;