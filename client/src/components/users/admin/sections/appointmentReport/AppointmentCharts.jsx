// client/src/components/users/admin/sections/AppointmentCharts.jsx

import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AppointmentCharts = ({ 
  statusCounts, 
  visitTypeCounts, 
  appointmentsByDate, 
  specialtyCounts, 
  serviceCounts 
}) => {
  // Prepare data for charts
  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8'],
      },
    ],
  };

  const visitTypeChartData = {
    labels: Object.keys(visitTypeCounts),
    datasets: [
      {
        data: Object.values(visitTypeCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A'],
      },
    ],
  };

  // Prepare data for line chart
  const lineChartData = {
    labels: appointmentsByDate ? Object.keys(appointmentsByDate) : [],
    datasets: [
      {
        label: 'Number of Appointments',
        data: appointmentsByDate ? Object.values(appointmentsByDate) : [],
        fill: false,
        borderColor: '#36A2EB',
      },
    ],
  };

   // Prepare data for specialty chart
   const specialtyChartData = {
    labels: Object.keys(specialtyCounts),
    datasets: [
      {
        data: Object.values(specialtyCounts),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8', '#FFA726', '#8D6E63', '#78909C', '#D4E157', '#90A4AE'
        ],
      },
    ],
  };

  // Prepare data for service chart
  const serviceChartData = {
    labels: Object.keys(serviceCounts),
    datasets: [
      {
        data: Object.values(serviceCounts),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8', '#FFA726', '#8D6E63', '#78909C', '#D4E157', '#90A4AE'
        ],
      },
    ],
  };

  // Chart options to adjust sizes
  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Pie Chart for Status */}
        <div className="relative h-48">
          <h3 className="text-xl font-semibold text-center">Appointments by Status</h3>
          <Pie data={statusChartData} options={pieOptions} />
        </div>
        {/* Pie Chart for Visit Type */}
        <div className="relative h-48">
          <h3 className="text-xl font-semibold text-center">Appointments by Visit Type</h3>
          <Pie data={visitTypeChartData} options={pieOptions} />
        </div>
        {/* Pie Chart for Specialties */}
        <div className="relative h-48">
          <h3 className="text-xl font-semibold text-center">Appointments by Specialty</h3>
          <Pie data={specialtyChartData} options={pieOptions} />
        </div>
        {/* Pie Chart for Services */}
        <div className="relative h-48">
          <h3 className="text-xl font-semibold text-center">Appointments by Service</h3>
          <Pie data={serviceChartData} options={pieOptions} />
        </div>
      </div>
      {/* Line Chart for Appointments over Time */}
      <div className="mt-6 relative h-64">
        <h3 className="text-xl font-semibold text-center">Appointments Over Time</h3>
        <Line data={lineChartData} options={lineOptions} />
      </div>
    </div>
  );
};

export default AppointmentCharts;