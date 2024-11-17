// import React from 'react';
// import { Card } from '../../../../patientComponents/BillingCards/Card';
// import { CardHeader } from '../../../../patientComponents/BillingCards/CardHeader';
// import { CardTitle } from '../../../../patientComponents/BillingCards/CardTitle';
// import { CardContent } from '../../../../patientComponents/BillingCards/CardContent';
// import Button from "../../../../ui/Button.jsx";

// const appointments = [
//   { id: 1, patient: "Sarah Johnson", doctor: "Dr. Emily Chen", time: "09:00 AM" },
//   { id: 2, patient: "Michael Brown", doctor: "Dr. James Wilson", time: "10:30 AM" },
//   { id: 3, patient: "Emma Davis", doctor: "Dr. Maria Garcia", time: "02:00 PM" },
//   { id: 4, patient: "William Taylor", doctor: "Dr. Emily Chen", time: "03:30 PM" },
// ];

// const UpcomingAppointments = () => {
//   return (
//     <Card className="col-span-4">
//       <CardHeader>
//         <CardTitle>Upcoming Appointments</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {appointments.map((appointment) => (
//             <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
//               <div className="space-y-1">
//                 <p className="text-sm font-medium leading-none">{appointment.patient}</p>
//                 <p className="text-sm text-gray-500">{appointment.doctor}</p>
//               </div>
//               <div className="flex items-center gap-4">
//                 <p className="text-sm text-gray-500">{appointment.time}</p>
//                 <Button variant="outline" size="sm">View</Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default UpcomingAppointments;

import React, { useEffect, useState } from 'react';
import { Card } from '../../../../patientComponents/BillingCards/Card';
import { CardHeader } from '../../../../patientComponents/BillingCards/CardHeader';
import { CardTitle } from '../../../../patientComponents/BillingCards/CardTitle';
import { CardContent } from '../../../../patientComponents/BillingCards/CardContent';
import axios from 'axios';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:3000/dataFetch/get-upcoming-appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-[300px] overflow-y-auto">
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{appointment.patient}</p>
                <p className="text-sm text-gray-500">Dr. {appointment.doctor}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{appointment.date}</p>
                <p className="text-sm text-gray-500">{appointment.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
