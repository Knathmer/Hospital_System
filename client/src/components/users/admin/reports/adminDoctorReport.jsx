// src/components/users/admin/sections/SystemReports.jsx

import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { FileText } from 'lucide-react'; // Example icon, adjust as needed

const SystemReports = () => {
  const [officeLocations, setOfficeLocations] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [genders, setGenders] = useState([
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedOffices, setSelectedOffices] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [expandedDoctors, setExpandedDoctors] = useState({});

  // **New State for Sorting**
  const [sortOption, setSortOption] = useState('');

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch Office Locations
    fetch(`${API_BASE_URL}/auth/admin/adminDoctorReport/getOfficeLocations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOfficeLocations(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch Specialties
    fetch(`${API_BASE_URL}/auth/admin/adminDoctorReport/getSpecialties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSpecialties(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch States
    fetch(`${API_BASE_URL}/auth/admin/adminDoctorReport/getStates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch Cities
    fetch(`${API_BASE_URL}/auth/admin/adminDoctorReport/getCities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch Doctors with Debugging
    fetch(`${API_BASE_URL}/auth/admin/adminDoctorReport/getDoctors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Doctors Data:", data); // Debugging Line

        // **Adjust based on data structure**
        if (Array.isArray(data)) {
          // If data is an array directly
          setDoctors(data);
        } else if (data.doctors && Array.isArray(data.doctors)) {
          // If doctors are nested within an object
          setDoctors(data.doctors);
        } else if (data.length === 0) {
          // If data is an empty array or undefined
          setDoctors([]);
        } else {
          // Handle other unexpected structures
          console.warn("Unexpected doctors data structure:", data);
          setDoctors([]);
        }
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleGenerateReport = () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();

    selectedOffices.forEach((office) => {
      params.append('officeID', office.value);
    });
    selectedSpecialties.forEach((specialty) => {
      params.append('specialtyID', specialty.value);
    });
    selectedGenders.forEach((gender) => {
      params.append('gender', gender.value);
    });
    selectedStates.forEach((state) => {
      params.append('state', state.value);
    });
    selectedCities.forEach((city) => {
      params.append('city', city.value);
    });
    selectedDoctors.forEach((doctor) => {
      params.append('doctorID', doctor.value);
    });
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    fetch(`${API_BASE_URL}/auth/admin/adminDoctorReport/generateDoctorReport?${params.toString()}`, {
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

  const formatAddress = (doctor) => {
    const { addrStreet, addrcity, addrstate, addrzip } = doctor;
    let addressParts = [];
    if (addrStreet) addressParts.push(addrStreet);
    if (addrcity) addressParts.push(addrcity);
    if (addrstate) addressParts.push(addrstate);
    if (addrzip) addressParts.push(addrzip);
    return addressParts.join(', ');
  };

  // **Aggregate Data Calculations**
  const totalPrescriptions = reportData.reduce(
    (acc, doctor) => acc + doctor.prescriptions.length,
    0
  );

  const totalAppointments = reportData.reduce(
    (acc, doctor) => acc.concat(doctor.appointments),
    []
  );

  const appointmentStatusCounts = totalAppointments.reduce(
    (acc, appointment) => {
      const status = appointment.status;
      if (acc[status]) {
        acc[status] += 1;
      } else {
        acc[status] = 1;
      }
      return acc;
    },
    { Scheduled: 0, Requested: 0, Completed: 0 }
  );

  // **Memoized Sorted Data**
  const sortedReportData = useMemo(() => {
    if (!sortOption) return reportData;

    const sortedData = [...reportData];

    sortedData.sort((a, b) => {
      switch (sortOption) {
        case 'prescriptionCount':
          return b.prescriptions.length - a.prescriptions.length;
        case 'scheduledAppointments':
          return (
            b.appointments.filter((a) => a.status === 'Scheduled').length -
            a.appointments.filter((a) => a.status === 'Scheduled').length
          );
        case 'requestedAppointments':
          return (
            b.appointments.filter((a) => a.status === 'Requested').length -
            a.appointments.filter((a) => a.status === 'Requested').length
          );
        case 'completedAppointments':
          return (
            b.appointments.filter((a) => a.status === 'Completed').length -
            a.appointments.filter((a) => a.status === 'Completed').length
          );
        default:
          return 0;
      }
    });

    return sortedData;
  }, [reportData, sortOption]);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Doctor Report</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Locations</label>
              <Select
                isMulti
                options={officeLocations.map((office) => ({
                  value: office.officeID,
                  label: office.officeName,
                }))}
                value={selectedOffices}
                onChange={setSelectedOffices}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialties</label>
              <Select
                isMulti
                options={specialties.map((specialty) => ({
                  value: specialty.specialtyID,
                  label: specialty.specialtyName,
                }))}
                value={selectedSpecialties}
                onChange={setSelectedSpecialties}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Genders</label>
              <Select isMulti options={genders} value={selectedGenders} onChange={setSelectedGenders} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">States</label>
              <Select
                isMulti
                options={states}
                value={selectedStates}
                onChange={setSelectedStates}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cities</label>
              <Select
                isMulti
                options={cities}
                value={selectedCities}
                onChange={setSelectedCities}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctors</label>
              <Select
                isMulti
                options={doctors} // Use the fetched data directly
                value={selectedDoctors}
                onChange={setSelectedDoctors}
                placeholder="Select Doctors..."
              />
            </div>
            {/* Date Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* **New Sorting Component** */}
          {reportData.length > 0 && (
            <div className="flex justify-end items-center">
              <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                Sort By:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
              >
                <option value="">None</option>
                <option value="prescriptionCount">Prescription Count</option>
                <option value="scheduledAppointments">Scheduled Appointments</option>
                <option value="requestedAppointments">Requested Appointments</option>
                <option value="completedAppointments">Completed Appointments</option>
              </select>
            </div>
          )}

          <button
            onClick={handleGenerateReport}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
          >
            Generate Report
          </button>

          {/* Aggregate Data Display */}
          {reportData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Aggregate Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPrescriptions}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Scheduled Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentStatusCounts.Scheduled || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Requested Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentStatusCounts.Requested || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Completed Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointmentStatusCounts.Completed || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Report Data Display */}
          {reportData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h2 className="text-2xl font-bold mb-4">Report Results</h2>
              {sortedReportData.map((doctor) => {
                const appointmentCounts = ['Scheduled', 'Requested', 'Completed'].reduce(
                  (acc, status) => {
                    acc[status] = doctor.appointments.filter((a) => a.status === status).length;
                    return acc;
                  },
                  {}
                );

                return (
                  <div
                    key={doctor.doctorID}
                    className="border rounded-lg shadow-md p-4 mb-4 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Specialty:{' '}
                          <span className="font-medium">{doctor.specialtyName || 'N/A'}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender: <span className="font-medium">{doctor.gender || 'N/A'}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Office:{' '}
                          <span className="font-medium">
                            {doctor.officeName || 'Unknown Office'}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Address:{' '}
                          <span className="font-medium">
                            {formatAddress(doctor) || 'Unknown Address'}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleDoctorDetails(doctor.doctorID)}
                        className="text-pink-600 hover:text-pink-800 flex items-center"
                      >
                        {expandedDoctors[doctor.doctorID] ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Prescriptions:</p>
                        <p className="text-lg font-bold text-gray-900">
                          {doctor.prescriptions.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Scheduled Appointments:</p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Scheduled || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Requested Appointments:</p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Requested || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed Appointments:</p>
                        <p className="text-lg font-bold text-gray-900">
                          {appointmentCounts.Completed || 0}
                        </p>
                      </div>
                    </div>
                    {expandedDoctors[doctor.doctorID] && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        {/* Appointment Details */}
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
                                      {appointment.reason} ({appointment.patientFirstName}{' '}
                                      {appointment.patientLastName})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          );
                        })}
                        {/* Prescription Details */}
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
    </div>
  );
};

export default SystemReports;
