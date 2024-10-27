import React, { useState } from 'react';

// Mock data for specialties and doctors
const specialties = [
  { id: 1, name: "Gynecology" },
  { id: 2, name: "Obstetrics" },
  { id: 3, name: "Fertility" },
];

const doctors = [
  { id: 1, name: "Dr. Emily Johnson", specialtyId: 1 },
  { id: 2, name: "Dr. Sarah Smith", specialtyId: 2 },
  { id: 3, name: "Dr. Michael Brown", specialtyId: 3 },
];

const BookPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const filteredDoctors = doctors.filter(
    doctor => doctor.specialtyId === parseInt(selectedSpecialty)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      specialty: selectedSpecialty,
      doctor: selectedDoctor,
      date: selectedDate,
      time: appointmentTime,
      reason,
    });
  };

  return (
    <section className="min-w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Book Your Appointment
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 py-6">
              Schedule your visit with our expert healthcare professionals. We're here to provide you with comprehensive care and support.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">Select Specialty</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id.toString()}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={!selectedSpecialty}
              >
                <option value="">Select Doctor</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id.toString()}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>
            <div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Reason for appointment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition duration-300"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default BookPage;