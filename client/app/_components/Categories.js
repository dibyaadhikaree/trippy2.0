"use client";

import { useEffect, useState } from "react";

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState([]);

  const categories = ["Adventure", "Nature", "Beach", "City", "Hiking"];

  const handleCategoryChange = (category) => {
    setActiveCategory(
      (prev) =>
        prev.includes(category)
          ? prev.filter((item) => item !== category) // Remove if already selected
          : [...prev, category] // Add if not selected
    );
  };

  //use effect and update the search params
  useEffect(() => {
    console.log(activeCategory, "changed");
  }, [activeCategory]);

  return (
    <div className="flex flex-wrap gap-3 my-2">
      {categories.map((category) => {
        const active = activeCategory.includes(category) ? true : false;

        return (
          <div
            key={category}
            className={`px-5 py-2 border-2 rounded-sm
                    border-primary-200 cursor-pointer
                hover:bg-primary-700   ${active ? "bg-primary-700" : ""}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </div>
        );
      })}
    </div>
  );
}
