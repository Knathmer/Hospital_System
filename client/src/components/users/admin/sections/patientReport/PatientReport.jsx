import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../ui/Table";
import Label from "../../../../ui/Label";
import SelectComplete from "react-select";
import axios from "axios";
import envConfig from "../../../../../envConfig";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function PatientReports() {
  const [patientServices, setPatientServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filters, setFilters] = useState({
    patientName: "",
    doctor: "",
    allergy: "",
    disability: "",
    surgery: "",
    medicine: "",
    insurance: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchPatientServices = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(`${envConfig.apiUrl}/dataFetch/get-patient-services`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatientServices(response.data);
        setFilteredServices(response.data); // Initially show all services
      } catch (error) {
        console.error("Error fetching patient services:", error);
      }
    };

    fetchPatientServices();
  }, []);

  useEffect(() => {
    const filtered = patientServices.filter((service) => {
      const surgeryDate = new Date(service.medicalRecords?.surgeryDateTime);
      const prescriptionDate = new Date(service.medicine?.dateIssued);

      // Filter by date range if both startDate and endDate are selected
      if (startDate && endDate) {
        if (
          (surgeryDate && (surgeryDate < startDate || surgeryDate > endDate)) &&
          (prescriptionDate && (prescriptionDate < startDate || prescriptionDate > endDate))
        ) {
          return false;
        }
      }

      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        let targetValue;

        switch (key) {
          case "allergy":
            targetValue = service.medicalRecords?.allergy ?? "";
            break;
          case "disability":
            targetValue = service.medicalRecords?.disability ?? "";
            break;
          case "surgery":
            targetValue = service.medicalRecords?.surgery ?? "";
            break;
          case "medicine":
            targetValue = service.medicine?.name ?? "";
            break;
          case "insurance":
            targetValue = service.insurance?.providerName ?? "";
            break;
          case "doctor":
            targetValue = `${service.doctorFirstName} ${service.doctorLastName}`;
            break;
          default:
            targetValue = service[key];
        }

        return (
          typeof targetValue === "string" &&
          targetValue.toLowerCase().includes(value.toLowerCase())
        );
      });
    });
    setFilteredServices(filtered);
  }, [filters, patientServices, startDate, endDate]);

  const handleFilterChange = (key) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MM/dd/yyyy, HH:mm");
    } catch (error) {
      return dateString; // return the original string if there's an error
    }
  };

  const generateOptions = (key) => {
    const options = new Set();
    patientServices.forEach((service) => {
      let field;
      switch (key) {
        case "allergy":
          field = service.medicalRecords?.allergy ?? "";
          break;
        case "disability":
          field = service.medicalRecords?.disability ?? "";
          break;
        case "surgery":
          field = service.medicalRecords?.surgery ?? "";
          break;
        case "medicine":
          field = service.medicine?.name ?? "";
          break;
        case "insurance":
          field = service.insurance?.providerName ?? "";
          break;
        case "doctor":
          field = `${service.doctorFirstName} ${service.doctorLastName}`;
          break;
        default:
          field = service[key];
      }

      if (field && typeof field === "string") options.add(field);
    });
    return [...options].map((option) => ({ label: option, value: option }));
  };

  const renderFilters = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(filters).map((key) => (
          <div key={key}>
            <Label htmlFor={`${key}-filter`} className="text-pink-600 capitalize">
              {key}
            </Label>
            <SelectComplete
              id={`${key}-filter`}
              options={generateOptions(key)}
              placeholder={`Filter by ${key}`}
              value={filters[key] ? { label: filters[key], value: filters[key] } : null}
              onChange={handleFilterChange(key)}
              isSearchable
              isClearable
              className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
              classNamePrefix="react-select"
            />
          </div>
        ))}
        <div>
          <Label htmlFor="start-date" className="text-pink-600 capitalize">
            Start Date
          </Label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500 p-2 rounded-md"
            placeholderText="Select start date"
            dateFormat="MM/dd/yyyy"
          />
        </div>
        <div>
          <Label htmlFor="end-date" className="text-pink-600 capitalize">
            End Date
          </Label>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500 p-2 rounded-md"
            placeholderText="Select end date"
            dateFormat="MM/dd/yyyy"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6 space-y-6 shadow-2xl rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-black">Patient Services Report</h1>

      <Card className="mb-6 border-pink-200 shadow-lg">
        <CardHeader className="border-b border-pink-200">
          <CardTitle className="flex items-center text-black">Filters</CardTitle>
        </CardHeader>
        <CardContent>{renderFilters()}</CardContent>
      </Card>

      <Card className="border-pink-200 shadow-lg">
        <CardHeader className="border-b border-pink-200">
          <CardTitle className="text-black">Patient Services Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-pink-50">
                  <TableHead className="text-pink-700">Patient Name</TableHead>
                  <TableHead className="text-pink-700">Doctor</TableHead>
                  <TableHead className="text-pink-700">Allergy</TableHead>
                  <TableHead className="text-pink-700">Disability</TableHead>
                  <TableHead className="text-pink-700">Surgery</TableHead>
                  <TableHead className="text-pink-700">Medicine</TableHead>
                  <TableHead className="text-pink-700">Insurance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.patientName}</TableCell>
                    <TableCell>{`${service.doctorFirstName} ${service.doctorLastName}`}</TableCell>
                    <TableCell>{service.medicalRecords?.allergy ?? "N/A"}</TableCell>
                    <TableCell>{service.medicalRecords?.disability ?? "N/A"}</TableCell>
                    <TableCell>
                      {service.medicalRecords?.surgery
                        ? `${service.medicalRecords.surgery} at ${formatDate(service.medicalRecords.surgeryDateTime)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {service.medicine?.name
                        ? `${service.medicine.name} (Issued: ${formatDate(service.medicine.dateIssued)})`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{service.insurance?.providerName ?? "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
