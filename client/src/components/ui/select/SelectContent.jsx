import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/cardComponent";
import Card from "../cardComponent/Card";
import CardContent from "../cardComponent/CardContent";
import CardHeader from "../cardComponent/CardHeader";
import CardTitle from "../cardComponent/CardTitle";
// import {
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../ui/Table";
import {Table} from "../../ui/Table";
import { TableCell } from "../../ui/Table";
import { TableHead } from "../../ui/Table";
import { TableHeader } from "../../ui/Table";
import { TableRow } from "../../ui/Table";

import Label from "../Label";
import Input from "../Input";
import Select from "../select/Select";
import { default as SelectComplete } from "react-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import { ActivityIcon, Maximize2 } from "lucide-react";
import SelectItem from "../select/SelectItem";
import SelectContent from "../select/SelectContent";
// import Button from "../../../ui/Button"; // Assuming there is a Button component available

// Static service types for the filter
const serviceTypes = ["appointment", "medical-records", "medicine", "billing", "insurance"];

// Fake static data for testing
const fakePatientServices = [
  {
    patientName: "P001",
    appointments: "appointment",
    medicalRecords: "General Checkup",
    medicine: "Dr. Smith",
    billing: "2024-11-01",
    insurance: "Completed",
    cost: "$100",
    insuranceCoverage: "80%",
    notes: "Follow-up in 3 months",
  },
  {
    patientName: "P002",
    appointments: "medicine",
    medicalRecords: "Blood Pressure Medication",
    medicine: "Dr. Adams",
    billing: "2024-11-02",
    insurance: "Scheduled",
    cost: "$50",
    insuranceCoverage: "50%",
    notes: "Prescription refill needed",
  },
  {
    patientName: "P003",
    appointments: "billing",
    medicalRecords: "Invoice #12345",
    medicine: "Billing Dept.",
    billing: "2024-11-03",
    insurance: "Cancelled",
    cost: "$300",
    insuranceCoverage: "None",
    notes: "Patient dispute over charges",
  },
];

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

  // Simulate fetching data
  useEffect(() => {
    setPatientServices(fakePatientServices);
    setFilteredServices(fakePatientServices);
  }, []);

  // Handle filter changes
  useEffect(() => {
    const filtered = patientServices.filter((service) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const serviceValue = service[key];
        return (
          typeof serviceValue === "string" &&
          serviceValue.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    });
    setFilteredServices(filtered);
  }, [filters, patientServices]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterOptionChange = (key) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const renderFilters = () => {
    const generateOptions = (key) => {
      const uniqueOptions = [
        ...new Set(fakePatientServices.map((option) => option[key])),
      ];
      return uniqueOptions.map((option) => ({
        label: option,
        value: option,
      }));
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(filters).map(([key, value]) => {
          return (
            <div key={key}>
              <Label htmlFor={`${key}-filter`} className="text-pink-600 capitalize">
                {key}
              </Label>
              <SelectComplete
                id={`${key}-filter`}
                options={generateOptions(key)}
                placeholder={`Filter by ${key}`}
                value={value ? { label: value, value } : null}
                onChange={handleFilterOptionChange(key)}
                isSearchable={true}
                isClearable
                className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                classNamePrefix="react-select"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6 space-y-6 shadow-2xl rounded-lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-black">Patient Services Report</h1>

        <div className="flex space-x-4 mb-6">
          <Button onClick={() => console.log("Patient Services button clicked")} className="bg-pink-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-pink-600">
            Patient Services
          </Button>
          <Button onClick={() => console.log("Patient Information button clicked")} className="bg-pink-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-pink-600">
            Patient Information
          </Button>
        </div>

        <Card className="mb-6 border-pink-200 shadow-lg">
          <CardHeader className="border-b border-pink-200">
            <CardTitle className="flex items-center text-black">
              <ActivityIcon className="mr-2 text-pink-500" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>{renderFilters()}</CardContent>
        </Card>

        <Card className="border-pink-200 shadow-lg relative">
          <CardHeader className="border-b border-pink-200">
            <CardTitle className="text-black">Patient Services Overview</CardTitle>
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-pink-200 transition-colors"
              onClick={() => console.log("Expand Patient Services")}
            >
              <Maximize2 className="h-5 w-5 text-pink-500" />
            </button>
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
                    <TableHead className="text-pink-700">Cost</TableHead>
                    <TableHead className="text-pink-700">Insurance Coverage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service, index) => (
                    <TableRow key={index} className="hover:bg-pink-50">
                      <TableCell>{service.patientName}</TableCell>
                      <TableCell>{service.appointments}</TableCell>
                      <TableCell>{service.medicalRecords}</TableCell>
                      <TableCell>{service.medicine}</TableCell>
                      <TableCell>{service.billing}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            service.insurance === "Scheduled"
                              ? "bg-yellow-200 text-yellow-800"
                              : service.insurance === "Completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {service.insurance}
                        </span>
                      </TableCell>
                      <TableCell>{service.cost}</TableCell>
                      <TableCell>{service.insuranceCoverage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
