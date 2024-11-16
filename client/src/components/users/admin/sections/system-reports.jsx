import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [expandedDoctors, setExpandedDoctors] = useState({});

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/auth/admin/getOfficeLocations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOfficeLocations(data);
        } else {
          console.error('Invalid response format:', data);
          setOfficeLocations([]);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setOfficeLocations([]);
      });

    fetch(`${API_BASE_URL}/auth/admin/getSpecialties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSpecialties(data);
        } else {
          console.error('Invalid response format:', data);
          setSpecialties([]);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setSpecialties([]);
      });
  }, []);

  const handleGenerateReport = () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      officeID: selectedOffice,
      specialtyID: selectedSpecialty,
      gender: selectedGender,
      startDate,
      endDate,
    });

    fetch(`${API_BASE_URL}/auth/admin/generateDoctorReport?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch((err) => console.error('Fetch error:', err));
  };

  const toggleDoctorDetails = (doctorID) => {
    setExpandedDoctors((prev) => ({
      ...prev,
      [doctorID]: !prev[doctorID],
    }));
  };

  const formatDateTime = (dateTime) =>
    new Date(dateTime).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <div className="flex items-center justify-center">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="ml-2 text-2xl font-bold text-gray-900">WomenWell Admin</span>
        </div>
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
              <div>
                <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                  Office Location
                </label>
                <select
                  id="office"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
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
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <select
                  id="specialty"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.specialtyID} value={specialty.specialtyID}>
                      {specialty.specialtyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
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
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleGenerateReport}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Generate Report
              </button>
            </div>
          </div>
          {reportData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Report Results</h2>
              {reportData.map((doctor) => {
                const appointmentCounts = ['Scheduled', 'Requested', 'Completed'].reduce(
                  (acc, status) => {
                    acc[status] = doctor.appointments.filter((a) => a.status === status).length;
                    return acc;
                  },
                  {}
                );

                return (
                  <div key={doctor.doctorID} className="border rounded-lg shadow-md p-4 mb-4 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Specialty:{' '}
                          <span className="font-medium">{doctor.specialtyName}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender: <span className="font-medium">{doctor.gender}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Office:{' '}
                          <span className="font-medium">
                            {doctor.officeName || 'Unknown Office'}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleDoctorDetails(doctor.doctorID)}
                        className="text-pink-600 hover:text-pink-800 flex items-center"
                      >
                        {expandedDoctors[doctor.doctorID] ? 'Hide Details' : 'Show Details'}
                        {expandedDoctors[doctor.doctorID] ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Prescriptions:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {doctor.prescriptions.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Scheduled Appointments:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Scheduled || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Requested Appointments:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Requested || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Completed Appointments:
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Completed || 0}
                        </p>
                      </div>
                    </div>
                    {expandedDoctors[doctor.doctorID] && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        {/* Added styling to make the expanded section visually distinct */}
                        {['Scheduled', 'Requested', 'Completed'].map((status) => {
                          const filteredAppointments = doctor.appointments.filter(
                            (appointment) => appointment.status === status
                          );

                          return (
                            filteredAppointments.length > 0 && (
                              <div key={status} className="mb-4">
                                <h4 className="font-semibold text-lg">{status} Appointments:</h4>
                                <ul className="list-disc list-inside">
                                  {filteredAppointments.map((appointment) => (
                                    <li key={appointment.appointmentID}>
                                      {formatDateTime(appointment.appointmentDateTime)} -{' '}
                                      {appointment.title} ({appointment.patientFirstName}{' '}
                                      {appointment.patientLastName})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          );
                        })}
                        <div>
                          <h4 className="font-semibold text-lg">Prescriptions:</h4>
                          <ul className="list-disc list-inside">
                            {doctor.prescriptions.map((prescription) => (
                              <li key={prescription.prescriptionID}>
                                {formatDateTime(prescription.dateIssued)} -{' '}
                                {prescription.medicationName}, {prescription.dosage} mg (
                                {prescription.patientFirstName} {prescription.patientLastName})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
