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
    const params = {
      gender,
      location,
      serviceID: selectedService,
    };
    if (specialty) {
      params.specialtyID = specialty;
    }

    axios
      .get("http://localhost:3000/appointment/doctors", {
        params,
      })
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, [specialty, gender, location, selectedService]);

  useEffect(() => {
    // Fetch services
    const params = {};
    if (specialty) {
      params.specialtyID = specialty;
    }

    axios
      .get("http://localhost:3000/appointment/services", {
        params,
      })
      .then((response) => setServices(response.data))
      .catch((error) => {
        console.error("Error fetching services:", error);
        setServices([]);
      });

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Book an Appointment
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Selection Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    Select a Doctor
                  </h2>
                  <div>
                    <label
                      htmlFor="specialty"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Specialty
                    </label>
                    <select
                      id="specialty"
                      name="specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
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
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Service
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
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
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
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
                    <h3 className="text-lg font-semibold text-gray-700">
                      Available Doctors
                    </h3>
                    <div className="space-y-2">
                      {doctors.length === 0 && (
                        <p className="text-gray-500">
                          No Doctors Available For The Selected Fields
                        </p>
                      )}
                      {doctors.map((doc) => (
                        <div
                          key={doc.doctorID}
                          className={`p-4 border border-gray-300 rounded-md cursor-pointer ${
                            selectedDoctor?.doctorID === doc.doctorID
                              ? "bg-pink-50 border-pink-500"
                              : "hover:bg-pink-50"
                          }`}
                          onClick={() => setSelectedDoctor(doc)}
                        >
                          <p className="text-lg font-medium text-gray-800">
                            Dr. {doc.firstName} {doc.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Specialty: {doc.specialtyName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Gender: {doc.gender}
                          </p>
                          <p className="text-sm text-gray-600">
                            Location: {doc.officeLocation} - {doc.officeAddress}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {formatPhoneNumber(doc.workPhoneNumber)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {doc.workEmail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Appointment Booking Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    Appointment Details
                  </h2>
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                    {isWeekend(date) && (
                      <p className="text-pink-500 text-sm mt-1">
                        Weekends are not available for appointments.
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((t) => (
                        <option
                          key={t}
                          value={t}
                          disabled={bookedTimes.includes(t)}
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
                    <label
                      htmlFor="reason"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Reason
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-pink-600 text-white font-semibold rounded-md shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition ${
                      !time || isWeekend(date) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!time || isWeekend(date)}
                  >
                    Book Appointment
                  </button>
                  {message && (
                    <p
                      className={`mt-4 ${
                        message.includes("successfully")
                          ? "text-green-500"
                          : "text-pink-600"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookPage;