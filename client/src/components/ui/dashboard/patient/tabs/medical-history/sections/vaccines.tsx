import React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../../../../../input";
import DefaultButton from "../../../../../buttons/defaultButton";

const Vaccines = () => {
  const [vaccines, setVaccines] = useState([{ name: "", date: "" }]);
  const addVaccine = () => {
    setVaccines([...vaccines, { name: "", date: "" }]);
  };

  const removeVaccine = (index: number) => {
    setVaccines(vaccines.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Vaccination History</h2>
      {vaccines.map((vaccine, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="Vaccine name"
            value={vaccine.name}
            onChange={(e) => {
              const newVaccines = [...vaccines];
              newVaccines[index].name = e.target.value;
              setVaccines(newVaccines);
            }}
          />
          <Input
            type="date"
            value={vaccine.date}
            onChange={(e) => {
              const newVaccines = [...vaccines];
              newVaccines[index].date = e.target.value;
              setVaccines(newVaccines);
            }}
          />
          <DefaultButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeVaccine(index)}
          >
            <Trash2 className="h-4 w-4" />
          </DefaultButton>
        </div>
      ))}
      <DefaultButton type="button" variant="outline" onClick={addVaccine}>
        <Plus className="h-4 w-4 mr-2" />
        Add Vaccine
      </DefaultButton>
    </div>
  );
};

export default Vaccines;
