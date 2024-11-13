// planning to change this later, not sure data im gonna yet
import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from "../../../../ui/cardComponent";
import { Card } from '../../../../patientComponents/BillingCards/Card';
import { CardHeader } from '../../../../patientComponents/BillingCards/CardHeader';
import { CardTitle } from '../../../../patientComponents/BillingCards/CardTitle';
import { CardContent } from '../../../../patientComponents/BillingCards/CardContent';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import ChartContainer from "../../../../ui/charts/ChartContainer";

const compareData = [
  { month: 'Jan', icu: 30, opd: 45 },
  { month: 'Feb', icu: 40, opd: 60 },
  { month: 'Mar', icu: 35, opd: 50 },
  { month: 'Apr', icu: 50, opd: 70 },
  { month: 'May', icu: 45, opd: 80 },
  { month: 'Jun', icu: 60, opd: 90 },
];

const ICUvsOPDPatients = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>ICU vs OPD Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            icu: {
              label: "ICU",
              color: "hsl(var(--chart-1))",
            },
            opd: {
              label: "OPD",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="icu" fill="#1f77b4" />
              <Bar dataKey="opd" fill="#ff7f0e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ICUvsOPDPatients;