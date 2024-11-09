import { useState, useEffect } from "react";
import axios from "axios";

function BookPage() {
    // State variables for form data
    const [specialty, setSpecialty] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [bookedTimes, setBookedTimes] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    const BUSINESS_HOURS_START = 9; 
    const BUSINESS_HOURS_END = 17; 
    const TIME_INTERVAL = 30;

    useEffect(() => {
        axios.get("http://localhost:3000/appointment/specialties")
            .then(response => setSpecialties(response.data))
            .catch(error => console.error("Error fetching specialties:", error));
    }, []);

    useEffect(() => {
        if (specialty) {
            axios.get("http://localhost:3000/appointment/doctors", { params: { specialty } })
                .then(response => setDoctors(response.data))
                .catch(error => console.error("Error fetching doctors:", error));
        } else {
            setDoctors([]);
            setDoctor("");
        }
    }, [specialty]);

    useEffect(() => {
        if (doctor && date) {
            axios.get("http://localhost:3000/appointment/appointments", { params: { doctorID: doctor, date } })
                .then(response => setBookedTimes(response.data.bookedTimes))
                .catch(error => setBookedTimes([]));
        } else {
            setBookedTimes([]);
        }
    }, [doctor, date]);

    useEffect(() => {
        const generateAvailableTimes = () => {
            const times = [];
            for (let hour = BUSINESS_HOURS_START; hour < BUSINESS_HOURS_END; hour++) {
                for (let min = 0; min < 60; min += TIME_INTERVAL) {
                    const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                    times.push(timeStr);
                }
            }
            setAvailableTimes(times.filter(t => !bookedTimes.includes(t)));
            if (!availableTimes.includes(time)) setTime("");
        };
        generateAvailableTimes();
    }, [bookedTimes, time]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:3000/appointment/book", {
                appointmentDateTime: `${date}T${time}:00`,
                reason,
                doctorID: doctor
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Appointment booked successfully!");
            setSpecialty("");
            setDoctor("");
            setDate("");
            setTime("");
            setReason("");
        } catch (error) {
            setMessage("Error booking appointment.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <section className="min-w-full py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-3xl font-bold">Book an Appointment</h1>
                        <p className="mt-2 text-gray-500">Schedule your visit with our expert healthcare professionals.</p>
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
                                    {specialties.map(spec => (
                                        <option key={spec.specialty} value={spec.specialty}>{spec.specialty}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Doctor:</label>
                                <select
                                    value={doctor}
                                    onChange={(e) => setDoctor(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">Select a doctor</option>
                                    {doctors.map(doc => (
                                        <option key={doc.doctorID} value={doc.doctorID}>
                                            Dr. {doc.firstName} {doc.lastName}
                                        </option>
                                    ))}
                                </select>
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
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Time:</label>
                                <select
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">Select a time</option>
                                    {availableTimes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
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
                            >
                                Book Appointment
                            </button>
                            {message && <p className="mt-4 text-green-500">{message}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BookPage;
