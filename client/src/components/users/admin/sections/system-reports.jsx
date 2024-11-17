import React, { useState, useEffect } from 'react';
import Select from 'react-select';

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

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch Office Locations
    fetch(`${API_BASE_URL}/auth/admin/getOfficeLocations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOfficeLocations(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch Specialties
    fetch(`${API_BASE_URL}/auth/admin/getSpecialties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSpecialties(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch States
    fetch(`${API_BASE_URL}/auth/admin/getStates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch Cities
    fetch(`${API_BASE_URL}/auth/admin/getCities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error('Fetch error:', err));

    // Fetch Doctors
    fetch(`${API_BASE_URL}/auth/admin/getDoctors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDoctors(data))
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
          <span className="ml-2 text-2xl font-bold text-gray-900">System Reports</span>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">System Reports</h1>
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
                options={doctors}
                value={selectedDoctors}
                onChange={setSelectedDoctors}
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
          <button
            onClick={handleGenerateReport}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
          >
            Generate Report
          </button>

          {/* Report Data Display */}
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
                          Specialty: <span className="font-medium">{doctor.specialtyName}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender: <span className="font-medium">{doctor.gender}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Office: <span className="font-medium">{doctor.officeName || 'Unknown Office'}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          City: <span className="font-medium">{doctor.addrcity || 'Unknown City'}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          State: <span className="font-medium">{doctor.addrstate || 'Unknown State'}</span>
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
                        <p className="text-lg font-bold text-gray-900">{doctor.prescriptions.length}</p>
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
