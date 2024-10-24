import React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../../../../../../ui/Input";
import DefaultButton from "../../../../../../ui/buttons/DefaultButton";

const Medications = () => {
  const [medications, setMedications] = useState([{ name: "" }]);
  const addMedication = () => {
    setMedications([...medications, { name: "" }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current Medications</h2>
      {medications.map((medication, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="Medication name"
            value={medication.name}
            onChange={(e) => {
              const newMedications = [...medications];
              newMedications[index].name = e.target.value;
              setMedications(newMedications);
            }}
          />

          <DefaultButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeMedication(index)}
          >
            <Trash2 className="h-4 w-4" />
          </DefaultButton>
        </div>
      ))}
      <DefaultButton type="button" variant="outline" onClick={addMedication}>
        <Plus className="h-4 w-4 mr-2" />
        Add Medication
      </DefaultButton>
    </div>
  );
};

export default Medications;
