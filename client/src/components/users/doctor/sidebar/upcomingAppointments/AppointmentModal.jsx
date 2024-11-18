import React, { useState } from "react";

// Utility function to format phone numbers
const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumberString; // Return the original string if it doesn't match
};

function AppointmentModal({ appointment, onClose, onUpdateStatus }) {
  const [showConfirm, setShowConfirm] = useState({
    cancel: false,
    accept: false,
    reject: false,
  });

  const handleAction = (action) => {
    setShowConfirm({ [action]: true });
  };

  const confirmAction = (status) => {
    onUpdateStatus(appointment.appointmentID, status);
    setShowConfirm({ cancel: false, accept: false, reject: false });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &#10005;
        </button>
        <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
        <p>
          <strong>Reason:</strong> {appointment.reason || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {appointment.status}
        </p>
        <p>
          <strong>Service:</strong> {appointment.serviceName || "N/A"}
        </p>
        <p>
          <strong>Visit Type:</strong> {appointment.visitType || "N/A"}
        </p>
        <p>
          <strong>Date & Time:</strong>{" "}
          {new Date(appointment.appointmentDateTime).toLocaleString()}
        </p>
        <p>
          <strong>Patient:</strong> {appointment.patientFirstName}{" "}
          {appointment.patientLastName}
        </p>
        <p>
          <strong>Patient's Email:</strong> {appointment.patientEmail || "N/A"}
        </p>
        <p>
          <strong>Patient's Phone:</strong>{" "}
          {appointment.patientPhoneNumber
            ? formatPhoneNumber(appointment.patientPhoneNumber)
            : "N/A"}
        </p>
        {/* Add more details as needed */}
        <div className="flex justify-end mt-6 space-x-2">
          {(showConfirm.cancel || showConfirm.accept || showConfirm.reject) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p>
                  Are you sure you want to{" "}
                  {showConfirm.cancel
                    ? "cancel"
                    : showConfirm.accept
                    ? "accept"
                    : "reject"}{" "}
                  this appointment?
                </p>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() =>
                      confirmAction(
                        showConfirm.cancel
                          ? "Cancelled"
                          : showConfirm.accept
                          ? "Scheduled"
                          : "Request Denied"
                      )
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() =>
                      setShowConfirm({ cancel: false, accept: false, reject: false })
                    }
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          {appointment.status === "Requested" && (
            <>
              <button
                onClick={() => handleAction("accept")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
              >
                Reject
              </button>
            </>
          )}
          {appointment.status === "Scheduled" && (
            <button
              onClick={() => handleAction("cancel")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
            >
              Cancel Appointment
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;
