import React from "react";
import Label from "../../../../../../ui/label";
import Textarea from "../../../../../../ui/textArea";

const AdditionalInfo = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Additional Information</h2>
      <div>
        <Label htmlFor="additionalInfo">
          Is there anything else you would like us to know about your medical
          history?
        </Label>
        <Textarea
          id="additionalInfo"
          placeholder="Enter any additional information here"
        />
      </div>
    </div>
  );
};

export default AdditionalInfo;
