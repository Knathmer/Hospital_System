import React, { useEffect, useState } from "react";
import axios from "axios";
import GenericContainer from "./GenericContainer";
import { CreditCard } from "lucide-react";
import NavButton from "../../../../ui/buttons/NavButton";

import envConfig from "../../../../../envConfig";

const BillingNotificationsPatientDashboard = () => {
  const [billingDashboard, setBillingDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillingDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${envConfig.apiUrl}/dataFetch/get-billing-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBillingDashboard(response.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setBillingDashboard([]);
          } else {
            console.error(
              "Error fetching billing data:",
              error.response.data || error
            );
            setError("Failed to fetch billing data");
          }
        } else {
          console.error("Error fetching billing data:", error);
          setError("Failed to fetch billing data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBillingDashboard();
  }, []);

  return (
    <GenericContainer>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard className="h-5 w-5 text-pink-500 mr-2" />
        Billing Status
      </h2>

      <div className="overflow-y-auto" style={{ maxHeight: "150px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : billingDashboard.length > 0 ? (
          <ul className="space-y-2">
            {billingDashboard.map((bill, index) => (
              <li key={index}>
                <span className="font-medium">
                  Due Date: {new Date(bill.dueDate).toLocaleDateString()}
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  Status: {bill.paidStatus ? "Paid" : "Unpaid"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No billing data available</p>
        )}
      </div>

      <NavButton variant="outline" to="/patient/dashboard?tab=billing">
          View All Billing Statements
        </NavButton>
    </GenericContainer>
  );
};

export default BillingNotificationsPatientDashboard;
