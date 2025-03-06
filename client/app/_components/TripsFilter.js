"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// import { jsx } from "react/jsx-runtime";

// function Filter() {
//   const searchParams = useSearchParams();

//   const router = useRouter();

//   const pathname = usePathname();

//   //   const activeFilter = searchParams.get("capacity") ?? "all";

//   const handleFilterChange = (filter) => {
//     const params = new URLSearchParams(searchParams);

//     params.set("capacity", filter);

//     router.push(pathname + "?" + params, { scroll: false });
//   };

//   return (
//     <div className="border border-primary-800 flex">
//       <Button
//         filter="all"
//         handleFilterChange={handleFilterChange}
//         activeFilter={activeFilter}
//       >
//         All Cabins
//       </Button>
//       <Button
//         filter="small"
//         handleFilterChange={handleFilterChange}
//         activeFilter={activeFilter}
//       >
//         2-3 guests
//       </Button>
//       <Button
//         filter="medium"
//         handleFilterChange={handleFilterChange}
//         activeFilter={activeFilter}
//       >
//         4-7 guests
//       </Button>
//       <Button
//         filter="large"
//         handleFilterChange={handleFilterChange}
//         activeFilter={activeFilter}
//       >
//         8-12 guests
//       </Button>
//     </div>
//   );
// }

// function Button({ filter, handleFilterChange, activeFilter, children }) {
//   return (
//     <button
//       className={`px-5 py-2 hover:bg-primary-700 ${
//         activeFilter === filter ? "bg-primary-600" : ""
//       }`}
//       onClick={() => handleFilterChange(filter)}
//     >
//       {children}
//     </button>
//   );
// }

// export default Filter;
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

function Filter({ user }) {
  const filters = [
    "Historical and Cultural Sites",
    "Religious Sites",
    "Natural Attractions",
    "Parks and Gardens",
    "Entertainment and Leisure",
    "Food and Shopping",
    "Landmarks and Viewpoints",
  ];

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Retrieve the 'preferences' parameter and split it into an array
  const activeFilters = searchParams.get("preferences")
    ? searchParams.get("preferences").split(",")
    : [];

  const handleFilterChange = (filter) => {
    const params = new URLSearchParams(searchParams);

    // Check if the filter is already active
    if (activeFilters.includes(filter)) {
      // Remove the filter
      const newFilters = activeFilters.filter((f) => f !== filter);
      if (newFilters.length > 0) {
        params.set("preferences", newFilters.join(","));
      } else {
        params.delete("preferences");
      }
    } else {
      // Add the filter
      const newFilters = [...activeFilters, filter];
      params.set("preferences", newFilters.join(","));
    }

    // Update the URL without causing a full page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex mb-7">
      {filters.map((filter) => (
        <Button
          key={filter}
          handleFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          filter={filter}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}

function Button({ filter, handleFilterChange, activeFilters, children }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 border-2 border-primary-600 m-2 ${
        activeFilters.includes(filter) ? "bg-primary-600" : ""
      }`}
      onClick={() => handleFilterChange(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;
