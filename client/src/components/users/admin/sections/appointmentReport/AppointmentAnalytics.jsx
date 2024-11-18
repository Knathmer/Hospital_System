import React, { useState, useEffect } from "react";
import axios from "axios";
import DateRangePicker from "./DateRangePicker.jsx";
import MultiSelectInput from "./MultiSelectInput.jsx";
import AppointmentCharts from "./AppointmentCharts.jsx";
import AppointmentsTable from "./AppointmentsTable.jsx";
import ChartDisplayToggle from "./ChartDisplayToggle.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import envConfig from "../../../../../envConfig.js";

const AppointmentAnalytics = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const [statuses, setStatuses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [visitTypes, setVisitTypes] = useState([]);
  const [selectedVisitTypes, setSelectedVisitTypes] = useState([]);

  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [totalAppointments, setTotalAppointments] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [visitTypeCounts, setVisitTypeCounts] = useState({});
  const [appointmentsByDate, setAppointmentsByDate] = useState({});
  const [specialtyCounts, setSpecialtyCounts] = useState({});
  const [serviceCounts, setServiceCounts] = useState({});
  const [stateCounts, setStateCounts] = useState({});
  const [cityCounts, setCityCounts] = useState({});
  const [officeCounts, setOfficeCounts] = useState({});
  const [doctorCounts, setDoctorCounts] = useState({});
  const [patientCounts, setPatientCounts] = useState({});

  // Chart display options
  const [chartDisplayOptions, setChartDisplayOptions] = useState({
    status: true,
    visitType: true,
    specialty: true,
    service: true,
    state: true,
    city: true,
    office: true,
    doctor: true,
    patient: true,
    appointmentsOverTime: true,
  });

  // Variables for include inactive checkboxes
  const [includeInactiveDoctors, setIncludeInactiveDoctors] = useState(false);
  const [includeInactivePatients, setIncludeInactivePatients] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Set default date range to one month ago until today
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    setStartDate(oneMonthAgo.toISOString().split("T")[0]);
    setEndDate(now.toISOString().split("T")[0]);

    // Fetch initial data for filters
    const fetchData = async () => {
      try {
        const [
          statesRes,
          citiesRes,
          doctorsRes,
          patientsRes,
          statusesRes,
          visitTypesRes,
          specialtiesRes,
          servicesRes,
        ] = await Promise.all([
          axios.get(`${envConfig.apiUrl}/auth/admin/states`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${envConfig.apiUrl}/auth/admin/cities`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${envConfig.apiUrl}/auth/admin/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { includeInactive: includeInactiveDoctors },
          }),
          axios.get(`${envConfig.apiUrl}/auth/admin/patients`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { includeInactive: includeInactivePatients },
          }),
          axios.get(`${envConfig.apiUrl}/auth/admin/statuses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${envConfig.apiUrl}/auth/admin/visitTypes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${envConfig.apiUrl}/auth/admin/specialties`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${envConfig.apiUrl}/auth/admin/services`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStates(statesRes.data.states);
        setCities(citiesRes.data.cities);
        setDoctors(doctorsRes.data.doctors);
        setPatients(patientsRes.data.patients);
        setStatuses(statusesRes.data.statuses);
        setVisitTypes(visitTypesRes.data.visitTypes);
        setSpecialties(specialtiesRes.data.specialties);
        setServices(servicesRes.data.services);

        // Fetch offices after fetching states and cities
        fetchOffices(statesRes.data.states, citiesRes.data.cities);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, [token, includeInactiveDoctors, includeInactivePatients]);

  const fetchOffices = async (
    states = selectedStates,
    cities = selectedCities
  ) => {
    try {
      const params = {};
      if (states.length > 0)
        params.states = states.map((s) => s.value).join(",");
      if (cities.length > 0)
        params.cities = cities.map((c) => c.value).join(",");

      const officesRes = await axios.get(
        `${envConfig.apiUrl}/auth/admin/offices`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      setOffices(officesRes.data.offices);
    } catch (error) {
      console.error("Error fetching offices:", error);
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
        params.states = selectedStates.map((s) => s.value).join(",");
      }

      if (selectedCities.length > 0) {
        params.cities = selectedCities.map((c) => c.value).join(",");
      }

      if (selectedOffices.length > 0) {
        params.officeIDs = selectedOffices.map((o) => o.value).join(",");
      }

      if (selectedDoctors.length > 0) {
        params.doctorIDs = selectedDoctors.map((d) => d.value).join(",");
      }

      if (selectedPatients.length > 0) {
        params.patientIDs = selectedPatients.map((p) => p.value).join(",");
      }

      if (selectedStatuses.length > 0) {
        params.statuses = selectedStatuses.map((s) => s.value).join(",");
      }

      if (selectedVisitTypes.length > 0) {
        params.visitTypes = selectedVisitTypes.map((v) => v.value).join(",");
      }

      if (selectedSpecialties.length > 0) {
        params.specialtyIDs = selectedSpecialties.map((s) => s.value).join(",");
      }

      if (selectedServices.length > 0) {
        params.serviceIDs = selectedServices.map((s) => s.value).join(",");
      }

      params.includeInactiveDoctors = includeInactiveDoctors;
      params.includeInactivePatients = includeInactivePatients;

      const res = await axios.get(
        `${envConfig.apiUrl}/auth/admin/appointmentAnalytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setAppointments(res.data.appointments);
      setTotalAppointments(res.data.totalAppointments);
      setStatusCounts(res.data.statusCounts);
      setVisitTypeCounts(res.data.visitTypeCounts);
      setAppointmentsByDate(res.data.appointmentsByDate);
      setSpecialtyCounts(res.data.specialtyCounts);
      setServiceCounts(res.data.serviceCounts);
      setStateCounts(res.data.stateCounts);
      setCityCounts(res.data.cityCounts);
      setOfficeCounts(res.data.officeCounts);
      setDoctorCounts(res.data.doctorCounts);
      setPatientCounts(res.data.patientCounts);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [
    startDate,
    endDate,
    selectedStates,
    selectedCities,
    selectedOffices,
    selectedDoctors,
    selectedPatients,
    selectedStatuses,
    selectedVisitTypes,
    selectedSpecialties,
    selectedServices,
    includeInactiveDoctors,
    includeInactivePatients,
  ]);

  // Prepare options for react-select
  const stateOptions = states.map((state) => ({ value: state, label: state }));
  const cityOptions = cities.map((city) => ({ value: city, label: city }));
  const officeOptions = offices.map((office) => ({
    value: office.officeID.toString(),
    label: office.officeName,
  }));
  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.doctorID.toString(),
    label: `${doctor.firstName} ${doctor.lastName}`,
  }));
  const patientOptions = patients.map((patient) => ({
    value: patient.patientID.toString(),
    label: `${patient.firstName} ${patient.lastName}`,
  }));
  const statusOptions = statuses.map((status) => ({
    value: status,
    label: status,
  }));
  const visitTypeOptions = visitTypes.map((visitType) => ({
    value: visitType,
    label: visitType,
  }));
  const specialtyOptions = specialties.map((specialty) => ({
    value: specialty.specialtyID.toString(),
    label: specialty.specialtyName,
  }));
  const serviceOptions = services.map((service) => ({
    value: service.serviceID.toString(),
    label: service.serviceName,
  }));

  const exportToPDF = () => {
    const input = document.getElementById("report-content");
    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

        pdf.save("appointment-report.pdf");
      })
      .catch((error) => {
        console.error("Error exporting to PDF:", error);
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

      {/* Wrap the content you want to export */}
      <div id="report-content">
        <h1 className="text-3xl font-bold text-center mb-6">
          Appointment Analytics
        </h1>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Date Range Inputs */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <ChartDisplayToggle
            label="Appointments Over Time"
            chartToggleState={chartDisplayOptions.appointmentsOverTime}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({
                ...prev,
                appointmentsOverTime: value,
              }))
            }
          />

          {/* MultiSelect Inputs with Chart Toggles */}
          <MultiSelectInput
            label="States"
            options={stateOptions}
            selectedValues={selectedStates}
            setSelectedValues={setSelectedStates}
            placeholder="Select States"
            chartToggle
            chartToggleState={chartDisplayOptions.state}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, state: value }))
            }
          />

          {/* Cities */}
          <MultiSelectInput
            label="Cities"
            options={cityOptions}
            selectedValues={selectedCities}
            setSelectedValues={setSelectedCities}
            placeholder="Select Cities"
            chartToggle
            chartToggleState={chartDisplayOptions.city}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, city: value }))
            }
          />

          {/* Offices */}
          <MultiSelectInput
            label="Offices"
            options={officeOptions}
            selectedValues={selectedOffices}
            setSelectedValues={setSelectedOffices}
            placeholder="Select Offices"
            chartToggle
            chartToggleState={chartDisplayOptions.office}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, office: value }))
            }
          />

          {/* Doctors */}
          <MultiSelectInput
            label="Doctors"
            options={doctorOptions}
            selectedValues={selectedDoctors}
            setSelectedValues={setSelectedDoctors}
            placeholder="Select Doctors"
            chartToggle
            chartToggleState={chartDisplayOptions.doctor}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, doctor: value }))
            }
          />
          {/* Include Inactive Doctors Checkbox */}
          <div className="mb-4">
            <input
              type="checkbox"
              checked={includeInactiveDoctors}
              onChange={(e) => setIncludeInactiveDoctors(e.target.checked)}
              className="mr-2"
            />
            <label>Include Inactive Doctors</label>
          </div>

          {/* Patients */}
          <MultiSelectInput
            label="Patients"
            options={patientOptions}
            selectedValues={selectedPatients}
            setSelectedValues={setSelectedPatients}
            placeholder="Select Patients"
            chartToggle
            chartToggleState={chartDisplayOptions.patient}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, patient: value }))
            }
          />
          {/* Include Inactive Patients Checkbox */}
          <div className="mb-4">
            <input
              type="checkbox"
              checked={includeInactivePatients}
              onChange={(e) => setIncludeInactivePatients(e.target.checked)}
              className="mr-2"
            />
            <label>Include Inactive Patients</label>
          </div>

          {/* Status */}
          <MultiSelectInput
            label="Status"
            options={statusOptions}
            selectedValues={selectedStatuses}
            setSelectedValues={setSelectedStatuses}
            placeholder="Select Statuses"
            chartToggle
            chartToggleState={chartDisplayOptions.status}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, status: value }))
            }
          />

          {/* Visit Types */}
          <MultiSelectInput
            label="Visit Types"
            options={visitTypeOptions}
            selectedValues={selectedVisitTypes}
            setSelectedValues={setSelectedVisitTypes}
            placeholder="Select Visit Types"
            chartToggle
            chartToggleState={chartDisplayOptions.visitType}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, visitType: value }))
            }
          />

          {/* Specialties */}
          <MultiSelectInput
            label="Specialties"
            options={specialtyOptions}
            selectedValues={selectedSpecialties}
            setSelectedValues={setSelectedSpecialties}
            placeholder="Select Specialties"
            chartToggle
            chartToggleState={chartDisplayOptions.specialty}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, specialty: value }))
            }
          />

          {/* Services */}
          <MultiSelectInput
            label="Services"
            options={serviceOptions}
            selectedValues={selectedServices}
            setSelectedValues={setSelectedServices}
            placeholder="Select Services"
            chartToggle
            chartToggleState={chartDisplayOptions.service}
            setChartToggleState={(value) =>
              setChartDisplayOptions((prev) => ({ ...prev, service: value }))
            }
          />
        </div>

        {/* Charts */}
        <AppointmentCharts
          statusCounts={statusCounts}
          visitTypeCounts={visitTypeCounts}
          appointmentsByDate={appointmentsByDate}
          specialtyCounts={specialtyCounts}
          serviceCounts={serviceCounts}
          stateCounts={stateCounts}
          cityCounts={cityCounts}
          officeCounts={officeCounts}
          doctorCounts={doctorCounts}
          patientCounts={patientCounts}
          chartDisplayOptions={chartDisplayOptions}
        />

        {/* Display Appointments */}
        <AppointmentsTable appointments={appointments} />
      </div>
    </div>
  );
};

export default AppointmentAnalytics;
