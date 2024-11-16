// client/src/components/users/admin/sections/AppointmentAnalytics.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const AppointmentAnalytics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);

  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const [offices, setOffices] = useState([]);
  const [selectedOffices, setSelectedOffices] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [totalAppointments, setTotalAppointments] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [visitTypeCounts, setVisitTypeCounts] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch initial data for filters
    const fetchData = async () => {
      try {
        const [statesRes, citiesRes, doctorsRes, patientsRes] = await Promise.all([
          axios.get('http://localhost:3000/auth/admin/states', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('http://localhost:3000/auth/admin/cities', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('http://localhost:3000/auth/admin/doctors', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('http://localhost:3000/auth/admin/patients', { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);

        setStates(statesRes.data.states);
        setCities(citiesRes.data.cities);
        setDoctors(doctorsRes.data.doctors);
        setPatients(patientsRes.data.patients);

        // Fetch offices after fetching states and cities
        fetchOffices(statesRes.data.states, citiesRes.data.cities);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchData();
  }, [token]);

  const fetchOffices = async (states = selectedStates, cities = selectedCities) => {
    try {
      const params = {};
      if (states.length > 0) params.states = states.join(',');
      if (cities.length > 0) params.cities = cities.join(',');

      const officesRes = await axios.get('http://localhost:3000/auth/admin/offices', {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });
      setOffices(officesRes.data.offices);
    } catch (error) {
      console.error('Error fetching offices:', error);
    }
  };

  // Update offices when states or cities change
  useEffect(() => {
    fetchOffices();
  }, [selectedStates, selectedCities]);

  const fetchAppointments = async () => {
    try {
      const params = {};

      if (startDate && endDate) {
        params.startDate = new Date(startDate).toISOString();
        params.endDate = new Date(endDate).toISOString();
      }

      if (selectedStates.length > 0) {
        params.states = selectedStates.join(',');
      }

      if (selectedCities.length > 0) {
        params.cities = selectedCities.join(',');
      }

      if (selectedOffices.length > 0) {
        params.officeIDs = selectedOffices.join(',');
      }

      if (selectedDoctors.length > 0) {
        params.doctorIDs = selectedDoctors.join(',');
      }

      if (selectedPatients.length > 0) {
        params.patientIDs = selectedPatients.join(',');
      }

      const res = await axios.get('http://localhost:3000/auth/admin/appointmentAnalytics', {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });

      setAppointments(res.data.appointments);
      setTotalAppointments(res.data.totalAppointments);
      setStatusCounts(res.data.statusCounts);
      setVisitTypeCounts(res.data.visitTypeCounts);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [startDate, endDate, selectedStates, selectedCities, selectedOffices, selectedDoctors, selectedPatients]);

  // MultiSelect Component using Radix UI
  const MultiSelect = ({ options, selectedValues, setSelectedValues, label }) => {
    const [open, setOpen] = useState(false);

    const toggleValue = (value) => {
      setSelectedValues(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    };

    return (
      <div className="mb-4">
        <label className="block mb-2 font-semibold">{label}</label>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded">
            <span>{selectedValues.length > 0 ? `${selectedValues.length} selected` : `Select ${label}`}</span>
            <ChevronDownIcon />
          </Popover.Trigger>
          <Popover.Content className="bg-white rounded shadow-md p-2 w-64">
            {options.map(option => (
              <div key={option.value} className="flex items-center py-1">
                <Checkbox.Root
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={() => toggleValue(option.value)}
                  className="w-4 h-4 border border-gray-300 rounded mr-2"
                >
                  <Checkbox.Indicator>
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label>{option.label}</label>
              </div>
            ))}
          </Popover.Content>
        </Popover.Root>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Appointment Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Date Range Inputs */}
        <div>
          <label className="block mb-2 font-semibold">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* States Selector */}
        <MultiSelect
          options={states.map(state => ({ value: state, label: state }))}
          selectedValues={selectedStates}
          setSelectedValues={setSelectedStates}
          label="States"
        />

        {/* Cities Selector */}
        <MultiSelect
          options={cities.map(city => ({ value: city, label: city }))}
          selectedValues={selectedCities}
          setSelectedValues={setSelectedCities}
          label="Cities"
        />

        {/* Offices Selector */}
        <MultiSelect
          options={offices.map(office => ({ value: office.officeID.toString(), label: office.officeName }))}
          selectedValues={selectedOffices}
          setSelectedValues={setSelectedOffices}
          label="Offices"
        />

        {/* Doctors Selector */}
        <MultiSelect
          options={doctors.map(doctor => ({ value: doctor.doctorID.toString(), label: `${doctor.firstName} ${doctor.lastName}` }))}
          selectedValues={selectedDoctors}
          setSelectedValues={setSelectedDoctors}
          label="Doctors"
        />

        {/* Patients Selector */}
        <MultiSelect
          options={patients.map(patient => ({ value: patient.patientID.toString(), label: `${patient.firstName} ${patient.lastName}` }))}
          selectedValues={selectedPatients}
          setSelectedValues={setSelectedPatients}
          label="Patients"
        />
      </div>

      {/* Summary Statistics */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <p className="mb-2">Total Appointments: {totalAppointments}</p>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Appointments by Status</h3>
          <ul>
            {Object.entries(statusCounts).map(([status, count]) => (
              <li key={status}>{status}: {count}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Appointments by Visit Type</h3>
          <ul>
            {Object.entries(visitTypeCounts).map(([visitType, count]) => (
              <li key={visitType}>{visitType}: {count}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Display Appointments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Date & Time</th>
                <th className="py-2">Patient</th>
                <th className="py-2">Doctor</th>
                <th className="py-2">Office</th>
                <th className="py-2">Status</th>
                <th className="py-2">Visit Type</th>
                <th className="py-2">Service</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.appointmentID} className="text-center">
                  <td className="py-2">{new Date(appointment.appointmentDateTime).toLocaleString()}</td>
                  <td className="py-2">{appointment.patientFirstName} {appointment.patientLastName}</td>
                  <td className="py-2">{appointment.doctorFirstName} {appointment.doctorLastName}</td>
                  <td className="py-2">{appointment.officeName}</td>
                  <td className="py-2">{appointment.status}</td>
                  <td className="py-2">{appointment.visitType}</td>
                  <td className="py-2">{appointment.serviceName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AppointmentAnalytics;
