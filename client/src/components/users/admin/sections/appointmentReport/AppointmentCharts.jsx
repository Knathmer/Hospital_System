import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AppointmentCharts = ({ chartDisplayOptions, ...counts }) => {
  // Destructure counts
  const {
    statusCounts,
    visitTypeCounts,
    appointmentsByDate,
    specialtyCounts,
    serviceCounts,
    stateCounts,
    cityCounts,
    officeCounts,
    doctorCounts,
    patientCounts,
  } = counts;

  // Prepare chart data
  const prepareChartData = (dataCounts) => ({
    labels: Object.keys(dataCounts),
    datasets: [
      {
        data: Object.values(dataCounts),
        backgroundColor: generateColors(Object.keys(dataCounts).length),
      },
    ],
  });

  // Function to generate dynamic colors
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`hsl(${(i * 360) / numColors}, 70%, 50%)`);
    }
    return colors;
  };

  // Chart options
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

  // Line chart data
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

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {chartDisplayOptions.status && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by Status</h3>
            <Pie data={prepareChartData(statusCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.visitType && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by Visit Type</h3>
            <Pie data={prepareChartData(visitTypeCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.specialty && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by Specialty</h3>
            <Pie data={prepareChartData(specialtyCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.service && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by Service</h3>
            <Pie data={prepareChartData(serviceCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.state && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by State</h3>
            <Pie data={prepareChartData(stateCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.city && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by City</h3>
            <Pie data={prepareChartData(cityCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.office && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by Office</h3>
            <Pie data={prepareChartData(officeCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.doctor && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by Doctor</h3>
            <Pie data={prepareChartData(doctorCounts)} options={pieOptions} />
          </div>
        )}
        {chartDisplayOptions.patient && (
          <div className="relative h-48">
            <h3 className="text-xl font-semibold text-center">Appointments by Patient</h3>
            <Pie data={prepareChartData(patientCounts)} options={pieOptions} />
          </div>
        )}
      </div>
      {chartDisplayOptions.appointmentsOverTime && (
        <div className="mt-6 relative h-64">
          <h3 className="text-xl font-semibold text-center">Appointments Over Time</h3>
          <Line data={lineChartData} options={lineOptions} />
        </div>
      )}
    </div>
  );
};

export default AppointmentCharts;
