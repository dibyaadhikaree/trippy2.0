// app/search/page.js
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PlacesList from "./PlacesList";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const category = searchParams.get("preferences");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(
        `http://localhost:2000/api/places?headDestination=${location}&preferences=${category}`
      );

      const data = await response.json();

      setResults(data.data);
    };

    if (location || category) {
      fetchResults();
    }
  }, [location, category]);

  if (results.length === 0) return <div>Select to find your trips</div>;

  return (
    <div>
      <PlacesList places={results} />
    </div>
  );
};

export default SearchResults;
