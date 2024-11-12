import React from "react";
import { useState } from "react";
import { Plus, Syringe, Trash2 } from "lucide-react";
import Input from "../../../../../../ui/Input";
import DefaultButton from "../../../../../../ui/buttons/DefaultButton";

const Vaccines = ({ vaccines, setVaccines }) => {
  const addVaccine = () => {
    setVaccines([...vaccines, { name: "", date: null, doctor: null }]);
  };

  const removeVaccine = (index: number) => {
    setVaccines(vaccines.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Syringe className="h-5 w-5 mr-2 text-pink-500" />
        Vaccination History
      </h2>
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
          <Input
            placeholder="Doctor name"
            value={vaccine.doctor}
            onChange={(e) => {
              const newVaccines = [...vaccines];
              newVaccines[index].doctor = e.target.value;
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
