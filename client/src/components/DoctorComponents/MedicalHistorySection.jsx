import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Plus } from "lucide-react";

// Configuration object
// Configuration object
const medicalHistoryConfig = {
  Allergies: {
    fields: [
      { name: "allergen", label: "Allergen", type: "text", required: true },
      { name: "severity", label: "Severity", type: "text", required: true },
      { name: "reaction", label: "Reaction", type: "text", required: true },
      { name: "notes", label: "Notes", type: "text" },
    ],
    itemKey: "allergyID",
    displayFields: ["allergen", "severity", "reaction", "notes"],
    displayFieldLabels: {
      allergen: "Allergen",
      severity: "Severity",
      reaction: "Reaction",
      notes: "Notes",
    },
  },
  Disabilities: {
    fields: [
      {
        name: "disabilityType",
        label: "Disability Type",
        type: "text",
        required: true,
      },
      { name: "notes", label: "Notes", type: "text" },
    ],
    itemKey: "disabilityID",
    displayFields: ["disabilityType", "notes"],
    displayFieldLabels: {
      disabilityType: "Disability Type",
      notes: "Notes",
    },
  },
  Vaccines: {
    fields: [
      {
        name: "vaccineName",
        label: "Vaccine Name",
        type: "text",
        required: true,
      },
      {
        name: "date",
        label: "Date Administered",
        type: "date",
        required: true,
      },
    ],
    itemKey: "vaccineID",
    displayFields: ["vaccineName", "date", "doctorFullName", "officeName"],
    displayFieldLabels: {
      vaccineName: "Vaccine Name",
      date: "Date Administered",
      doctorFullName: "Doctor",
      officeName: "Office",
    },
  },
  Surgeries: {
    fields: [
      {
        name: "surgeryType",
        label: "Surgery Type",
        type: "text",
        required: true,
      },
      { name: "date", label: "Date", type: "date", required: true },
    ],
    itemKey: "surgeryID",
    displayFields: [
      "surgeryType",
      "surgeryDateTime",
      "doctorFullName",
      "specialtyName",
      "officeName",
    ],
    displayFieldLabels: {
      surgeryType: "Surgery Type",
      surgeryDateTime: "Date",
      doctorFullName: "Doctor",
      specialtyName: "Specialty",
      officeName: "Office",
    },
  },
  "Family History": {
    fields: [
      { name: "condition", label: "Condition", type: "text", required: true },
      { name: "notes", label: "Notes", type: "text" },
    ],
    itemKey: "familyHistoryID",
    displayFields: ["condition", "notes"],
    displayFieldLabels: {
      condition: "Condition",
      notes: "Notes",
    },
  },
};

// Singular title mapping
const singularTitleMap = {
  Allergies: "Allergy",
  Disabilities: "Disability",
  Vaccines: "Vaccine",
  Surgeries: "Surgery",
  "Family History": "Family History", // No pluralization needed
};

export const MedicalHistorySection = ({ title, items, onAdd }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({});

  const config = medicalHistoryConfig[title];

  if (!config) {
    return null;
  }

  const handleAdd = () => {
    const requiredFields = config.fields.filter((field) => field.required);
    const isValid = requiredFields.every(
      (field) => newItem[field.name] && newItem[field.name].trim() !== ""
    );

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    onAdd(newItem);
    setNewItem({});
    setIsAddingNew(false);
  };

  const renderItems = () => {
    return items.map((item) => (
      <div
        key={item[config.itemKey]}
        className="bg-gray-50 p-4 rounded-md mb-2"
      >
        {config.displayFields.map((field) => {
          const fieldLabel =
            config.displayFieldLabels && config.displayFieldLabels[field]
              ? config.displayFieldLabels[field]
              : field;

          let fieldValue = item[field];

          if (
            fieldValue === null ||
            fieldValue === undefined ||
            fieldValue === ""
          ) {
            if (field === "doctorFullName" || field === "officeName") {
              fieldValue = "Out of System";
            } else {
              fieldValue = "None";
            }
          } else if (
            field === "date" ||
            field === "surgeryDateTime" ||
            field === "dateOfBirth"
          ) {
            fieldValue = new Date(fieldValue).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            });
          }

          return (
            <p key={field} className="text-sm text-gray-700">
              <span className="font-medium">{fieldLabel}:</span> {fieldValue}
            </p>
          );
        })}
      </div>
    ));
  };

  // Inside MedicalHistorySection component

  const renderForm = () => {
    return (
      <div className="space-y-4">
        {config.fields.map((field) => {
          if (field.name === "severity" && title === "Allergies") {
            // Render a select dropdown for severity
            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  id={field.name}
                  value={newItem[field.name] || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, [field.name]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="" disabled>
                    Select Severity
                  </option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            );
          } else if (field.type === "date") {
            // Render date input fields
            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={field.name}
                  type="date"
                  value={newItem[field.name] || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, [field.name]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            );
          } else {
            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  id={field.name}
                  type={field.type}
                  value={newItem[field.name] || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, [field.name]: e.target.value })
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      {items.length > 0 ? (
        <div className="space-y-2 mb-4">{renderItems()}</div>
      ) : (
        <p className="text-gray-500 mb-4">No {title.toLowerCase()} recorded.</p>
      )}
      {isAddingNew ? (
        <div className="bg-white p-4 rounded-md shadow-sm">
          {renderForm()}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => {
                setIsAddingNew(false);
                setNewItem({});
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              size="sm"
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Add {singularTitleMap[title]}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          variant="outline"
          size="sm"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New {singularTitleMap[title]}
        </Button>
      )}
    </div>
  );
};
