import React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../../../../../input";
import DefaultButton from "../../../../../buttons/defaultButton";

const Allergies = () => {
  const [allergies, setAllergies] = useState([{ name: "" }]);
  const addAllergy = () => {
    setAllergies([...allergies, { name: "" }]);
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Allergies</h2>
      {allergies.map((allergy, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="Allergy name"
            value={allergy.name}
            onChange={(e) => {
              const newAllergies = [...allergies];
              newAllergies[index].name = e.target.value;
              setAllergies(newAllergies);
            }}
          />

          <DefaultButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeAllergy(index)}
          >
            <Trash2 className="h-4 w-4" />
          </DefaultButton>
        </div>
      ))}
      <DefaultButton type="button" variant="outline" onClick={addAllergy}>
        <Plus className="h-4 w-4 mr-2" />
        Add Allergy
      </DefaultButton>
    </div>
  );
};

export default Allergies;
