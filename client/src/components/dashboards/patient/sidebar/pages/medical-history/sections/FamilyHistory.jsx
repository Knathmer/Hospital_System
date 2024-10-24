import React from "react";
import Label from "../../../../../../ui/Label";
import Checkbox from "../../../../../../ui/Checkbox";

const FamilyHistory = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Family Medical History</h2>
      <div className="space-y-2">
        <Label>
          Has anyone in your family been diagnosed with the following?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Heart Disease",
            "Diabetes",
            "Cancer",
            "High Blood Pressure",
            "Stroke",
            "Mental Illness",
          ].map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                id={condition.toLowerCase().replace(/\s/g, "-")}
              />
              <Label htmlFor={condition.toLowerCase().replace(/\s/g, "-")}>
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyHistory;
