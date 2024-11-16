import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MedicalHistorySection } from "../../components/DoctorComponents/MedicalHistorySection";
import Separator from "../../components/ui/Seperator";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Textarea from "../../components/ui/TextArea";
import Checkbox from "../../components/ui/Checkbox";
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

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
    allergies: [
      { name: "Penicillin", severity: "Severe", reaction: "Anaphylaxis" },
      { name: "Peanuts", severity: "Moderate", reaction: "Hives and swelling" },
    ],
    disabilities: [{ name: "None", details: "No known disabilities" }],
    vaccines: [
      { name: "Flu shot", date: "2023-01-15", details: "Annual vaccination" },
      { name: "COVID-19", date: "2022-06-30", details: "Booster shot" },
      { name: "Tetanus", date: "2020-03-10", details: "10-year booster" },
    ],
    surgeries: [
      {
        name: "Appendectomy",
        date: "2015-08-22",
        details: "Laparoscopic procedure",
      },
    ],
    familyHistory: [
      {
        condition: "Diabetes",
        relation: "Father",
        details: "Type 2, diagnosed at age 50",
      },
      {
        condition: "Hypertension",
        relation: "Mother",
        details: "Controlled with medication",
      },
    ],
  },
  medications: [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  ],
  previousAppointments: [
    { date: "2023-01-15", reason: "Flu symptoms", doctor: "Dr. Smith" },
    { date: "2022-09-30", reason: "Annual physical", doctor: "Dr. Johnson" },
    {
      date: "2022-05-12",
      reason: "Follow-up for hypertension",
      doctor: "Dr. Williams",
    },
  ],
};

export default function AppointmentPage() {
  const [patientInformation, setPatientInformation] = useState({});
  const [insuranceInformation, setInsuranceInformation] = useState({});
  const [appointmentInformation, setAppointmentInformation] = useState({});
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const { appointmentID } = useParams(); //extract the appointmentID from the URL.
  const navigate = useNavigate();

  const fetchPatientInformation = async () => {
    try {
      const token = localStorage.getItem("token");

      // Step 1: Fetch Patient Information
      const patientInfoResponse = await axios.get(
        "http://localhost:3000/auth/doctor/schedule/patient-info",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { appointmentID },
        }
      );

      const patientInfo = patientInfoResponse.data.patientInfo;
      setPatientInformation(patientInfo);

      // Step 2: Fetch Related Data in Parallel
      const patientID = patientInfo.patientID;

      const [
        insuranceInfoResponse,
        appointmentInfoResponse,
        allergiesInfoResponse,
        disabilitiesInfoResponse,
        vaccineInfoResponse,
        surgeriesInfoResponse,
        familyInfoResponse,
        previousAppointmentsResponse,
      ] = await Promise.all([
        axios.get("http://localhost:3000/auth/doctor/schedule/insurance-info", {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(
          "http://localhost:3000/auth/doctor/schedule/appointment-info",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { patientID, appointmentID },
          }
        ),
        axios.get("http://localhost:3000/auth/doctor/schedule/allergy-info", {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(
          "http://localhost:3000/auth/doctor/schedule/disability-info",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { patientID },
          }
        ),
        axios.get("http://localhost:3000/auth/doctor/schedule/vaccine-info", {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get("http://localhost:3000/auth/doctor/schedule/surgery-info", {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get("http://localhost:3000/auth/doctor/schedule/family-info", {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(
          "http://localhost:3000/auth/doctor/schedule/previous-appointments",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { patientID },
          }
        ),
      ]);

      // Step 3: Set States
      setInsuranceInformation(
        insuranceInfoResponse.data.insuranceInformation || {}
      );
      setAppointmentInformation(
        appointmentInfoResponse.data.appointmentInformation || {}
      );
      setAllergies(allergiesInfoResponse.data.allergiesInformation || []);
      setDisabilities(
        disabilitiesInfoResponse.data.disabilitiesInformation || []
      );
      setVaccines(vaccineInfoResponse.data.vaccineInformation || []);
      setSurgeries(surgeriesInfoResponse.data.surgeryInformation || []);
      setFamilyHistory(familyInfoResponse.data.familyHistoryInformation || []);
      setPreviousAppointments(
        previousAppointmentsResponse.data.previousAppointments || []
      );
    } catch (error) {
      console.error("Error fetching patient information: ", error);
    }
  };

  useEffect(() => {
    fetchPatientInformation();
  }, []);

  const handleBackClick = () => {
    navigate("/doctor/schedule");
  };

  //-----------------------------------------------------
  const [notes, setNotes] = useState("");
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
  const [medicalHistory, setMedicalHistory] = useState(
    appointmentData.medicalHistory
  );

  const handleSaveCharges = () => {
    // In a real app, you'd save these charges to your backend
    console.log("Saving charges:", { selectedCharges, customCharge });
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

  const handleAddMedicalHistoryItem = (category, item) => {
    setMedicalHistory((prev) => ({
      ...prev,
      [category]: [...prev[category], item],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Button
          variant="ghost"
          className="mb-6 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
          onClick={() => handleBackClick()}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Schedule
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Appointment Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Date and Time
              </Label>
              <p className="text-gray-900">
                {new Date(
                  appointmentInformation.appointmentDateTime
                ).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(
                  appointmentInformation.appointmentDateTime
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Reason
              </Label>
              <p className="text-gray-900">
                {appointmentInformation.serviceName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Office
              </Label>
              <p className="text-gray-900">
                {appointmentInformation.officeName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Reason
              </Label>
              <p className="text-gray-900">{appointmentInformation.reason}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Patient Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Name</Label>
              <p className="text-gray-900">
                {patientInformation.patientFullName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Date of Birth
              </Label>
              <p className="text-gray-900">
                {new Date(patientInformation.dateOfBirth).toLocaleDateString(
                  "en-US",
                  {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Phone</Label>
              <p className="text-gray-900">
                {patientInformation.phoneNumber
                  ? patientInformation.phoneNumber.slice(0, 3) +
                    "-" +
                    patientInformation.phoneNumber.slice(3, 6) +
                    "-" +
                    patientInformation.phoneNumber.slice(6)
                  : "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <p className="text-gray-900">{patientInformation.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Insurance Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Provider
              </Label>
              <p className="text-gray-900">
                {insuranceInformation.providerName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Policy Number
              </Label>
              <p className="text-gray-900">
                {insuranceInformation.policy_number}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Coverage Details
              </Label>
              <p className="text-gray-900">
                {insuranceInformation.coverageDetails}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Policy Expiration
              </Label>
              <p className="text-gray-900">
                {new Date(
                  insuranceInformation.coverage_expiration_date
                ).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Medical History
          </h2>
          <MedicalHistorySection
            title="Allergies"
            items={allergies}
            onAdd={(item) => handleAddMedicalHistoryItem("allergies", item)}
          />
          <MedicalHistorySection
            title="Disabilities"
            items={disabilities}
            onAdd={(item) => handleAddMedicalHistoryItem("disabilities", item)}
          />
          <MedicalHistorySection
            title="Vaccines"
            items={vaccines}
            onAdd={(item) => handleAddMedicalHistoryItem("vaccines", item)}
          />
          <MedicalHistorySection
            title="Surgeries"
            items={surgeries}
            onAdd={(item) => handleAddMedicalHistoryItem("surgeries", item)}
          />
          <MedicalHistorySection
            title="Family History"
            items={familyHistory}
            onAdd={(item) => handleAddMedicalHistoryItem("familyHistory", item)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Previous Appointments
          </h2>
          <div className="space-y-4">
            {previousAppointments.map((appointment) => (
              <div
                key={appointment.appointmentID}
                className="bg-gray-50 p-4 rounded-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </h4>
                  <span className="text-sm text-gray-600">
                    Dr. {appointment.doctorFullName}
                  </span>
                </div>
                <p className="text-gray-700">
                  Service: {appointment.serviceName}
                </p>
                <p className="text-gray-700">
                  Notes: {appointment.afterAppointmentNotes}
                </p>
                <p className="text-gray-700">
                  {appointment.officeName} at {appointment.officeAddress}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Medications</h2>
          <div className="space-y-4 mb-6">
            {medications.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-md"
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
          <div className="space-y-4">
            <Input
              placeholder="Medication name"
              value={newMedication.name}
              onChange={(e) =>
                setNewMedication({ ...newMedication, name: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Dosage"
                value={newMedication.dosage}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
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
              />
            </div>
            <Button
              onClick={handleAddMedication}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Medication
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Appointment Notes
          </h2>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter appointment notes"
            rows={6}
            className="w-full"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Charges</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Additional Charges
              </h3>
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
                  />
                  <label htmlFor="labTests" className="ml-2 text-gray-700">
                    Lab Tests - $50.00
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="xRay"
                    checked={selectedCharges.xRay}
                    onCheckedChange={(checked) =>
                      setSelectedCharges((prev) => ({ ...prev, xRay: checked }))
                    }
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
                  />
                  <label htmlFor="medication" className="ml-2 text-gray-700">
                    Medication - $30.00
                  </label>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Custom Charge
              </h3>
              <div className="flex space-x-4">
                <div className="flex-grow">
                  <Label htmlFor="customChargeDescription">Description</Label>
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
                  />
                </div>
                <div className="w-1/3">
                  <Label htmlFor="customChargeAmount">Amount</Label>
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
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Summary of Charges
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Base Service:</span> <span>$100.00</span>
                </li>
                {selectedCharges.labTests && (
                  <li className="flex justify-between">
                    <span>Lab Tests:</span> <span>$50.00</span>
                  </li>
                )}
                {selectedCharges.xRay && (
                  <li className="flex justify-between">
                    <span>X-Ray:</span> <span>$75.00</span>
                  </li>
                )}
                {selectedCharges.medication && (
                  <li className="flex justify-between">
                    <span>Medication:</span> <span>$30.00</span>
                  </li>
                )}
                {customCharge.amount && (
                  <li className="flex justify-between">
                    <span>{customCharge.description}:</span>{" "}
                    <span>${parseFloat(customCharge.amount).toFixed(2)}</span>
                  </li>
                )}
              </ul>
              <div className="mt-4 text-xl font-bold text-gray-900 flex justify-between">
                <span>Total Amount:</span>
                <span>${calculateTotalCharges()}</span>
              </div>
            </div>
            <Button
              onClick={handleSaveCharges}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              Save Charges
            </Button>
          </div>
        </div>

        <Button
          onClick={handleCompleteAppointment}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white text-lg py-3"
        >
          Mark Appointment as Complete
        </Button>
      </div>
    </div>
  );
}
