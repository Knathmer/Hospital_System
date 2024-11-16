type Prescription = {
  prescriptionID: string;
  medication: string;
  dosage: string;
  quantity: string;
  provider: string;
  insurance: string;
  status: string;
  patientId: string;
  patientName: string;
  condition: string;
  nextAppointment: string;
  refillNumber: string;
  adherenceRate: string;
  [key: string]: string | undefined;
};

import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/Table";

import Label from "../../../ui/Label";
import Input from "../../../ui/Input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/Tabs";
import {
  PillIcon,
  CalendarIcon,
  ActivityIcon,
  UserIcon,
  Maximize2,
} from "lucide-react";

export default function PrescriptionSummaryReport() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<
    Prescription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [filters, setFilters] = useState({
    prescriptions: {
      prescriptionID: "",
      medication: "",
      dosage: "",
      quantity: "",
      provider: "",
      insurance: "",
      status: "",
    },
    refills: {
      patientId: "",
      medication: "",
      refillFrequency: "",
      provider: "",
    },
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("filters: ", filters);
        const response = await axios.get(
          "http://localhost:3000/auth/admin/get-prescription-report",

          {
            params: filters,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response pres report: ", response.data.data);
        setPrescriptions(response.data.data);
        setFilteredPrescriptions(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [activeTab === "prescriptions" && filters]);

  useEffect(() => {
    const filtered = prescriptions.filter((prescription) => {
      const activeFilters = filters[activeTab as keyof typeof filters];
      return Object.entries(activeFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const prescriptionValue = prescription[key as keyof Prescription];
        return (
          typeof prescriptionValue === "string" &&
          prescriptionValue.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    });
    setFilteredPrescriptions(filtered);
  }, [filters, prescriptions, activeTab]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [activeTab]: {
        ...(prevFilters[activeTab as keyof typeof filters] as Record<
          string,
          string
        >),
        [name]: value,
      },
    }));
  };

  const renderFilters = () => {
    console.log("activeTab: ", activeTab);
    const activeFilters = filters[activeTab as keyof typeof filters] as Record<
      string,
      string
    >;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(activeFilters).map(([key, value]: [string, string]) => {
          if (key === "refillFrequency") {
            return (
              <div key={key}>
                <Label
                  htmlFor={`${key}-filter`}
                  className="text-pink-600 capitalize"
                >
                  {key}
                </Label>
                <select
                  id={`${key}-filter`}
                  name={key}
                  value={value}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-pink-200 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                >
                  <option value="">Select frequency</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            );
          }
          return (
            <div key={key}>
              <Label
                htmlFor={`${key}-filter`}
                className="text-pink-600 capitalize"
              >
                {key}
              </Label>
              <Input
                id={`${key}-filter`}
                name={key}
                value={value}
                onChange={handleFilterChange}
                placeholder={`Filter by ${key}`}
                className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-50 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-black">
          Prescription Summary Report
        </h1>

        <Card className="mb-6 border-pink-200 shadow-lg">
          <CardHeader className="border-b border-pink-200">
            <CardTitle className="flex items-center text-black">
              <ActivityIcon className="mr-2 text-pink-500" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>{renderFilters()}</CardContent>
        </Card>

        <Tabs
          defaultValue="prescriptions"
          className="space-y-6"
          onTabChange={(value) => {
            setActiveTab(value);
            setFilters((prevFilters) => ({
              ...prevFilters,
              [value]: { ...prevFilters[value as keyof typeof filters] },
            }));
          }}
        >
          <TabsList className="grid w-full grid-cols-2 bg-pink-100 p-1 rounded-lg">
            <TabsTrigger
              value="prescriptions"
              className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              <PillIcon className="mr-2 h-4 w-4" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger
              value="refills"
              className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Refills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions">
            <Card className="border-pink-200 shadow-lg relative">
              <CardHeader className="border-b border-pink-200">
                <CardTitle className="text-black">
                  Insurance Prescription Approvals
                </CardTitle>
                <button
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-pink-200 transition-colors"
                  onClick={() => {
                    console.log("Expand Active Prescriptions");
                  }}
                >
                  <Maximize2 className="h-5 w-5 text-pink-500" />
                </button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-pink-50">
                      <TableHead className="text-pink-700">
                        Prescription ID
                      </TableHead>
                      <TableHead className="text-pink-700">
                        Medication
                      </TableHead>
                      <TableHead className="text-pink-700">Dosage</TableHead>
                      <TableHead className="text-pink-700">Quantity</TableHead>
                      <TableHead className="text-pink-700">Provider</TableHead>
                      <TableHead className="text-pink-700">Insurance</TableHead>
                      <TableHead className="text-pink-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription, index) => (
                      <TableRow key={index} className="hover:bg-pink-50">
                        <TableCell>{prescription.prescriptionID}</TableCell>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.quantity}</TableCell>
                        <TableCell>{prescription.provider}</TableCell>
                        <TableCell>{prescription.insurance}</TableCell>
                        <TableCell>{prescription.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refills">
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="border-b border-pink-200">
                <CardTitle className="text-black">Refill Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-pink-50">
                      <TableHead className="text-pink-700">
                        Patient ID
                      </TableHead>
                      <TableHead className="text-pink-700">
                        Medication
                      </TableHead>
                      <TableHead className="text-pink-700">Refill #</TableHead>
                      <TableHead className="text-pink-700">Provider</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription, index) => (
                      <TableRow key={index} className="hover:bg-pink-50">
                        <TableCell>{prescription.patientId}</TableCell>
                        <TableCell>{prescription.medicationName}</TableCell>
                        <TableCell>
                          {prescription.refillNumber}/
                          {filters.refills.refillFrequency === "monthly"
                            ? "month"
                            : "year"}
                        </TableCell>
                        <TableCell>{prescription.provider}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
