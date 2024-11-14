import { useState, useEffect } from "react";
import axios from "axios";

function BookPage() {
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // For row selection
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]); // Times already booked

  const BUSINESS_HOURS_START = 9; // 9 AM
  const BUSINESS_HOURS_END = 17; // 5 PM
  const TIME_INTERVAL = 30; // 30 minutes

  useEffect(() => {
    // Fetch specialties
    axios
      .get("http://localhost:3000/appointment/specialties")
      .then((response) => setSpecialties(response.data))
      .catch((error) => console.error("Error fetching specialties:", error));

    // Fetch office locations
    axios
      .get("http://localhost:3000/appointment/locations")
      .then((response) => setLocations(response.data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  useEffect(() => {
    // Fetch doctors based on filters
    axios
      .get("http://localhost:3000/appointment/doctors", {
        params: { specialty, gender, location, serviceID: selectedService },
      })
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, [specialty, gender, location, selectedService]);

  useEffect(() => {
    console.log("Doctors data updated:", doctors);
  }, [doctors]);

  useEffect(() => {
    if (specialty) {
      // Fetch services for the selected specialty
      axios
        .get("http://localhost:3000/appointment/services", {
          params: { specialtyID: specialty },
        })
        .then((response) => setServices(response.data))
        .catch((error) => {
          console.error("Error fetching services:", error);
          setServices([]);
        });
    } else {
      setServices([]);
    }
    // Reset selected service when specialty changes
    setSelectedService("");
  }, [specialty]);

  useEffect(() => {
    // Generate available times for the selected day
    const generateAvailableTimes = () => {
      const times = [];
      for (let hour = BUSINESS_HOURS_START; hour < BUSINESS_HOURS_END; hour++) {
        for (let min = 0; min < 60; min += TIME_INTERVAL) {
          const timeStr = new Date(0, 0, 0, hour, min).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          times.push(timeStr);
        }
      }
      setAvailableTimes(times);
    };

    if (date && selectedDoctor) {
      // Fetch booked times for the selected doctor and date
      axios
        .get("http://localhost:3000/appointment/appointments", {
          params: { doctorID: selectedDoctor.doctorID, date },
        })
        .then((response) => {
          setBookedTimes(response.data.bookedTimes); // Simplified mapping
        })
        .catch((error) => {
          console.error("Error fetching booked times:", error);
          setBookedTimes([]);
        });

      generateAvailableTimes();
    } else {
      setBookedTimes([]);
      setAvailableTimes([]);
    }
  }, [date, selectedDoctor]);

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    if (cleaned.length === 10) {
      const part1 = cleaned.slice(0, 3);
      const part2 = cleaned.slice(3, 6);
      const part3 = cleaned.slice(6);
      return `(${part1}) ${part2}-${part3}`;
    }
    return phoneNumber;
  };

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 5 || day === 6; // Sunday (5) and Saturday (6)
  };

  const convertTo24HourFormat = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setMessage("Please select a doctor.");
      return;
    }

    if (!selectedService) {
      setMessage("Please select a service.");
      return;
    }

    if (isWeekend(date)) {
      setMessage("Weekends are not available for appointments.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formattedTime = convertTo24HourFormat(time); // Convert to 24-hour format
      await axios.post(
        "http://localhost:3000/appointment/book",
        {
          appointmentDateTime: `${date}T${formattedTime}:00`,
          reason,
          doctorID: selectedDoctor.doctorID,
          officeID: selectedDoctor.officeID,
          serviceID: selectedService, // Include the selected service ID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Appointment booked successfully!");

      // Reset form fields
      setSpecialty("");
      setGender("");
      setLocation("");
      setDate("");
      setTime("");
      setReason("");
      setSelectedDoctor(null);
      setSelectedService("");
      setBookedTimes([]);
      setAvailableTimes([]);
    } catch (error) {
      setMessage("Error booking appointment.");
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="min-w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold">Book an Appointment</h1>
            <p className="mt-2 text-gray-500">
              Schedule your visit with our expert healthcare professionals.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Doctor Selection Section */}
            <div className="space-y-4 border-r pr-4">
              <h2 className="text-lg font-semibold">Select a Doctor</h2>
              <div>
                <label className="block text-sm font-medium">Specialty:</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((spec) => (
                    <option key={spec.specialtyID} value={spec.specialtyID}>
                      {spec.specialtyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Service:</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!services.length} // Disable if no services are available
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.serviceID} value={service.serviceID}>
                      {service.serviceName} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Location:</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Any</option>
                  {locations.map((loc) => (
                    <option key={loc.officeID} value={loc.officeName}>
                      {loc.officeName} - {loc.address}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Available Doctors</h3>
                <div className="space-y-2">
                  {doctors.length === 0 && (
                    <p>No Doctors Available For The Selected Fields</p>
                  )}
                  {doctors.map((doc) => (
                    <div
                      key={doc.doctorID}
                      className={`p-4 border rounded-md cursor-pointer ${
                        selectedDoctor?.doctorID === doc.doctorID
                          ? "bg-blue-100 border-blue-500"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      <p className="text-lg font-medium">
                        Dr. {doc.firstName} {doc.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Specialty: {doc.specialtyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Gender: {doc.gender}
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {doc.officeLocation} - {doc.officeAddress}
                      </p>
                      <p className="text-sm text-gray-500">
                        Phone: {formatPhoneNumber(doc.workPhoneNumber)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {doc.workEmail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Appointment Booking Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Appointment Details</h2>
              <div>
                <label className="block text-sm font-medium">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  className="w-full p-2 border rounded-md"
                />
                {isWeekend(date) && (
                  <p className="text-red-500 text-sm mt-1">
                    Weekends are not available for appointments.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Time:</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((t) => (
                    <option
                      key={t}
                      value={t}
                      disabled={bookedTimes.includes(t)} // Disable unavailable times
                      className={
                        bookedTimes.includes(t)
                          ? "text-gray-400 opacity-50"
                          : ""
                      }
                    >
                      {t} {bookedTimes.includes(t) ? "(Unavailable)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              {selectedService && (
                <div>
                  <p className="text-sm text-gray-700">
                    Selected Service:{" "}
                    {
                      services.find(
                        (service) =>
                          service.serviceID === parseInt(selectedService)
                      )?.serviceName
                    }
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium">Reason:</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-2 bg-blue-600 text-white rounded-md"
                disabled={!time || isWeekend(date)} // Disable if no time selected or weekend
              >
                Book Appointment
              </button>
              {message && (
                <p
                  className={`mt-4 ${
                    message.includes("successfully")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookPage;
