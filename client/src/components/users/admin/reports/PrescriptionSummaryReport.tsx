import React, { useState, useEffect } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/Table";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

import Label from "../../../ui/Label";
import Input from "../../../ui/Input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/Tabs";
import {
  PillIcon,
  CalendarIcon,
  Filter,
  ActivityIcon,
  UserIcon,
  Maximize2,
} from "lucide-react";

export default function PrescriptionSummaryReport() {
  type Prescription = {
    id: string;
    quantity: string;
    dosage: string;
    nextRefillDate: Date;
    adherenceRate: string;
    medicationName: string;
    provider: string;
    patientName: string;
    condition: string;
    nextAppointment: string;
  };
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<
    Prescription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    prescription: "",
    quantity: "",
    medication: "",
    patient: "",
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/dataFetch/get-patient-prescriptions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    const filtered = prescriptions.filter((prescription) => {
      return (
        prescription.id
          .toLowerCase()
          .includes(filters.prescription.toLowerCase()) &&
        prescription.quantity.toString().includes(filters.quantity) &&
        prescription.medicationName
          .toLowerCase()
          .includes(filters.medication.toLowerCase()) &&
        prescription.patientName
          .toLowerCase()
          .includes(filters.patient.toLowerCase())
      );
    });
    setFilteredPrescriptions(filtered);
  }, [filters, prescriptions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-50 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6 space-y-6 shadow-2xl rounded-lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-black">
          Prescription Summary Report
        </h1>

        <Card className="mb-6 border-pink-200 shadow-lg">
          <CardHeader className="border-b border-pink-200">
            <CardTitle className="flex items-center text-black">
              <Filter className="mr-2 h-4 w-4 text-pink-500" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="prescription-filter" className="text-pink-600">
                  Prescription ID
                </Label>
                <Input
                  id="prescription-filter"
                  name="prescription"
                  value={filters.prescription}
                  onChange={handleFilterChange}
                  placeholder="Filter by prescription ID"
                  className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <Label htmlFor="quantity-filter" className="text-pink-600">
                  Quantity
                </Label>
                <Input
                  id="quantity-filter"
                  name="quantity"
                  value={filters.quantity}
                  onChange={handleFilterChange}
                  placeholder="Filter by quantity"
                  type="number"
                  className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <Label htmlFor="medication-filter" className="text-pink-600">
                  Medication
                </Label>
                <Input
                  id="medication-filter"
                  name="medication"
                  value={filters.medication}
                  onChange={handleFilterChange}
                  placeholder="Filter by medication"
                  className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <Label htmlFor="patient-filter" className="text-pink-600">
                  Patient
                </Label>
                <Input
                  id="patient-filter"
                  name="patient"
                  value={filters.patient}
                  onChange={handleFilterChange}
                  placeholder="Filter by patient name"
                  className="mt-1 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="prescriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-pink-100 p-1 rounded-lg">
            <TabsTrigger
              value="prescriptions"
              //className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              <PillIcon className="mr-2 h-4 w-4" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger
              value="patient"
              //className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Patient
            </TabsTrigger>
            <TabsTrigger
              value="refills"
              className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Refills
            </TabsTrigger>
            <TabsTrigger
              value="adherence"
              className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
            >
              <ActivityIcon className="mr-2 h-4 w-4" />
              Adherence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions">
            <Card className="border-pink-200 shadow-lg relative">
              <CardHeader className="border-b border-pink-200">
                <CardTitle className="text-black">
                  Active Prescriptions
                </CardTitle>
                <button
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-pink-200 transition-colors"
                  onClick={() => {
                    // Implement expand functionality here
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription, index) => (
                      <TableRow key={index} className="hover:bg-pink-50">
                        <TableCell>{prescription.id}</TableCell>
                        <TableCell>{prescription.medicationName}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.quantity}</TableCell>
                        <TableCell>{prescription.provider}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patient">
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="border-b border-pink-200">
                <CardTitle className="text-black">Patient Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong className="text-pink-600">Name:</strong>{" "}
                    {filteredPrescriptions[0]?.patientName}
                  </p>
                  <p>
                    <strong className="text-pink-600">Condition:</strong>{" "}
                    {filteredPrescriptions[0]?.condition}
                  </p>
                  <p>
                    <strong className="text-pink-600">Next Appointment:</strong>{" "}
                    {filteredPrescriptions[0]?.nextAppointment}
                  </p>
                </div>
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
                        Medication
                      </TableHead>
                      <TableHead className="text-pink-700">
                        Next Refill
                      </TableHead>
                      <TableHead className="text-pink-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription, index) => (
                      <TableRow key={index} className="hover:bg-pink-50">
                        <TableCell>{prescription.medicationName}</TableCell>
                        <TableCell>{prescription.nextRefillDate}</TableCell>
                        {/* <TableCell>
                          <Badge
                            variant={
                              prescription.refillStatus === "Available"
                                ? "default"
                                : "secondary"
                            }
                            className="bg-pink-100 text-pink-700"
                          >
                            {prescription.refillStatus}
                          </Badge>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adherence">
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="border-b border-pink-200">
                <CardTitle className="text-black">
                  Medication Adherence
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPrescriptions.map((prescription, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-pink-600">
                        {prescription.medicationName}
                      </span>
                      <span className="text-pink-700 font-semibold">
                        {prescription.adherenceRate}%
                      </span>
                    </div>
                    {/* <Progress
                      value={prescription.adherenceRate}
                      className="w-full h-2 bg-pink-200"
                    >
                      <div
                        className="h-full bg-pink-500 rounded-full"
                        style={{ width: `${prescription.adherenceRate}%` }}
                      />
                    </Progress> */}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
