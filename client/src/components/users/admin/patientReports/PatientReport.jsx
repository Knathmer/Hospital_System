import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/Table";
import Label from "../../../ui/Label";
import SelectComplete from "react-select";
import axios from "axios";
import { format } from "date-fns";

export default function PatientReportsDashboard() {
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

  useEffect(() => {
    const fetchPatientServices = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("http://localhost:3000/dataFetch/get-patient-services", {
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
  }, [filters, patientServices]);

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
                      <ul className="list-disc list-inside">
                        <li>ID: {service.appointments?.id || "N/A"}</li>
                        <li>Created At: {formatDate(service.appointments?.createdAt) || "N/A"}</li>
                        <li>Updated At: {formatDate(service.appointments?.updatedAt) || "N/A"}</li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        <li>Allergen: {service.medicalRecords?.allergen || "N/A"}</li>
                        <li>Disability: {service.medicalRecords?.disability || "N/A"}</li>
                        <li>Surgery: {service.medicalRecords?.surgery || "N/A"}</li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        <li>Name: {service.medicine?.name || "N/A"}</li>
                        <li>Date Issued: {formatDate(service.medicine?.dateIssued) || "N/A"}</li>
                        <li>Start: {formatDate(service.medicine?.start) || "N/A"}</li>
                        <li>End: {formatDate(service.medicine?.end) || "N/A"}</li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        <li>ID: {service.billing?.id || "N/A"}</li>
                        <li>Date Issued: {formatDate(service.billing?.dateIssued) || "N/A"}</li>
                        <li>Due Date: {formatDate(service.billing?.dueDate) || "N/A"}</li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        <li>Provider: {service.insurance?.providerName || "N/A"}</li>
                        <li>Expiration: {formatDate(service.insurance?.expirationDate) || "N/A"}</li>
                      </ul>
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
