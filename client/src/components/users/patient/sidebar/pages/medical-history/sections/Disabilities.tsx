import React from "react";
import { useState } from "react";
import { Activity, Plus, Trash2 } from "lucide-react";
import Input from "../../../../../../ui/Input";
import DefaultButton from "../../../../../../ui/buttons/DefaultButton";

const Disabilities = ({ disabilities, setDisablilities }) => {
  const addDisability = () => {
    setDisablilities([...disabilities, { name: null }]);
  };

  const removeDisability = (index: number) => {
    setDisablilities(disabilities.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Activity className="h-5 w-5 mr-2 text-pink-500" />
        Disability Information
      </h2>
      {disabilities.map((disability, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="Disability name"
            value={disability.name}
            onChange={(e) => {
              const newDisabilities = [...disabilities];
              newDisabilities[index].name = e.target.value;
              setDisablilities(newDisabilities);
            }}
          />

          <DefaultButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeDisability(index)}
          >
            <Trash2 className="h-4 w-4" />
          </DefaultButton>
        </div>
      ))}
      <DefaultButton type="button" variant="outline" onClick={addDisability}>
        <Plus className="h-4 w-4 mr-2" />
        Add Disability
      </DefaultButton>
    </div>
  );
};

export default Disabilities;
