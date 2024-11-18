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
    appointments: "",
    medicalRecords: "",
    medicine: "",
    billing: "",
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
      const appointmentDate = new Date(service.appointments?.createdAt);

      // Filter by date range if both startDate and endDate are selected
      if (startDate && endDate) {
        if (appointmentDate < startDate || appointmentDate > endDate) {
          return false;
        }
      }

      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        let targetValue;

        switch (key) {
          case "appointments":
            targetValue = `${service.appointments?.id ?? ""} ${service.appointments?.createdAt ?? ""} ${service.appointments?.updatedAt ?? ""}`;
            break;
          case "medicalRecords":
            targetValue = `${service.medicalRecords?.allergen ?? ""} ${service.medicalRecords?.disability ?? ""} ${service.medicalRecords?.surgery ?? ""}`;
            break;
          case "medicine":
            targetValue = `${service.medicine?.name ?? ""} ${service.medicine?.dateIssued ?? ""} ${service.medicine?.start ?? ""} ${service.medicine?.end ?? ""}`;
            break;
          case "billing":
            targetValue = `${service.billing?.id ?? ""} ${service.billing?.dateIssued ?? ""} ${service.billing?.dueDate ?? ""}`;
            break;
          case "insurance":
            targetValue = `${service.insurance?.providerName ?? ""} ${service.insurance?.expirationDate ?? ""}`;
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
        case "appointments":
          if (service.appointments) {
            const id = service.appointments.id;
            const createdAt = formatDate(service.appointments.createdAt);
            const updatedAt = formatDate(service.appointments.updatedAt);
            field = `ID: ${id}, Created At: ${createdAt}, Updated At: ${updatedAt}`;
          }
          break;
        case "medicalRecords":
          if (service.medicalRecords) {
            field = `Allergen: ${service.medicalRecords.allergen ?? "N/A"}, Disability: ${service.medicalRecords.disability ?? "N/A"}, Surgery: ${service.medicalRecords.surgery ?? "N/A"}`;
          }
          break;
        case "medicine":
          if (service.medicine) {
            const name = service.medicine.name;
            const dateIssued = formatDate(service.medicine.dateIssued);
            const start = formatDate(service.medicine.start);
            const end = formatDate(service.medicine.end);
            field = `Name: ${name}, Issued: ${dateIssued}, Start: ${start}, End: ${end}`;
          }
          break;
        case "billing":
          if (service.billing) {
            const id = service.billing.id;
            const dateIssued = formatDate(service.billing.dateIssued);
            const dueDate = formatDate(service.billing.dueDate);
            field = `ID: ${id}, Issued: ${dateIssued}, Due: ${dueDate}`;
          }
          break;
        case "insurance":
          if (service.insurance) {
            const providerName = service.insurance.providerName;
            const expirationDate = formatDate(service.insurance.expirationDate);
            field = `Provider: ${providerName}, Expiration: ${expirationDate}`;
          }
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
                  <TableHead className="text-pink-700">Appointments</TableHead>
                  <TableHead className="text-pink-700">Medical Records</TableHead>
                  <TableHead className="text-pink-700">Medicine</TableHead>
                  <TableHead className="text-pink-700">Billing</TableHead>
                  <TableHead className="text-pink-700">Insurance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.patientName}</TableCell>
                    <TableCell>
                      {service.appointments.length > 0 ? (
                        <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                          {service.appointments.map((appointment, idx) => (
                            <li key={idx}>
                              ID: {appointment.id}, Created At: {formatDate(appointment.createdAt)}, Updated At: {formatDate(appointment.updatedAt)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                        <li>Allergies: {service.medicalRecords.allergies.join(", ") || "N/A"}</li>
                        <li>Disabilities: {service.medicalRecords.disabilities.join(", ") || "N/A"}</li>
                        <li>Surgeries: {service.medicalRecords.surgeries.join(", ") || "N/A"}</li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      {service.medicine.length > 0 ? (
                        <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                          {service.medicine.map((med, idx) => (
                            <li key={idx}>
                              Name: {med.name}, Issued: {formatDate(med.dateIssued)}, Start: {formatDate(med.start)}, End: {formatDate(med.end)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {service.billing.length > 0 ? (
                        <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                          {service.billing.map((bill, idx) => (
                            <li key={idx}>
                              ID: {bill.id}, Issued: {formatDate(bill.dateIssued)}, Due: {formatDate(bill.dueDate)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {service.insurance.length > 0 ? (
                        <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                          {service.insurance.map((insurance, idx) => (
                            <li key={idx}>
                              Provider: {insurance.providerName}, Expiration: {formatDate(insurance.expirationDate)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
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
