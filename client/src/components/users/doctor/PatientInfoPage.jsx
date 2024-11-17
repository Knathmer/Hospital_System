import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import envConfig from "../../../envConfig";

const PatientInfoPage = () => {
  const { patientID } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${envConfig.apiUrl}/auth/doctor/patient/${patientID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPatientData(data);
        } else {
          console.error("Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientID]);

  if (!patientData) {
    return <div>Loading...</div>;
  }

  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumberString;
  };

  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    address,
    allergies,
    disabilities,
    emergencyContacts,
    insurance,
    prescriptions,
    surgeries,
    vitals,
    vaccines,
    treatmentPlans,
    familyHistory,
    appointments,
    primaryPhysician,
  } = patientData;

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="bg-pink-500 text-white py-4 px-6">
        <button
          className="text-white font-bold bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded shadow"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <h1 className="text-3xl font-extrabold text-center">Patient Details</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Name:</h3>
                <p>{`${firstName} ${lastName}`}</p>
              </div>
              <div>
                <h3 className="font-semibold">Date of Birth:</h3>
                <p>{format(new Date(dateOfBirth), "MMM dd, yyyy")}</p>
              </div>
              <div>
                <h3 className="font-semibold">Gender:</h3>
                <p>{gender}</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone Number:</h3>
                <p>{formatPhoneNumber(phoneNumber)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email:</h3>
                <p>{email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Address:</h3>
                <p>{address}</p>
              </div>
            </div>

            {/* Allergies */}
            {allergies && allergies.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Allergies</h3>
                <ul className="list-disc list-inside">
                  {allergies.map((allergy) => (
                    <li key={allergy.allergyID}>
                      <strong>{allergy.allergen}</strong> - {allergy.reaction} (
                      {allergy.severity})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disabilities */}
            {disabilities && disabilities.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Disabilities</h3>
                <ul className="list-disc list-inside">
                  {disabilities.map((disability) => (
                    <li key={disability.disabilityID}>
                      <strong>{disability.disabilityType}</strong> -{" "}
                      {disability.notes}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emergency Contacts */}
            {emergencyContacts && emergencyContacts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Emergency Contacts</h3>
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.emergencyContactID}
                    className="border p-4 mb-4"
                  >
                    <p>
                      <strong>Name:</strong> {contact.firstName}{" "}
                      {contact.lastName}
                    </p>
                    <p>
                      <strong>Relationship:</strong> {contact.relationship}
                    </p>
                    <p>
                      <strong>Phone Number:</strong>{" "}
                      {formatPhoneNumber(contact.emergencyPhoneNumber)}
                    </p>
                    <p>
                      <strong>Email:</strong> {contact.emergencyEmail || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Insurance */}
            {insurance && insurance.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Insurance</h3>
                {insurance.map((ins) => (
                  <div key={ins.insuranceID} className="border p-4 mb-4">
                    <p>
                      <strong>Provider:</strong> {ins.providerName}
                    </p>
                    <p>
                      <strong>Policy Number:</strong> {ins.policy_number}
                    </p>
                    <p>
                      <strong>Coverage Details:</strong> {ins.coverageDetails}
                    </p>
                    <p>
                      <strong>Expiration Date:</strong>{" "}
                      {format(
                        new Date(ins.coverage_expiration_date),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Prescriptions */}
            {prescriptions && prescriptions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Prescriptions</h3>
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.prescriptionID}
                    className="border p-4 mb-4"
                  >
                    <p>
                      <strong>Medication:</strong> {prescription.medicationName}
                    </p>
                    <p>
                      <strong>Dosage:</strong> {prescription.dosage}{" "}
                      {prescription.frequency}
                    </p>
                    <p>
                      <strong>Instructions:</strong> {prescription.instruction}
                    </p>
                    <p>
                      <strong>Status:</strong> {prescription.activeStatus}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Surgeries */}
            {surgeries && surgeries.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Surgeries</h3>
                {surgeries.map((surgery) => (
                  <div key={surgery.surgeryID} className="border p-4 mb-4">
                    <p>
                      <strong>Type:</strong> {surgery.surgeryType}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(
                        new Date(surgery.surgeryDateTime),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Vitals */}
            {vitals && vitals.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Vitals</h3>
                {vitals.map((vital) => (
                  <div key={vital.vitalsId} className="border p-4 mb-4">
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(new Date(vital.recordDate), "MMM dd, yyyy")}
                    </p>
                    <p>
                      <strong>Height:</strong> {vital.height} cm
                    </p>
                    <p>
                      <strong>Weight:</strong> {vital.weight} kg
                    </p>
                    <p>
                      <strong>BMI:</strong> {vital.bmi}
                    </p>
                    <p>
                      <strong>Blood Pressure:</strong>{" "}
                      {vital.bloodPressureSystolic}/
                      {vital.bloodPressureDiastolic} mmHg
                    </p>
                    <p>
                      <strong>Heart Rate:</strong> {vital.heartRate} bpm
                    </p>
                    <p>
                      <strong>Body Temperature:</strong> {vital.bodyTemperature}{" "}
                      °C
                    </p>
                    <p>
                      <strong>Respiratory Rate:</strong> {vital.respiratoryRate}{" "}
                      breaths per minute
                    </p>
                    <p>
                      <strong>Notes:</strong> {vital.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Vaccines */}
            {vaccines && vaccines.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Vaccines</h3>
                {vaccines.map((vaccine) => (
                  <div key={vaccine.vaccineID} className="border p-4 mb-4">
                    <p>
                      <strong>Name:</strong> {vaccine.vaccineName}
                    </p>
                    <p>
                      <strong>Date Administered:</strong>{" "}
                      {format(
                        new Date(vaccine.dateAdministered),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Treatment Plans */}
            {treatmentPlans && treatmentPlans.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Treatment Plans</h3>
                {treatmentPlans.map((plan) => (
                  <div key={plan.treatmentPlanID} className="border p-4 mb-4">
                    <p>
                      <strong>Doctor:</strong> {plan.doctorFirstName}{" "}
                      {plan.doctorLastName}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {format(new Date(plan.startDate), "MMM dd, yyyy")}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {format(new Date(plan.endDate), "MMM dd, yyyy") ||
                        "Ongoing"}
                    </p>
                    <p>
                      <strong>Notes:</strong> {plan.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Family History */}
            {familyHistory && familyHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Family History</h3>
                {familyHistory.map((history) => (
                  <div
                    key={history.familyHistoryID}
                    className="border p-4 mb-4"
                  >
                    <p>
                      <strong>Condition:</strong> {history.condition}
                    </p>
                    <p>
                      <strong>Notes:</strong> {history.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Appointments */}
            {appointments && appointments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Completed Appointments</h3>
                {appointments.map((appointment) => (
                  <div
                    key={appointment.appointmentID}
                    className="border p-4 mb-4"
                  >
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(
                        new Date(appointment.appointmentDateTime),
                        "MMM dd, yyyy"
                      )}
                    </p>
                    <p>
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                    <p>
                      <strong>Visit Notes:</strong>{" "}
                      {appointment.visitNotes || "No notes available"}
                    </p>
                    <p>
                      <strong>Bill Amount:</strong>{" "}
                      {appointment.billAmount
                        ? `$${appointment.billAmount}`
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Bill Due Date:</strong>{" "}
                      {format(
                        new Date(appointment.billDueDate),
                        "MMM dd, yyyy"
                      ) || "N/A"}
                    </p>
                    <p>
                      <strong>Paid Amount:</strong>{" "}
                      {appointment.billPaidAmount
                        ? `$${appointment.billPaidAmount}`
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Bill Status:</strong>{" "}
                      {appointment.billPaidStatus || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Primary Physician */}
            {primaryPhysician && (
              <div className="mt-6">
                <h3 className="text-xl font-bold">Primary Physician</h3>
                <div className="border p-4 mb-4">
                  <p>
                    <strong>Name:</strong> {primaryPhysician.firstName}{" "}
                    {primaryPhysician.lastName}
                  </p>
                  <p>
                    <strong>Specialty:</strong> {primaryPhysician.specialty}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {formatPhoneNumber(primaryPhysician.workPhoneNumber)}
                  </p>
                  <p>
                    <strong>Email:</strong> {primaryPhysician.workEmail}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PatientInfoPage;
