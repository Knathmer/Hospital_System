// BookPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

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
    }, [bookedTimes]);

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
        <div>
            <h2>Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Specialty:</label>
                    <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
                        <option value="">Select a specialty</option>
                        {specialties.map((spec) => (
                            <option key={spec.specialty} value={spec.specialty}>
                                {spec.specialty}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Doctor:</label>
                    <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
                        <option value="">Select a doctor</option>
                        {doctors.map((doc) => (
                            <option key={doc.doctorID} value={doc.doctorID}>
                                Dr. {doc.firstName} {doc.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Date:</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                        min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                    />
                </div>

                <div>
                    <label>Time:</label>
                    {doctor && date ? (
                        availableTimes.length > 0 ? (
                            <select value={time} onChange={(e) => setTime(e.target.value)} required>
                                <option value="">Select a time</option>
                                {availableTimes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>No available times for the selected doctor and date.</p>
                        )
                    ) : (
                        <input 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            required 
                            disabled 
                            placeholder="Select a doctor and date first"
                        />
                    )}
                </div>

                <div>
                    <label>Reason:</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
                </div>

                <button type="submit" disabled={!time}>Book Appointment</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default BookPage;
