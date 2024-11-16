// client/src/components/users/admin/sections/AppointmentAnalytics.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateRangePicker from './DateRangePicker';
import MultiSelectInput from './MultiSelectInput';
import AppointmentCharts from './AppointmentCharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

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
  const [specialtyCounts, setSpecialtyCounts] = useState({});
  const [serviceCounts, setServiceCounts] = useState({});
  const [appointmentsByDate, setAppointmentsByDate] = useState({});

  const [sortConfig, setSortConfig] = useState({
    key: 'appointmentDateTime',
    direction: 'descending',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Set default date range to one month ago until today
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    setStartDate(oneMonthAgo.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);

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
      if (states.length > 0) params.states = states.map(s => s.value).join(',');
      if (cities.length > 0) params.cities = cities.map(c => c.value).join(',');

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
        params.states = selectedStates.map(s => s.value).join(',');
      }

      if (selectedCities.length > 0) {
        params.cities = selectedCities.map(c => c.value).join(',');
      }

      if (selectedOffices.length > 0) {
        params.officeIDs = selectedOffices.map(o => o.value).join(',');
      }

      if (selectedDoctors.length > 0) {
        params.doctorIDs = selectedDoctors.map(d => d.value).join(',');
      }

      if (selectedPatients.length > 0) {
        params.patientIDs = selectedPatients.map(p => p.value).join(',');
      }

      const res = await axios.get('http://localhost:3000/auth/admin/appointmentAnalytics', {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });

      setAppointments(res.data.appointments);
      setTotalAppointments(res.data.totalAppointments);
      setStatusCounts(res.data.statusCounts);
      setVisitTypeCounts(res.data.visitTypeCounts);
      setSpecialtyCounts(res.data.specialtyCounts);
      setServiceCounts(res.data.serviceCounts);
      setAppointmentsByDate(res.data.appointmentsByDate);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [startDate, endDate, selectedStates, selectedCities, selectedOffices, selectedDoctors, selectedPatients]);

  // Prepare options for react-select
  const stateOptions = states.map(state => ({ value: state, label: state }));
  const cityOptions = cities.map(city => ({ value: city, label: city }));
  const officeOptions = offices.map(office => ({ value: office.officeID.toString(), label: office.officeName }));
  const doctorOptions = doctors.map(doctor => ({ value: doctor.doctorID.toString(), label: `${doctor.firstName} ${doctor.lastName}` }));
  const patientOptions = patients.map(patient => ({ value: patient.patientID.toString(), label: `${patient.firstName} ${patient.lastName}` }));

  const handleSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedAppointments = () => {
    const sortedAppointments = [...appointments];
    sortedAppointments.sort((a, b) => {
      let aValue;
      let bValue;
  
      switch (sortConfig.key) {
        case 'appointmentDateTime':
          aValue = new Date(a.appointmentDateTime).getTime();
          bValue = new Date(b.appointmentDateTime).getTime();
          break;
        case 'patientName':
          aValue = `${a.patientFirstName} ${a.patientLastName}`.toLowerCase();
          bValue = `${b.patientFirstName} ${b.patientLastName}`.toLowerCase();
          break;
        case 'doctorName':
          aValue = `${a.doctorFirstName} ${a.doctorLastName}`.toLowerCase();
          bValue = `${b.doctorFirstName} ${b.doctorLastName}`.toLowerCase();
          break;
        default:
          aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
          bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
          break;
      }
  
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortedAppointments;
  };

  const exportToPDF = () => {
  const input = document.getElementById('report-content');
  html2canvas(input, { scale: 2, useCORS: true })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      pdf.save('appointment-report.pdf');
    })
    .catch((error) => {
      console.error('Error exporting to PDF:', error);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 p-6">
      {/* Export Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={exportToPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Export Report as PDF
        </button>
      </div>
      <div id="report-content">
      <h1 className="text-3xl font-bold text-center mb-6">Appointment Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Date Range Inputs */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        {/* States Selector */}
        <MultiSelectInput
          options={stateOptions}
          selectedValues={selectedStates}
          setSelectedValues={setSelectedStates}
          label="States"
          placeholder="Select States"
        />

        {/* Cities Selector */}
        <MultiSelectInput
          options={cityOptions}
          selectedValues={selectedCities}
          setSelectedValues={setSelectedCities}
          label="Cities"
          placeholder="Select Cities"
        />

        {/* Offices Selector */}
        <MultiSelectInput
          options={officeOptions}
          selectedValues={selectedOffices}
          setSelectedValues={setSelectedOffices}
          label="Offices"
          placeholder="Select Offices"
        />

        {/* Doctors Selector */}
        <MultiSelectInput
          options={doctorOptions}
          selectedValues={selectedDoctors}
          setSelectedValues={setSelectedDoctors}
          label="Doctors"
          placeholder="Select Doctors"
        />

        {/* Patients Selector */}
        <MultiSelectInput
          options={patientOptions}
          selectedValues={selectedPatients}
          setSelectedValues={setSelectedPatients}
          label="Patients"
          placeholder="Select Patients"
        />
      </div>

      {/* Charts */}
      <AppointmentCharts
        statusCounts={statusCounts}
        visitTypeCounts={visitTypeCounts}
        appointmentsByDate={appointmentsByDate}
        specialtyCounts={specialtyCounts}
        serviceCounts={serviceCounts}
      />

      {/* Display Appointments */}
      <div>
          <h2 className="text-2xl font-bold mb-4">Appointments</h2>
          <div className="overflow-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {[
                    { label: 'Date & Time', key: 'appointmentDateTime' },
                    { label: 'Patient', key: 'patientName' },
                    { label: 'Doctor', key: 'doctorName' },
                    { label: 'Office', key: 'officeName' },
                    { label: 'Status', key: 'status' },
                    { label: 'Visit Type', key: 'visitType' },
                    { label: 'Service', key: 'serviceName' },
                  ].map((column) => (
                    <th
                      key={column.key}
                      className="py-2 px-4 cursor-pointer select-none"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center justify-center">
                        {column.label}
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'ascending' ? (
                            <FaSortUp className="ml-1" />
                          ) : (
                            <FaSortDown className="ml-1" />
                          )
                        ) : (
                          <FaSort className="ml-1 opacity-50" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getSortedAppointments().map((appointment) => (
                  <tr key={appointment.appointmentID} className="text-center">
                    <td className="py-2 px-4">
                      {new Date(appointment.appointmentDateTime).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      {appointment.patientFirstName} {appointment.patientLastName}
                    </td>
                    <td className="py-2 px-4">
                      {appointment.doctorFirstName} {appointment.doctorLastName}
                    </td>
                    <td className="py-2 px-4">{appointment.officeName}</td>
                    <td className="py-2 px-4">{appointment.status}</td>
                    <td className="py-2 px-4">{appointment.visitType}</td>
                    <td className="py-2 px-4">{appointment.serviceName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAnalytics;
