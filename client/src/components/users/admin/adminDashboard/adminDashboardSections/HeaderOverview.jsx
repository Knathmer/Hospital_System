import React from 'react';
import Card from '../../../../ui/cardComponent/Card';
import CardContent from '../../../../ui/cardComponent/CardContent';
import { Users, Smile, Calendar } from "lucide-react";

const StatsOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Doctors</p>
              <h3 className="text-2xl font-bold">98</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Smile className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold">1,072</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2"> {/* This makes the Total Appointments card span two columns */}
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Weekly Appointment Count</p>
              <h3 className="text-2xl font-bold">72</h3>
            </div>
          </div>
          {/* Insert additional content here for the expanded Total Appointments card, such as a graph or more data */}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
