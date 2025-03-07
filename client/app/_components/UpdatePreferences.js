"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateUserPreference } from "../_services/data-services";

function UpdatePreferences({ user }) {
  const filters = [
    "Historical and Cultural Sites",
    "Religious Sites",
    "Natural Attractions",
    "Parks and Gardens",
    "Entertainment and Leisure",
    "Food and Shopping",
    "Landmarks and Viewpoints",
  ];

  const [selectedPreferences, setSelectedPreferences] = useState(
    user.preferences
  );
  const router = useRouter();

  const handleFilterChange = (preference) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((item) => item !== preference)
        : [...prev, preference]
    );
  };

  const handleSubmit = async () => {
    if (selectedPreferences.length === 0) {
      alert("Please select at least one preference.");
      return;
    }

    const data = await updateUserPreference(user, {
      preferences: selectedPreferences,
    });

    const params = new URLSearchParams();
    params.set("preferences", selectedPreferences.join(","));

    router.push(`/forYou?${params.toString()}`);
  };
  return (
    <div className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col ">
      <div className="gap-6 inline">
        <div className="grid grid-cols-4  mb-7">
          {filters.map((filter) => (
            <Button
              key={filter}
              handleFilterChange={() => handleFilterChange(filter)}
              activeFilters={selectedPreferences}
              filter={filter}
            >
              {filter}
            </Button>
          ))}
        </div>
        <ButtonSubmit handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}

function ButtonSubmit({ handleSubmit }) {
  // const { pending } = useFormStatus();

  return (
    <button
      // disabled={pending}
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all

    disabled:bg-gray-500 disabled:text-gray-300"
      onClick={handleSubmit}
    >
      {/* {pending ? "Update Profile" : "Update profile"} */}
      Submit
    </button>
  );
}

function Button({ filter, handleFilterChange, activeFilters, children }) {
  return (
    <button
      className={`text-[13pxs] px-2 py-2 hover:bg-primary-700 border-2 border-primary-600 m-1 ${
        activeFilters.includes(filter) ? "bg-primary-600" : ""
      }`}
      onClick={() => handleFilterChange(filter)}
    >
      {children}
    </button>
  );
}

export default UpdatePreferences;
