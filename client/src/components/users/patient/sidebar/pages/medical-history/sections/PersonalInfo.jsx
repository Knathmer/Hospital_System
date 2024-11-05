import React from "react";
import Label from "../../../../../../ui/Label";
import Input from "../../../../../../ui/Input";

const PersonalInfo = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <div className="flex-1 flex-cols-1  space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" required />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" required />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" required />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
