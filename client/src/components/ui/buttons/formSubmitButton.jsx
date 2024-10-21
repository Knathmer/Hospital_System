import React from "react";
import NavButton from "./navButton";
import DefaultButton from "./defaultButton";

const FormSubmitButton = () => {
  return (
    <div className="flex justify-end space-x-4">
      <NavButton variant="outline">Save as Draft</NavButton>
      <DefaultButton
        type="submit"
        className="bg-pink-500 text-white hover:bg-pink-600"
      >
        Submit Form
      </DefaultButton>
    </div>
  );
};

export default FormSubmitButton;
