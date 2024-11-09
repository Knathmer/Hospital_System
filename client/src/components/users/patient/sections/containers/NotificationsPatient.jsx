// import React from "react";
// import GenericContainer from "./GenericContainer";
// import { Bell } from "lucide-react";
// import NavButton from "../../../../ui/buttons/NavButton";

// const NotificationsPatient = () => {
//   return (
//     <GenericContainer>
//       <h2 className="text-xl font-semibold mb-4 flex items-center">
//         <Bell className="h-5 w-5 text-pink-500 mr-2" />
//         Notifications
//       </h2>
//       <ul className="space-y-2">
//         <li className="text-sm">
//           Reminder: Your annual check-up is in 2 weeks
//         </li>
//         <li className="text-sm">
//           New message from Dr. Johnson about your recent lab results
//         </li>
//       </ul>
//       <NavButton variant="outline" className="mt-4">
//         See All Notifications
//       </NavButton>
//     </GenericContainer>
//   );
// };

// export default NotificationsPatient;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

import GenericContainer from "./GenericContainer";
import NavButton from "../../../../ui/buttons/NavButton";

const NotificationsPatient = () => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("http://localhost:3000/dataFetch/get-notification-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers for authorization
          },
        });
        setNotifications(response.data); // Update notifications state with the fetched data
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications"); // Set error message if request fails
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    fetchNotifications(); // Call fetchNotifications when component mounts
  }, []);

  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Bell className="h-5 w-5 text-pink-500 mr-2" />
        Notifications
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notification, index) => (
            <li key={index} className="text-sm">
              {notification.subject}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notifications available</p>
      )}

      <NavButton variant="outline" className="mt-4">
        See All Notifications
      </NavButton>
    </GenericContainer>
  );
};

export default NotificationsPatient;
