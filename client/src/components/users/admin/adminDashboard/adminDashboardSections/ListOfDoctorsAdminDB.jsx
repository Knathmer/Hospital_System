import React from 'react';
import { Card } from '../../../../patientComponents/BillingCards/Card';
import { CardHeader } from '../../../../patientComponents/BillingCards/CardHeader';
import { CardTitle } from '../../../../patientComponents/BillingCards/CardTitle';
import { CardContent } from '../../../../patientComponents/BillingCards/CardContent';



const doctors = [
  { id: 1, name: "Dr. Emily Chen", specialty: "Gynecologist" },
  { id: 2, name: "Dr. James Wilson", specialty: "Obstetrician" },
  { id: 3, name: "Dr. Maria Garcia", specialty: "Women's Health" },
  { id: 4, name: "Dr. Sarah Palmer", specialty: "Gynecologist" },
];

const DoctorsList = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Doctors List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium leading-none">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorsList;
