import React from 'react';
import { Card } from '../../../../patientComponents/BillingCards/Card';
import { CardHeader } from '../../../../patientComponents/BillingCards/CardHeader';
import { CardTitle } from '../../../../patientComponents/BillingCards/CardTitle';
import { CardContent } from '../../../../patientComponents/BillingCards/CardContent';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const userData = [
  { name: 'Patients', value: 1072 },
  { name: 'Doctors', value: 98 },
  { name: 'Staff', value: 50 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const TotalUsersCharts = () => {
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
