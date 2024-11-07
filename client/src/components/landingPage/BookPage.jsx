import { useState, useEffect } from "react";
import axios from "axios";
import IconLogo from "./header/IconLogo";
import Navbar from "./header/Navbar";
import NavButton from "../ui/buttons/NavButton";

function BookPage() {
    // State variables for form data
    const [specialty, setSpecialty] = useState("");
    const [specialties, setSpecialties] = useState([]); // State for specialties
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState(""); // For success/error messages
    const [bookedTimes, setBookedTimes] = useState([]); // Booked times for selected doctor and date
    const [availableTimes, setAvailableTimes] = useState([]); // Available times after excluding booked times

    // Define business hours and time intervals
    const BUSINESS_HOURS_START = 9; // 9 AM
    const BUSINESS_HOURS_END = 17; // 5 PM
    const TIME_INTERVAL = 30; // in minutes

    // Fetch specialties when component mounts
    useEffect(() => {
        axios.get("http://localhost:3000/appointment/specialties")
            .then(response => setSpecialties(response.data))
            .catch(error => console.error("Error fetching specialties:", error));
    }, []);

    // Fetch doctors based on specialty
    useEffect(() => {
        if (specialty) {
            axios.get("http://localhost:3000/appointment/doctors", {
                params: { specialty }
            })
            .then(response => setDoctors(response.data))
            .catch(error => console.error("Error fetching doctors:", error));
        } else {
            setDoctors([]);
            setDoctor("");
        }
    }, [specialty]);

    // Fetch booked times when doctor and date are selected
    useEffect(() => {
        if (doctor && date) {
            axios.get("http://localhost:3000/appointment/appointments", {
                params: { doctorID: doctor, date }
            })
            .then(response => setBookedTimes(response.data.bookedTimes))
            .catch(error => {
                console.error("Error fetching booked times:", error);
                setBookedTimes([]);
            });
        } else {
            setBookedTimes([]);
        }
    }, [doctor, date]);

    // Generate available times based on booked times
    useEffect(() => {
        const generateAvailableTimes = () => {
            const times = [];
            for (let hour = BUSINESS_HOURS_START; hour < BUSINESS_HOURS_END; hour++) {
                for (let min = 0; min < 60; min += TIME_INTERVAL) {
                    const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                    times.push(timeStr);
                }
            }

            // Exclude booked times
            const available = times.filter(t => !bookedTimes.includes(t));
            setAvailableTimes(available);
            // Reset time selection if it's no longer available
            if (!available.includes(time)) {
                setTime("");
            }
        };

        generateAvailableTimes();
    }, [bookedTimes, time]);

    // Handle form submission for booking an appointment
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const appointmentDateTime = `${date}T${time}:00`; // Format date and time
            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:3000/appointment/book", 
                { appointmentDateTime, reason, doctorID: doctor },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message); // Display success message
            // Optionally, reset the form
            setSpecialty("");
            setDoctor("");
            setDate("");
            setTime("");
            setReason("");
            setBookedTimes([]);
            setAvailableTimes([]);
        } catch (error) {
            setMessage(error.response?.data.message || "Error booking appointment");
            console.error("Error booking appointment:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-16 flex items-center">
                <IconLogo />
                <Navbar />
                <div className="px-6">
                    <NavButton className="text-sm" to="/login">
                        Log in
                    </NavButton>
                </div>
            </header>
        <section className="min-w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-pink-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            Book an Appointment
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 py-6">
                            Schedule your visit with our expert healthcare professionals. We&apos;re here to provide you with comprehensive care and support.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty:</label>
                            <select 
                                value={specialty} 
                                onChange={(e) => setSpecialty(e.target.value)} 
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a specialty</option>
                                {specialties.map((spec) => (
                                    <option key={spec.specialty} value={spec.specialty}>
                                        {spec.specialty}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor:</label>
                            <select 
                                value={doctor} 
                                onChange={(e) => setDoctor(e.target.value)} 
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map((doc) => (
                                    <option key={doc.doctorID} value={doc.doctorID}>
                                        Dr. {doc.firstName} {doc.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required 
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time:</label>
                            {doctor && date ? (
                                availableTimes.length > 0 ? (
                                    <select 
                                        value={time} 
                                        onChange={(e) => setTime(e.target.value)} 
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select a time</option>
                                        {availableTimes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-red-500">No available times for the selected doctor and date.</p>
                                )
                            ) : (
                                <input 
                                    type="time" 
                                    value={time} 
                                    onChange={(e) => setTime(e.target.value)} 
                                    required 
                                    disabled 
                                    placeholder="Select a doctor and date first"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason:</label>
                            <textarea 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)} 
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows={4}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={!time}
                            className="w-full py-2 px-4 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Book Appointment
                        </button>
                    </form>

                    {message && (
                        <p className={`mt-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </section>
        </div>
    );
}

export default BookPage;