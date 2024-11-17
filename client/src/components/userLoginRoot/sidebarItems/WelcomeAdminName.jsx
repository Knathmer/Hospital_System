import { useEffect, useState } from "react";
import axios from "axios";

import envConfig from "../../../envConfig";

export default function AdminNameDisplay() {
  const [name, setName] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-admin-name`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setName(response.data);
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };
    fetchUserName();
  }, []);

  // This shows user's profile picture and first/last name
  return (
    <div className="flex items-center mt-6 p-4 bg-pink-50 rounded-lg shadow-md">
      <div className="mr-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
          alt="Doctor"
          className="w-20 h-20 rounded-full object-cover border-2 border-pink-500"
        />
      </div>
      <div>
        <h2 className="text-lg font-bold text-pink-600">Welcome</h2>
        <p className="text-sm text-gray-700">
          {name.firstName} {name.lastName}
        </p>
      </div>
    </div>
  );
}
