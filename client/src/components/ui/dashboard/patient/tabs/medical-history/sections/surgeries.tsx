import React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../../../../../input";
import DefaultButton from "../../../../../buttons/defaultButton";

const Surgeries = ({ surgeries, setSurgeries }) => {
  const addSurgery = () => {
    setSurgeries([...surgeries, { name: "", date: "", doctor: null }]);
  };

  const removeSurgery = (index: number) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Previous Surgeries</h2>
      {surgeries.map((surgery, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="Surgery name"
            value={surgery.name}
            onChange={(e) => {
              const newSurgeries = [...surgeries];
              newSurgeries[index].name = e.target.value;
              setSurgeries(newSurgeries);
            }}
          />
          <Input
            type="date"
            value={surgery.date}
            onChange={(e) => {
              const newSurgeries = [...surgeries];
              newSurgeries[index].date = e.target.value;
              setSurgeries(newSurgeries);
            }}
          />
          <Input
            placeholder="Doctor name"
            value={surgery.doctor}
            onChange={(e) => {
              const newSurgeries = [...surgeries];
              newSurgeries[index].doctor = e.target.value;
              setSurgeries(newSurgeries);
            }}
          />
          <DefaultButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeSurgery(index)}
          >
            <Trash2 className="h-4 w-4" />
          </DefaultButton>
        </div>
      ))}
      <DefaultButton type="button" variant="outline" onClick={addSurgery}>
        <Plus className="h-4 w-4 mr-2" />
        Add Surgery
      </DefaultButton>
    </div>
  );
};

export default Surgeries;
