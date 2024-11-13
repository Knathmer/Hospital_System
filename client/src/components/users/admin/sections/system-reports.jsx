import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const SystemReports = () => {
  const [officeLocations, setOfficeLocations] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [genders, setGenders] = useState(['Male', 'Female', 'Other', 'Prefer not to say']);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const API_BASE_URL = 'http://localhost:3000';

  // Fetch options for dropdowns when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch Office Locations
    fetch(`${API_BASE_URL}/auth/admin/getOfficeLocations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server error response:', errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setOfficeLocations(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch Specialties
    fetch(`${API_BASE_URL}/auth/admin/getSpecialties`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server error response:', errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setSpecialties(data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleGenerateReport = () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      officeID: selectedOffice,
      specialty: selectedSpecialty,
      gender: selectedGender,
      startDate,
      endDate,
    });

    fetch(`${API_BASE_URL}/auth/admin/generateDoctorReport?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Server error response:', errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setReportData(data))
      .catch((err) => console.error('Fetch error:', err));
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link className="flex items-center justify-center" to="/">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="ml-2 text-2xl font-bold text-gray-900">WomenWell Admin</span>
        </Link>
      </header>
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">System Reports</h1>
            <p className="mt-2 text-lg text-gray-600">Generate reports based on doctors' data.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Doctor Workload Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Office Location Filter */}
              <div>
                <label className="block text-gray-700">Office Location</label>
                <select
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                >
                  <option value="">All Offices</option>
                  {officeLocations.map((office) => (
                    <option key={office.officeID} value={office.officeID}>
                      {office.officeName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Specialty Filter */}
              <div>
                <label className="block text-gray-700">Specialty</label>
                <select
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              {/* Gender Filter */}
              <div>
                <label className="block text-gray-700">Gender</label>
                <select
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="">All Genders</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
              {/* Start Date Filter */}
              <div>
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              {/* End Date Filter */}
              <div>
                <label className="block text-gray-700">End Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Generate Report
              </button>
            </div>
          </div>
          {/* Report Results */}
          {reportData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Report Results</h2>
              {reportData.map((doctor) => (
                <div key={doctor.doctorID} className="mb-8">
                  {/* Doctor Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">
                      {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p>Specialty: {doctor.specialty}</p>
                    <p>Gender: {doctor.gender}</p>
                  </div>
                  {/* Appointments */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">
                      Appointments ({doctor.appointments.length})
                    </h4>
                    {doctor.appointments.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 mt-2">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Date & Time
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Patient
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Title
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {doctor.appointments.map((appointment) => (
                            <tr key={appointment.appointmentID}>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {new Date(appointment.appointmentDateTime).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {appointment.patientFirstName} {appointment.patientLastName}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">{appointment.title}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{appointment.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No appointments found.</p>
                    )}
                  </div>
                  {/* Prescriptions */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">
                      Prescriptions ({doctor.prescriptions.length})
                    </h4>
                    {doctor.prescriptions.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 mt-2">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Medication
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Patient
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Dosage
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Frequency
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Date Issued
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {doctor.prescriptions.map((prescription) => (
                            <tr key={prescription.prescriptionID}>
                              <td className="px-4 py-2 whitespace-nowrap">{prescription.medicationName}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {prescription.patientFirstName} {prescription.patientLastName}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">{prescription.dosage}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{prescription.frequency}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {new Date(prescription.dateIssued).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No prescriptions found.</p>
                    )}
                  </div>
                  <hr className="my-4" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 text-center border-t bg-white">
        <p className="text-sm text-gray-500">© 2024 WomenWell. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SystemReports;
