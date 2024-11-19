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
import {
  ArrowLeft,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Pill,
  CircleMinus,
  CirclePlus,
  RotateCcw,
} from "lucide-react";
import envConfig from "../../envConfig.js";

export default function AppointmentPage() {
  const [patientInformation, setPatientInformation] = useState({});
  const [insuranceInformation, setInsuranceInformation] = useState({});
  const [appointmentInformation, setAppointmentInformation] = useState({});
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [medication, setMedication] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [medicationRefill, setMedicationRefill] = useState(null);
  const [deactivateConfirmation, setDeactivateConfirmation] = useState(null);
  const [reactivateConfirmation, setReactivateConfirmation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const { appointmentID } = useParams();
  const navigate = useNavigate();

  //State variables for prescribing a new medication
  const [isPrescribeModalOpen, setIsPrescribeModalOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    start: "",
    end: "",
    quantity: "",
    instruction: "",
    daySupply: "",
    refills: "",
    pharmacyID: "",
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // /tp State Variables for appointment notes
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(true); // Start in edit mode

  //-----------------------------------------------------

  //Additional charges State variables /qa

  //Addtional Charges fetched from the backend, used for display
  const [additionalCharges, setAdditonalCharges] = useState([]);

  //Holds the selected charges that the doctor selects, used for summing total.
  const [selectedCharges, setSelectedCharges] = useState({});

  //Holds the custom charge(s) that the doctor makes, can hold multiple (array).
  const [customCharges, setCustomCharges] = useState([]);

  //State for the base price, which is based off the service that the appointment is on.
  const [baseServicePrice, setBaseServicePrice] = useState(0);

  const [chargesSaved, setChargesSaved] = useState(false);

  const [isEditingCharges, setIsEditingCharges] = useState(true); // Start in edit mode

  const fetchPatientInformation = async () => {
    try {
      const token = localStorage.getItem("token");

      const patientInfoResponse = await axios.get(
        `${envConfig.apiUrl}/auth/doctor/schedule/patient-info`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { appointmentID },
        }
      );

      const patientInfo = patientInfoResponse.data.patientInfo;
      setPatientInformation(patientInfo);

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
        patientMedicationResponse,
      ] = await Promise.all([
        axios.get(`${envConfig.apiUrl}/auth/doctor/schedule/insurance-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(`${envConfig.apiUrl}/auth/doctor/schedule/appointment-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID, appointmentID },
        }),
        axios.get(`${envConfig.apiUrl}/auth/doctor/schedule/allergy-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(`${envConfig.apiUrl}/auth/doctor/schedule/disability-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(`${envConfig.apiUrl}/auth/doctor/schedule/vaccine-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(`${envConfig.apiUrl}/auth/doctor/schedule/surgery-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(`${envConfig.apiUrl}/auth/doctor/schedule/family-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID },
        }),
        axios.get(
          `${envConfig.apiUrl}/auth/doctor/schedule/previous-appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { patientID },
          }
        ),
        axios.get(
          `${envConfig.apiUrl}/auth/doctor/schedule/patient-medication`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { patientID },
          }
        ),
      ]);

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
      setMedication(patientMedicationResponse.data.patientMedication || []);

      const specialtyID =
        appointmentInfoResponse.data.appointmentInformation.specialtyID;

      const additionalChargeResponse = await axios.get(
        `${envConfig.apiUrl}/auth/doctor/schedule/additional-charges`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { specialtyID },
        }
      );

      setAdditonalCharges(
        additionalChargeResponse.data.additionalCharges || []
      );
      setBaseServicePrice(
        appointmentInfoResponse.data.appointmentInformation.price
      );
    } catch (error) {
      console.error("Error fetching patient information: ", error);
    }
  };

  useEffect(() => {
    fetchPatientInformation();
  }, []);

  const handleBackClick = () => {
    navigate("/doctor/dashboard?tab=schedule");
  };

  const fetchAllPharmacies = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const response = await axios.get(
        `${envConfig.apiUrl}/auth/doctor/schedule/get-pharmacies`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { patientID: patientInformation.patientID },
        }
      );
      setPharmacies(response.data.patientPharmacies || []);
    } catch (error) {
      console.error("Error fetching all pharmacies: ", error);
    }
  };
  const handleRemoveMedication = async (prescriptionID) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${envConfig.apiUrl}/auth/doctor/schedule/deactivate-medication`,
        { prescriptionID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedication((prevMedications) =>
        prevMedications.map((med) =>
          med.prescriptionID === prescriptionID ? { ...med, active: 0 } : med
        )
      );
      setDeactivateConfirmation(null);
    } catch (error) {
      console.error("Error deactivating medication:", error);
    }
  };

  const handleReactivateMedication = async (prescriptionID) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${envConfig.apiUrl}/auth/doctor/schedule/reactivate-medication`,
        { prescriptionID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedication((prevMedications) =>
        prevMedications.map((med) =>
          med.prescriptionID === prescriptionID ? { ...med, active: 1 } : med
        )
      );
      setReactivateConfirmation(null);
    } catch (error) {
      console.error("Error reactivating medication:", error);
    }
  };

  const handleRefillMedication = async (prescriptionID) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${envConfig.apiUrl}/auth/doctor/schedule/refill-medication`,
        { prescriptionID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset the refill count in the state
      setMedication((prevMedications) =>
        prevMedications.map((med) =>
          med.prescriptionID === prescriptionID
            ? { ...med, refillsRemaining: med.refillCount }
            : med
        )
      );

      setMedicationRefill(null); // Close the confirmation prompt
    } catch (error) {
      console.error("Error refilling medication:", error);
    }
  };

  const cancelRefill = () => {
    setMedicationRefill(null);
  };

  const cancelDeactivate = () => setDeactivateConfirmation(null);
  const cancelReactivate = () => setReactivateConfirmation(null);

  const handleSaveMedication = async () => {
    try {
      // Retrieve token for authorization
      const token = localStorage.getItem("token");

      // Destructure all required fields from newMedication
      const {
        medicationName,
        dosage,
        frequency,
        start,
        end,
        quantity,
        instruction,
        daySupply,
        refills,
        pharmacyID,
      } = newMedication;

      // Validate required fields
      if (
        !medicationName ||
        !dosage ||
        !frequency ||
        !start ||
        !quantity ||
        !daySupply ||
        refills === undefined
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // Ensure the end date (if provided) is after the start date
      if (end && new Date(end) < new Date(start)) {
        alert("End date must be after the start date.");
        return;
      }

      // Prepare payload for the backend
      const payload = {
        medicationName,
        dosage,
        frequency,
        start,
        end: end || null, // If end date is not provided, send null
        quantity,
        instruction: instruction || null, // If instruction is not provided, send null
        daySupply,
        refillCount: refills, // Use refills as refillCount for clarity
        refillsRemaining: refills,
        pharmacyID: pharmacyID || null,
        patientID: patientInformation.patientID,
      };

      // Make API call to save medication
      await axios.post(
        `${envConfig.apiUrl}/auth/doctor/schedule/add-medication`, // Update this URL to match your backend endpoint
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Close the modal and reset the form
      alert("Medication saved successfully!");
      handleCloseModal();
      setNewMedication({
        medicationName: "",
        dosage: "",
        frequency: "",
        start: "",
        end: "",
        quantity: "",
        instruction: "",
        daySupply: "",
        refills: "",
        pharmacyID: "",
      });
      setUnsavedChanges(false);

      // Optionally, update the medications list in the UI
      fetchPatientInformation(); // Replace this with your function to refresh medications
    } catch (error) {
      console.error("Error saving medication:", error);
      alert("An error occurred while saving the medication. Please try again.");
    }
  };

  const handleCloseModal = () => {
    if (unsavedChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) {
        return;
      }
    }
    // Reset form and close modal
    setNewMedication({
      medicationName: "",
      dosage: "",
      frequency: "",
      refills: "",
    });
    setIsPrescribeModalOpen(false);
    setUnsavedChanges(false);
  };

  // /pp Notes Functions
  const handleSaveNotes = () => {
    if (!notes.trim()) {
      alert("Please enter some notes before saving");
      return;
    }

    setIsEditingNotes(false);
  };

  // /cdb Handle complete function
  const handleCompleteAppointment = async () => {
    try {
      //Token is the doctor's payload
      const token = localStorage.getItem("token");
      const patientID = patientInformation.patientID; //Get patientID from the information we pulled originally.

      //appointmentID is a param, we already have that. That will be the
      //overall appointmentID for the entire appointment.

      const payload = {
        appointmentID,
        patientID,
        notes, // We will pass the notes the doctor puts, in here should be the information stored from the appointment notes part of the form.
      };

      //Passing an object : use req.body for it.
      //Passing auth : thats the doctor's payload req.user.doctorID has the DID, can be used for queries.
      await axios.post(
        `${envConfig.apiUrl}/auth/doctor/schedule/complete-appointment`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment marked as complete.");
      navigate("/doctor/dashboard?tab=schedule");
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert(
        "An error occurred while completing the appointment. Please try again."
      );
    }
  };
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  //Charge Functions -----------------------------/pa
  // Function to add a new custom charge
  const handleAddCustomCharge = () => {
    setCustomCharges((prev) => [...prev, { description: "", amount: "" }]);
  };

  // Function to remove a custom charge
  const handleRemoveCustomCharge = (index) => {
    setCustomCharges((prev) => prev.filter((_, idx) => idx !== index));
  };

  const calculateTotalCharges = () => {
    const basePrice = parseFloat(baseServicePrice) || 0;

    const additionalChargesTotal = Object.values(selectedCharges)
      .filter(Boolean)
      .reduce((sum, charge) => sum + parseFloat(charge.price), 0);

    const customChargesTotal = customCharges.reduce(
      (sum, charge) => sum + (parseFloat(charge.amount) || 0),
      0
    );

    return (basePrice + additionalChargesTotal + customChargesTotal).toFixed(2);
  };

  const handleSaveCharges = async () => {
    try {
      if (chargesSaved) {
        const confirmOverwrite = window.confirm(
          "Charges have already been saved. Do you want to overwrite the existing charges?"
        );
        if (!confirmOverwrite) {
          return;
        }
      }
      const invalidCustomCharges = customCharges.some((charge) => {
        return (
          !charge.description ||
          !charge.description.trim() ||
          !charge.amount ||
          isNaN(charge.amount) ||
          parseFloat(charge.amount) <= 0
        );
      });

      if (invalidCustomCharges) {
        alert(
          "Please ensure all custom charges have a description and a valid amount greater than zero."
        );
        return;
      }
      const token = localStorage.getItem("token");

      // Validate and sanitize data
      const data = {
        appointmentID, // from params
        baseServicePrice: parseFloat(baseServicePrice) || 0, // Default to 0 if invalid
        selectedAdditionalCharges: Object.values(selectedCharges)
          .filter(
            (charge) => charge && charge.ACTID && charge.price // Ensure valid entries
          )
          .map((charge) => ({
            ACTID: charge.ACTID,
            price: parseFloat(charge.price),
          })),
        customCharges: customCharges
          .filter(
            (charge) =>
              charge.description && charge.description.trim() && charge.amount // Ensure valid entries
          )
          .map((charge) => ({
            description: charge.description.trim(),
            amount: parseFloat(charge.amount),
          })),
        totalAmount: parseFloat(calculateTotalCharges()) || 0, // Default to 0 if invalid
        patientID: patientInformation.patientID,
        officeID: appointmentInformation.officeID,
        insuranceID: insuranceInformation.insuranceID || null,
        serviceID: appointmentInformation.serviceID,
      };

      await axios.post(
        `${envConfig.apiUrl}/auth/doctor/schedule/save-charges`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Charges saved successfully!");
      setChargesSaved(true);
      setIsEditingCharges(false);
    } catch (error) {
      console.error("Error saving charges:", error);
      alert("An error occurred while saving charges. Please try again.");
    }
  };

  const hasCharges = () => {
    const basePrice = parseFloat(baseServicePrice) || 0;

    const hasAdditionalCharges =
      Object.values(selectedCharges).filter(Boolean).length > 0;

    const hasCustomCharges =
      customCharges.length > 0 &&
      customCharges.some(
        (charge) => charge.description && parseFloat(charge.amount) > 0
      );

    return basePrice > 0 || hasAdditionalCharges || hasCustomCharges;
  };

  const renderSummaryOfCharges = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Summary of Charges
      </h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex justify-between">
          <span>Base Service:</span>
          <span>${parseFloat(baseServicePrice).toFixed(2)}</span>
        </li>
        {Object.values(selectedCharges)
          .filter(Boolean)
          .map((charge) => (
            <li key={charge.ACTID} className="flex justify-between">
              <span>{charge.name}:</span>
              <span>${parseFloat(charge.price).toFixed(2)}</span>
            </li>
          ))}
        {customCharges.map((customCharge, index) => (
          <li key={`custom-${index}`} className="flex justify-between">
            <span>{customCharge.description}:</span>
            <span>${parseFloat(customCharge.amount || 0).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-xl font-bold text-gray-900 flex justify-between">
        <span>Total Amount:</span>
        <span>${calculateTotalCharges()}</span>
      </div>
    </div>
  );

  const handleAddMedicalHistoryItem = async (type, item) => {
    try {
      const token = localStorage.getItem("token");
      const patientID = patientInformation.patientID;

      // Prepare payload for the backend
      let payload = {
        patientID,
        ...item,
      };

      const singularTitleMap = {
        Allergies: "Allergy",
        Disabilities: "Disability",
        Vaccines: "Vaccine",
        Surgeries: "Surgery",
        "Family History": "Family History", // No change needed
      };

      switch (type) {
        case "Allergies":
          // Validate severity
          const validSeverities = ["Mild", "Moderate", "Severe"];
          if (!validSeverities.includes(item.severity)) {
            alert(
              'Invalid severity value. Must be "Mild", "Moderate", or "Severe".'
            );
            return;
          }
          // Make API call
          const allergyResponse = await axios.post(
            `${envConfig.apiUrl}/auth/doctor/schedule/add-allergy`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Update the allergies state with the new item
          setAllergies((prev) => [
            ...prev,
            { ...item, allergyID: allergyResponse.data.allergyID },
          ]);
          break;

        case "Disabilities":
          const disabilityResponse = await axios.post(
            `${envConfig.apiUrl}/auth/doctor/schedule/add-disability`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDisabilities((prev) => [
            ...prev,
            { ...item, disabilityID: disabilityResponse.data.disabilityID },
          ]);
          break;

        case "Vaccines":
          // Date handling
          payload.dateAdministered = item.date;
          delete payload.date; // Remove 'date' as backend expects 'dateAdministered'

          const vaccineResponse = await axios.post(
            `${envConfig.apiUrl}/auth/doctor/schedule/add-vaccine`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setVaccines((prev) => [
            ...prev,
            {
              ...item,
              vaccineID: vaccineResponse.data.vaccineID,
              doctorFullName: "You",
              officeName: appointmentInformation.officeName || "Your Office",
            },
          ]);
          break;

        case "Surgeries":
          // Date handling
          payload.surgeryDateTime = item.date;
          delete payload.date; // Remove 'date' as backend expects 'surgeryDateTime'

          const surgeryResponse = await axios.post(
            `${envConfig.apiUrl}/auth/doctor/schedule/add-surgery`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSurgeries((prev) => [
            ...prev,
            {
              ...item,
              surgeryID: surgeryResponse.data.surgeryID,
              doctorFullName: "You",
              specialtyName:
                appointmentInformation.specialtyName || "Your Specialty",
              officeName: appointmentInformation.officeName || "Your Office",
            },
          ]);
          break;

        case "Family History":
          const familyHistoryResponse = await axios.post(
            `${envConfig.apiUrl}/auth/doctor/schedule/add-family-history`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFamilyHistory((prev) => [
            ...prev,
            {
              ...item,
              familyHistoryID: familyHistoryResponse.data.familyHistoryID,
            },
          ]);
          break;

        default:
          console.error("Unknown medical history type:", type);
      }

      // Optionally, show a success message
      await fetchPatientInformation();
      alert(`${singularTitleMap[type]} added successfully.`);
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      alert(
        `An error occurred while adding ${singularTitleMap[type]}. Please try again.`
      );
    }
  };

  useEffect(() => {
    if (isPrescribeModalOpen) {
      fetchAllPharmacies();
    }
  }, [isPrescribeModalOpen]);

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
          <div>
            {appointmentInformation.appointmentDateTime ? (
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
                  <p className="text-gray-900">
                    {appointmentInformation.reason}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Appointment information does not exist!
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Patient Information
          </h2>
          <div>
            {patientInformation.patientFullName ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <p className="text-gray-900">
                    {patientInformation.patientFullName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </Label>
                  <p className="text-gray-900">
                    {new Date(
                      patientInformation.dateOfBirth
                    ).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Phone
                  </Label>
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
                  <Label className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <p className="text-gray-900">{patientInformation.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Patient's information does not exist!
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Insurance Information
          </h2>
          <div>
            {insuranceInformation.providerName ? (
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
            ) : (
              <p className="text-center text-gray-400">
                Patient does not have insurance coverage.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Medical History
          </h2>
          <MedicalHistorySection
            title="Allergies"
            items={allergies}
            onAdd={(item) => handleAddMedicalHistoryItem("Allergies", item)}
          />
          <MedicalHistorySection
            title="Disabilities"
            items={disabilities}
            onAdd={(item) => handleAddMedicalHistoryItem("Disabilities", item)}
          />
          <MedicalHistorySection
            title="Vaccines"
            items={vaccines}
            onAdd={(item) => handleAddMedicalHistoryItem("Vaccines", item)}
          />
          <MedicalHistorySection
            title="Surgeries"
            items={surgeries}
            onAdd={(item) => handleAddMedicalHistoryItem("Surgeries", item)}
          />
          <MedicalHistorySection
            title="Family History"
            items={familyHistory}
            onAdd={(item) =>
              handleAddMedicalHistoryItem("Family History", item)
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Previous Appointments
          </h2>
          <div>
            {previousAppointments.length > 0 ? (
              <div className="space-y-4">
                {previousAppointments.map((appointment) => (
                  <div
                    key={appointment.appointmentID}
                    className="bg-gray-50 p-4 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </h4>
                      <span className="text-sm text-gray-600">
                        Dr. {appointment.doctorFullName}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      Service: {appointment.serviceName}
                    </p>
                    <p className="text-gray-700">
                      Notes: {appointment.notes || "None"}
                    </p>
                    <p className="text-gray-700">
                      {appointment.officeName} at {appointment.officeAddress}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Patient does not have any previous clinic visits.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Medications</h2>
          {/* Notification Box */}
          {medication.some(
            (med) => med.refillsRemaining === 0 && med.active === 1
          ) && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              <h3 className="font-semibold text-lg mb-2">Attention Needed:</h3>
              <p>
                The following medications have no refills remaining. Please
                refill or remove them:
              </p>
              <ul className="list-disc ml-5 mt-2">
                {medication
                  .filter(
                    (med) => med.refillsRemaining === 0 && med.active === 1
                  )
                  .map((med) => (
                    <li key={med.prescriptionID}>
                      {med.medicationName} - {med.dosage}, {med.frequency}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg mb-4">Active Medications</h3>
            {medication && medication.some((med) => med.active === 1) ? (
              <div className="space-y-4 mb-6">
                {medication
                  .filter((med) => med.active === 1)
                  .map((med) => (
                    <div
                      key={med.prescriptionID}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-md"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {med.medicationName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {med.dosage} - {med.frequency}
                        </p>
                        <p className="text-sm text-gray-600">
                          Refills: {med.refillsRemaining}/{med.refillCount}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {medicationRefill === med.prescriptionID ? (
                          <>
                            <p>Reset Refill Count?</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRefillMedication(med.prescriptionID)
                              }
                              className="text-green-600 hover:text-green-700 hover:bg-green-100"
                            >
                              Yes
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelRefill}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              No
                            </Button>
                          </>
                        ) : deactivateConfirmation === med.prescriptionID ? (
                          <>
                            <p>Deactivate this medication?</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveMedication(med.prescriptionID)
                              }
                              className="text-green-600 hover:text-green-700 hover:bg-green-100"
                            >
                              Yes
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelDeactivate}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              No
                            </Button>
                          </>
                        ) : (
                          <>
                            {med.refillsRemaining === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setMedicationRefill(med.prescriptionID)
                                }
                                className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
                              >
                                <Pill />
                                Refill
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeactivateConfirmation(med.prescriptionID)
                              }
                              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100"
                            >
                              <CircleMinus />
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 mb-6">
                Patient does not have any active medications.
              </p>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-4">
                Inactive Medications
              </h3>
              {medication.some((med) => med.active === 0) ? (
                <div className="space-y-4 mb-6">
                  {medication
                    .filter((med) => med.active === 0)
                    .map((med) => (
                      <div
                        key={med.prescriptionID}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-md"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {med.medicationName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {med.dosage} - {med.frequency}
                          </p>
                          <p className="text-sm text-gray-600">
                            Refills: {med.refillsRemaining}/{med.refillCount}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {reactivateConfirmation === med.prescriptionID ? (
                            <>
                              <p>Reactivate this medication?</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleReactivateMedication(med.prescriptionID)
                                }
                                className="text-green-600 hover:text-green-700 hover:bg-green-100"
                              >
                                Yes
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelReactivate}
                                className="text-red-600 hover:text-red-700 hover:bg-red-100"
                              >
                                No
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setReactivateConfirmation(med.prescriptionID)
                              }
                              className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 flex items-center space-x-2"
                            >
                              <RotateCcw className="h-5 w-5" />
                              <span>Reactivate</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 mb-6">
                  Patient does not have any inactive medications.
                </p>
              )}
            </div>
            <Button
              onClick={() => setIsPrescribeModalOpen(true)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Plus className="mr-2 h-5 w-5" /> Prescribe New Medication
            </Button>
          </div>
          {/*------------------------Dialog Pop up for medications----------------------------- */}
          {isPrescribeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh] animate-fade-in-up">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Prescribe New Medication
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-6">
                  {/* Medication Name */}
                  <div>
                    <label
                      htmlFor="medicationName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Medication Name
                    </label>
                    <input
                      id="medicationName"
                      value={newMedication.medicationName}
                      onChange={(e) => {
                        setNewMedication({
                          ...newMedication,
                          medicationName: e.target.value,
                        });
                        setUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="e.g., Lisinopril, Metformin, Ibuprofen"
                    />
                  </div>

                  {/* Dosage and Frequency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="dosage"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Dosage
                      </label>
                      <input
                        id="dosage"
                        value={newMedication.dosage}
                        onChange={(e) => {
                          setNewMedication({
                            ...newMedication,
                            dosage: e.target.value,
                          });
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="e.g., 10 mg, 500 mg, 5 ml"
                        pattern="^\d+\s?(mg|ml|g)$"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="frequency"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Frequency
                      </label>
                      <input
                        id="frequency"
                        value={newMedication.frequency}
                        onChange={(e) => {
                          setNewMedication({
                            ...newMedication,
                            frequency: e.target.value,
                          });
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="e.g., Once daily, Twice a day"
                      />
                    </div>
                  </div>

                  {/* Start and End Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="start"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        id="start"
                        type="date"
                        value={newMedication.start}
                        min={new Date().toISOString().split("T")[0]} // Restrict to today and future dates
                        onChange={(e) => {
                          const newStartDate = e.target.value;
                          setNewMedication((prev) => ({
                            ...prev,
                            start: newStartDate,
                            // If end date is before the new start date, reset it
                            end:
                              prev.end && newStartDate > prev.end
                                ? ""
                                : prev.end,
                          }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="end"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date (Optional)
                      </label>
                      <input
                        id="end"
                        type="date"
                        value={newMedication.end}
                        min={
                          newMedication.start ||
                          new Date().toISOString().split("T")[0]
                        } // End date must be after start date
                        onChange={(e) => {
                          setNewMedication((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* Quantity and Day Supply */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={newMedication.quantity}
                        onChange={(e) => {
                          setNewMedication({
                            ...newMedication,
                            quantity: e.target.value,
                          });
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="e.g., 30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="daySupply"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Day Supply
                      </label>
                      <input
                        id="daySupply"
                        type="number"
                        min="1"
                        value={newMedication.daySupply}
                        onChange={(e) => {
                          setNewMedication({
                            ...newMedication,
                            daySupply: e.target.value,
                          });
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="e.g., 30"
                      />
                    </div>
                  </div>

                  {/* Number of Refills */}
                  <div>
                    <label
                      htmlFor="refills"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Number of Refills
                    </label>
                    <input
                      id="refills"
                      type="number"
                      min="0"
                      value={newMedication.refills}
                      onChange={(e) => {
                        setNewMedication({
                          ...newMedication,
                          refills: e.target.value,
                        });
                        setUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="e.g., 3"
                    />
                  </div>

                  {/* Pharmacy  gx*/}

                  <div>
                    <label
                      htmlFor="pharmacy"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pharmacy
                    </label>
                    <select
                      id="pharmacy"
                      value={newMedication.pharmacyID || ""}
                      onChange={(e) => {
                        setNewMedication({
                          ...newMedication,
                          pharmacyID: e.target.value,
                        });
                        setUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="" disabled>
                        Select a Pharmacy
                      </option>
                      {pharmacies.map((pharmacy) => (
                        <option
                          key={pharmacy.pharmacyID}
                          value={pharmacy.pharmacyID}
                        >
                          {pharmacy.pharmacyName} - {pharmacy.city},{" "}
                          {pharmacy.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instructions */}
                  <div>
                    <label
                      htmlFor="instruction"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Instructions
                    </label>
                    <textarea
                      id="instruction"
                      value={newMedication.instruction}
                      onChange={(e) => {
                        setNewMedication({
                          ...newMedication,
                          instruction: e.target.value,
                        });
                        setUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="e.g., Take one tablet daily with food."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end mt-8 space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMedication}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors duration-200"
                  >
                    Save Medication
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/*------------------Appointment Notes------------------------ ggs*/}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Appointment Notes
          </h2>

          {isEditingNotes ? (
            // Notes are in edit mode
            <div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter appointment notes"
                rows={6}
                className="w-full mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleSaveNotes}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          ) : (
            // Notes are locked (read-only)
            <div>
              <p className="text-gray-800 whitespace-pre-wrap mb-4">{notes}</p>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setIsEditingNotes(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Edit Notes
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Charges Section       /ti */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Charges</h2>
          <div className="space-y-4">
            {isEditingCharges ? (
              <>
                {/* Additional Charges */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Additional Charges
                  </h3>
                  <div className="space-y-2">
                    {additionalCharges.length > 0 ? (
                      additionalCharges.map((charge) => (
                        <div key={charge.ACTID} className="flex items-center">
                          <Checkbox
                            id={`charge-${charge.ACTID}`}
                            checked={!!selectedCharges[charge.ACTID]}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedCharges((prev) => ({
                                ...prev,
                                [charge.ACTID]: checked ? charge : undefined,
                              }));
                            }}
                          />
                          <label
                            htmlFor={`charge-${charge.ACTID}`}
                            className="ml-2 text-gray-700"
                          >
                            {charge.name} - $
                            {parseFloat(charge.price).toFixed(2)}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No additional charges available for this specialty.
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Custom Charges */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Custom Charges
                  </h3>
                  {customCharges.map((customCharge, index) => (
                    <div key={index} className="flex space-x-4 mb-2">
                      <div className="flex-grow">
                        <Label htmlFor={`customChargeDescription-${index}`}>
                          Description
                        </Label>
                        <Input
                          id={`customChargeDescription-${index}`}
                          value={customCharge.description}
                          onChange={(e) => {
                            const updatedDescription = e.target.value;
                            setCustomCharges((prev) => {
                              const newCharges = [...prev];
                              newCharges[index].description =
                                updatedDescription;
                              return newCharges;
                            });
                          }}
                          placeholder="Enter description"
                          required
                        />
                      </div>
                      <div className="w-1/3">
                        <Label htmlFor={`customChargeAmount-${index}`}>
                          Amount
                        </Label>
                        <Input
                          id={`customChargeAmount-${index}`}
                          type="number"
                          value={customCharge.amount}
                          onChange={(e) => {
                            const updatedAmount = e.target.value;
                            setCustomCharges((prev) => {
                              const newCharges = [...prev];
                              newCharges[index].amount = updatedAmount;
                              return newCharges;
                            });
                          }}
                          placeholder="0.00"
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCustomCharge(index)}
                        className="text-red-600 hover:text-red-700 mt-6"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddCustomCharge}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    + Add Custom Charge
                  </Button>
                </div>

                <Separator />

                {/* Summary of Charges */}
                {renderSummaryOfCharges()}

                <Button
                  onClick={handleSaveCharges}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  disabled={!hasCharges()}
                >
                  Save Charges
                </Button>
              </>
            ) : (
              <>
                {/* Summary of Charges */}
                {renderSummaryOfCharges()}

                <Button
                  onClick={() => setIsEditingCharges(true)}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Edit Charges
                </Button>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={() => setIsCompleteDialogOpen(true)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white text-lg py-3"
        >
          Mark Appointment as Complete
        </Button>

        {isCompleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative overflow-y-auto max-h-[90vh] animate-fade-in-up">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Confirm Completion
                </h3>
                <button
                  onClick={() => setIsCompleteDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                <p className="text-gray-700">
                  Are you sure you want to mark this appointment as complete?
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-8 space-x-3">
                <button
                  onClick={() => setIsCompleteDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    handleCompleteAppointment();
                    setIsCompleteDialogOpen(false);
                  }}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors duration-200"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
