import React, { useState, useEffect } from 'react';
import { Card } from '../../../../patientComponents/BillingCards/Card';
import { CardHeader } from '../../../../patientComponents/BillingCards/CardHeader';
import { CardTitle } from '../../../../patientComponents/BillingCards/CardTitle';
import { CardContent } from '../../../../patientComponents/BillingCards/CardContent';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const TotalUsersCharts = () => {
  const [userData, setUserData] = useState([
    { name: 'Patients', value: 0 },
    { name: 'Doctors', value: 0 },
    { name: 'Admin', value: 0 },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        
        const responsePatients = await axios.get('http://localhost:3000/dataFetch/get-total-patients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const responseDoctors = await axios.get('http://localhost:3000/dataFetch/get-total-doctors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const responseAdmins = await axios.get('http://localhost:3000/dataFetch/get-total-admin', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData([
          { name: 'Patients', value: responsePatients.data.totalPatient },
          { name: 'Doctors', value: responseDoctors.data.totalDoctors },
          { name: 'Admin', value: responseAdmins.data.totalAdmin },
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>WomenWell Users</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={userData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {userData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TotalUsersCharts;
