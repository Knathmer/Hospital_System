import React from 'react';

const ManageDoctors = () => {
    const doctors = [
        { id: 1, name: 'Dr. John Doe', specialization: 'Cardiology' },
        { id: 2, name: 'Dr. Jane Smith', specialization: 'Neurology' },
        { id: 3, name: 'Dr. Emily Johnson', specialization: 'Pediatrics' },
    ];

    return (
        <div>
            <h1>Manage Doctors</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>{doctor.id}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.specialization}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageDoctors;
