import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Plus } from "lucide-react";
import { all } from "axios";

export const MedicalHistorySection = ({ title, items, onAdd }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({});

  const handleAdd = () => {
    if (Object.values(newItem).some((value) => value.trim() !== "")) {
      onAdd(newItem);
      setNewItem({});
      setIsAddingNew(false);
    }
  };

  const renderItems = () => {
    switch (title) {
      case "Allergies":
        return items.map((allergy) => (
          <div
            key={allergy.allergyID}
            className="bg-pink-50 p-3 rounded-md mb-2"
          >
            <h4 className="font-semibold text-pink-700">{allergy.allergen}</h4>
            <p className="text-sm text-gray-600">
              Severity: {allergy.severity}
            </p>
            <p className="text-sm text-gray-600">
              Reaction: {allergy.reaction}
            </p>
          </div>
        ));
      case "Disabilities":
        return items.map((disability) => (
          <div
            key={disability.disabilityID}
            className="bg-pink-50 p-3 rounded-md mb-2"
          >
            <h4 className="font-semibold text-pink-700">
              {disability.disabilityType}
            </h4>
          </div>
        ));
      case "Vaccines":
        return items.map((vaccine) => (
          <div
            key={vaccine.vaccineID}
            className="bg-pink-50 p-3 rounded-md mb-2"
          >
            <h4 className="font-semibold text-pink-700">
              {vaccine.vaccineName}
            </h4>
            <p className="text-sm text-gray-600">
              Date Administered:{" "}
              {new Date(vaccine.date).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600">
              Doctor: {vaccine.doctorFullName}
            </p>
            <p className="text-sm text-gray-600">
              Office: {vaccine.officeName}
            </p>
          </div>
        ));

      case "Surgeries":
        return items.map((surgery) => (
          <div
            key={surgery.surgeryID}
            className="bg-pink-50 p-3 rounded-md mb-2"
          >
            <h4 className="font-semibold text-pink-700">
              {surgery.surgeryType}
            </h4>
            <p className="text-sm text-gray-600">
              Date:{" "}
              {new Date(surgery.surgeryDateTime).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600">
              Surgeon: {surgery.doctorFullName}
            </p>
            <p className="text-sm text-gray-600">
              Specialty: {surgery.specialtyName}
            </p>
            <p className="text-sm text-gray-600">
              Office: {surgery.officeName}
            </p>
          </div>
        ));
      case "Family History":
        return items.map((fam) => (
          <div
            key={fam.familyHistoryID}
            className="bg-pink-50 p-3 rounded-md mb-2"
          >
            <h4 className="font-semibold text-pink-700">{fam.condition}</h4>
            <p className="text-sm text-gray-600">Notes: {fam.notes}</p>
          </div>
        ));
      default:
        return null;
    }
  };

  const renderForm = () => {
    switch (title) {
      case "Allergies":
        return (
          <>
            <Input
              placeholder="Allergy name"
              value={newItem.name || ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Severity"
              value={newItem.severity || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, severity: e.target.value })
              }
              className="mb-2"
            />
            <Input
              placeholder="Reaction"
              value={newItem.reaction || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, reaction: e.target.value })
              }
              className="mb-2"
            />
          </>
        );
      case "Disabilities":
        return (
          <>
            <Input
              placeholder="Disability name"
              value={newItem.name || ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Details"
              value={newItem.details || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, details: e.target.value })
              }
              className="mb-2"
            />
          </>
        );
      case "Vaccines":
      case "Surgeries":
        return (
          <>
            <Input
              placeholder={`${title.slice(0, -1)} name`}
              value={newItem.name || ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="mb-2"
            />
            <Input
              type="date"
              value={newItem.date || ""}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Details"
              value={newItem.details || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, details: e.target.value })
              }
              className="mb-2"
            />
          </>
        );
      case "Family History":
        return (
          <>
            <Input
              placeholder="Condition"
              value={newItem.condition || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, condition: e.target.value })
              }
              className="mb-2"
            />
            <Input
              placeholder="Relation"
              value={newItem.relation || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, relation: e.target.value })
              }
              className="mb-2"
            />
            <Input
              placeholder="Details"
              value={newItem.details || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, details: e.target.value })
              }
              className="mb-2"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2 mb-4">{renderItems()}</div>
      {isAddingNew ? (
        <div className="bg-white p-4 rounded-md shadow-sm">
          {renderForm()}
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              onClick={() => setIsAddingNew(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} size="sm">
              Add
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New {title}
        </Button>
      )}
    </div>
  );
};
