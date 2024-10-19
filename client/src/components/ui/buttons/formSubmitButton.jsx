import React from "react";
import NavButton from "./navButton";

const FormSubmitButton = () => {
  return (
    <div className="flex justify-end space-x-4">
      <NavButton variant="outline">Save as Draft</NavButton>
      <NavButton className="bg-pink-500 text-white hover:bg-pink-600">
        Submit Form
      </NavButton>
    </div>
  );
};

export default FormSubmitButton;
