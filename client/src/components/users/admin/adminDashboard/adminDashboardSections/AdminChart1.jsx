// This file shows appointment chart on dashboard

import React from 'react';
import Card from '../../../../ui/cardComponent/Card';
import CardHeader from '../../../../ui/cardComponent/CardHeader';
import CardTitle from '../../../../ui/cardComponent/CardTitle';
import CardContent from '../../../../ui/cardComponent/CardContent';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";
import ChartContainer from "../../../../ui/charts/ChartContainer";

const patientData = [
  { month: 'Jan', total: 100 },
  { month: 'Feb', total: 120 },
  { month: 'Mar', total: 90 },
  { month: 'Apr', total: 170 },
  { month: 'May', total: 130 },
  { month: 'Jun', total: 150 },
];

const AppointmentOverview = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Appointment Density</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            total: {
              label: "Total Patients",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line type="monotone" dataKey="total" stroke="#1f77b4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AppointmentOverview;