import React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../../../../../input";
import DefaultButton from "../../../../../buttons/defaultButton";

const Disabilities = () => {
  const [disabilities, setDisablilities] = useState([{ name: "" }]);
  const addDisability = () => {
    setDisablilities([...disabilities, { name: "" }]);
  };

  const removeDisability = (index: number) => {
    setDisablilities(disabilities.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Disability Information</h2>
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
