import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/patientComponents/BillingCards/BillingCardExports";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Textarea from "../../components/ui/TextArea";
import Checkbox from "../../components/ui/Checkbox";
import { ArrowLeft, Plus, X } from "lucide-react";
import axios from "axios";

// Mock data for the appointment
const appointmentData = {
  patient: {
    name: "John Doe",
    dob: "1990-05-15",
    phone: "123-456-7890",
    email: "john.doe@example.com",
  },
  insurance: {
    provider: "HealthCare Inc.",
    policyNumber: "HC123456789",
    groupNumber: "GRP987654",
  },
  appointment: {
    date: "2023-06-01",
    time: "10:00 AM",
    reason: "Annual check-up",
    office: "Main Street Clinic",
  },
  medicalHistory: {
    allergies: ["Penicillin", "Peanuts"],
    disabilities: ["None"],
    familyHistory: ["Diabetes (Father)", "Hypertension (Mother)"],
  },
  medications: [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  ],
};

export default function AppointmentHandlerPage() {
  const [patientInformation, setPatientInformation] = useState({});
  const { appointmentID } = useParams(); //extract the appointmentID from the URL.
  const navigate = useNavigate();

  const fetchPatientInformation = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/auth/doctor/schedule/patient-info",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { appointmentID },
        }
      );
      setPatientInformation(response.data.patientInfo || {});
    } catch (error) {
      console.error("Error getting patient information: ", error);
    }
  };

  useEffect(() => {
    fetchPatientInformation();
  }, []);

  const [notes, setNotes] = useState("");
  const [showCharges, setShowCharges] = useState(false);
  const [selectedCharges, setSelectedCharges] = useState({
    labTests: false,
    xRay: false,
    medication: false,
  });
  const [customCharge, setCustomCharge] = useState({
    description: "",
    amount: "",
  });
  const [medications, setMedications] = useState(appointmentData.medications);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
  });

  const handleAddCharges = () => {
    setShowCharges(true);
  };

  const handleSaveCharges = () => {
    // In a real app, you'd save these charges to your backend
    console.log("Saving charges:", { selectedCharges, customCharge });
    setShowCharges(false);
  };

  const calculateTotalCharges = () => {
    let total = 100; // Base service price
    if (selectedCharges.labTests) total += 50;
    if (selectedCharges.xRay) total += 75;
    if (selectedCharges.medication) total += 30;
    if (customCharge.amount) total += parseFloat(customCharge.amount);
    return total.toFixed(2);
  };

  const handleCompleteAppointment = () => {
    // In a real app, you'd mark the appointment as complete in your backend
    console.log("Appointment completed");
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      setMedications([...medications, { ...newMedication, id: Date.now() }]);
      setNewMedication({ name: "", dosage: "", frequency: "" });
    }
  };

  const handleRemoveMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };
  const handleBackClick = () => {
    navigate("/doctor/schedule");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Button
          variant="ghost"
          className="mb-6 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
          onClick={() => handleBackClick()}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Schedule
        </Button>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Appointment Details
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600">
              <CardTitle className="text-white">Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              {patientInformation ? (
                <>
                  <p>
                    <strong>Name:</strong> {patientInformation.patientFullName}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(
                      patientInformation.dateOfBirth
                    ).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {patientInformation.phoneNumber
                      ? patientInformation.phoneNumber.slice(0, 3) +
                        "-" +
                        patientInformation.phoneNumber.slice(3, 6) +
                        "-" +
                        patientInformation.phoneNumber.slice(6)
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {patientInformation.email}
                  </p>
                </>
              ) : (
                <p>No patient information found!</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600">
              <CardTitle className="text-white">
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <p>
                <strong>Provider:</strong> {appointmentData.insurance.provider}
              </p>
              <p>
                <strong>Policy Number:</strong>{" "}
                {appointmentData.insurance.policyNumber}
              </p>
              <p>
                <strong>Group Number:</strong>{" "}
                {appointmentData.insurance.groupNumber}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600">
              <CardTitle className="text-white">
                Appointment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <p>
                <strong>Date:</strong> {appointmentData.appointment.date}
              </p>
              <p>
                <strong>Time:</strong> {appointmentData.appointment.time}
              </p>
              <p>
                <strong>Reason:</strong> {appointmentData.appointment.reason}
              </p>
              <p>
                <strong>Office:</strong> {appointmentData.appointment.office}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600">
              <CardTitle className="text-white">Medical History</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <p>
                <strong>Allergies:</strong>{" "}
                {appointmentData.medicalHistory.allergies.join(", ")}
              </p>
              <p>
                <strong>Disabilities:</strong>{" "}
                {appointmentData.medicalHistory.disabilities.join(", ")}
              </p>
              <p>
                <strong>Family History:</strong>{" "}
                {appointmentData.medicalHistory.familyHistory.join(", ")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600">
            <CardTitle className="text-white">Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between bg-pink-50 p-3 rounded-lg border border-pink-100"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{med.name}</p>
                    <p className="text-sm text-gray-600">
                      {med.dosage} - {med.frequency}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMedication(med.id)}
                    className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Input
                placeholder="Medication name"
                value={newMedication.name}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, name: e.target.value })
                }
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
              <Input
                placeholder="Dosage"
                value={newMedication.dosage}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
              <Input
                placeholder="Frequency"
                value={newMedication.frequency}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    frequency: e.target.value,
                  })
                }
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
              <Button
                onClick={handleAddMedication}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Medication
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600">
            <CardTitle className="text-white">Appointment Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <Label htmlFor="notes" className="text-gray-700">
                Add Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter appointment notes"
                rows={4}
                className="mt-1 w-full border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600">
            <CardTitle className="text-white">Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              {!showCharges && (
                <Button
                  onClick={handleAddCharges}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Add Charges
                </Button>
              )}
              {showCharges && (
                <div className="space-y-4">
                  <p className="font-semibold text-gray-800">
                    Base Service Price: $100.00
                  </p>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      Select Additional Charges:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="labTests"
                          checked={selectedCharges.labTests}
                          onCheckedChange={(checked) =>
                            setSelectedCharges((prev) => ({
                              ...prev,
                              labTests: checked,
                            }))
                          }
                          className="border-pink-300 text-pink-600 focus:ring-pink-500"
                        />
                        <label
                          htmlFor="labTests"
                          className="ml-2 text-gray-700"
                        >
                          Lab Tests - $50.00
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="xRay"
                          checked={selectedCharges.xRay}
                          onCheckedChange={(checked) =>
                            setSelectedCharges((prev) => ({
                              ...prev,
                              xRay: checked,
                            }))
                          }
                          className="border-pink-300 text-pink-600 focus:ring-pink-500"
                        />
                        <label htmlFor="xRay" className="ml-2 text-gray-700">
                          X-Ray - $75.00
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="medication"
                          checked={selectedCharges.medication}
                          onCheckedChange={(checked) =>
                            setSelectedCharges((prev) => ({
                              ...prev,
                              medication: checked,
                            }))
                          }
                          className="border-pink-300 text-pink-600 focus:ring-pink-500"
                        />
                        <label
                          htmlFor="medication"
                          className="ml-2 text-gray-700"
                        >
                          Medication - $30.00
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      Custom Charge:
                    </p>
                    <div className="flex space-x-2">
                      <div className="flex-grow">
                        <Label
                          htmlFor="customChargeDescription"
                          className="text-gray-700"
                        >
                          Description
                        </Label>
                        <Input
                          id="customChargeDescription"
                          value={customCharge.description}
                          onChange={(e) =>
                            setCustomCharge((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Enter description"
                          className="mt-1 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="customChargeAmount"
                          className="text-gray-700"
                        >
                          Amount
                        </Label>
                        <Input
                          id="customChargeAmount"
                          type="number"
                          value={customCharge.amount}
                          onChange={(e) =>
                            setCustomCharge((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="mt-1 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      Summary of Charges:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Base Service: $100.00</li>
                      {selectedCharges.labTests && <li>Lab Tests: $50.00</li>}
                      {selectedCharges.xRay && <li>X-Ray: $75.00</li>}
                      {selectedCharges.medication && (
                        <li>Medication: $30.00</li>
                      )}
                      {customCharge.amount && (
                        <li>
                          {customCharge.description}: $
                          {parseFloat(customCharge.amount).toFixed(2)}
                        </li>
                      )}
                    </ul>
                    <p className="mt-2 font-bold text-lg text-gray-800">
                      Total Amount: ${calculateTotalCharges()}
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveCharges}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    Save Charges
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleCompleteAppointment}
          className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white text-lg py-3"
        >
          Mark Appointment as Complete
        </Button>
      </div>
    </div>
  );
}
