// import Image from "next/image";
// // import PreferenceFilter from "@/app/_components/PreferenceFilter";
// import { getHeadDestinations } from "../_services/data-services";
// import Trips from "@/app/_components/Trips";
// import TripsFilter from "@/app/_components/TripsFilter";

// export const metadata = {
//   title: "Find Trips",
// };

// export const revaldate = 10;

// export default async function Page() {
//   const headDestinations = await getHeadDestinations();

//   return (
//     <div>
//       <div
//         className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
//         // action={updateGuest}
//       >
//         <div className="space-y-2">
//           <label>Location</label>
//           <input
//             className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400 inline-flex"

//             // defaultValue={name}
//           />
//         </div>

//         <div className="space-y-2">
//           <label>Categories</label>
//           <TripsFilter />
//         </div>
//       </div>

//       <Trips />
//     </div>
//   );
// }

// function Button() {
//   // const { pending } = useFormStatus();

//   return (
//     <button
//       // disabled={pending}
//       className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all

//     disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
//     >
//       {" "}
//       Find Trips
//       {/* {pending ? "Update Profile" : "Update profile"} */}
//     </button>
//   );
// }

// pages/search.js

"use client";
// pages/search.js
import { useState, useEffect } from "react";
import {
  getCategoryList,
  getHeadDestinations,
} from "../_services/data-services";
import PlacesList from "../_components/PlacesList";
import TripsFilter from "../_components/TripsFilter";
import { useSearchParams } from "next/navigation";

// pages/search.js

// Mock function to simulate fetching locations from the backend
const getHeadDestination = async () => {
  // Replace this with your actual API call
  const response = await getHeadDestinations();

  return response;
};

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export default function SearchPage() {
  // State for form inputs
  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [trips, setTrips] = useState([]); // State to store fetched trips
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [locations, setLocations] = useState([]); // State to store fetched locations
  const [locationsLoading, setLocationsLoading] = useState(true); // Loading state for locations
  const [preferenceOptions, setPreferenceOptions] = useState([]);
  // List of preferences (you can fetch these dynamically if needed)

  const searchParams = useSearchParams();

  console.log(searchParams.get("preferences"));

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = [
          "Glenolden",
          "Oldsmar",
          "Santa Barbara",
          "Bala Cynwyd",
          "Reno",
          "University City",
          "St Louis",
          "Newtown",
          "Ballwin",
          "Bryn Mawr",
          "Burlington",
          "Brownsburg",
          "Indianapolis",
          "New Orleans",
          "Pottstown",
          "Tucson",
          "Ambler",
          "Plant City",
          "Ardmore",
          "Riverside",
          "St. Louis",
          "Edmonton",
          "Saint Louis",
          "Narberth",
          "Southampton",
          "Malvern",
          "Carpinteria",
          "Hermitage",
          "Tampa",
          "Chadds Ford",
          "Cherry Hill",
          "Langhorne",
          "Lambertville",
          "Carmel",
          "Lutz",
          "Pinellas Park",
          "Virginia City",
          "Alton",
          "Goleta",
          "Philadelphia",
          "King of Prussia",
          "Boise",
          "Largo",
          "Downingtown",
          "Spring Hill",
          "Noblesville",
          "Nashville",
          "Tampa Bay",
          "Lebanon",
          "Franklin",
          "Warminster",
          "Exton",
          "Brandon",
          "Fishers",
          "Saint Petersburg",
          "Meridian",
          "Mount Juliet",
          "Media",
          "Trenton",
          "Sherwood Park",
          "Ruskin",
          "Florissant",
          "Ashland City",
          "Edwardsville",
          "Conshohocken",
          "Voorhees",
          "Harvey",
          "Skippack",
          "Treasure Island",
          "West Chester",
          "Town and Country",
          "Clearwater",
          "Horsham",
          "Kenner",
          "Isla Vista",
          "St Petersburg",
          "Norristown",
          "Hazelwood",
          "Hernando Beach",
          "Wesley Chapel",
        ];
        setLocations(data); // Set the fetched locations
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLocationsLoading(false); // Reset loading state
      }
    };

    const fetchCategories = async () => {
      const data = await getCategoryList();
      setPreferenceOptions(data.map((cat) => cat.name));
    };

    fetchLocations();
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true); // Set loading state

    try {
      // Construct the query parameters
      const queryParams = new URLSearchParams({
        city: location, // Send the headDestination._id
        // preferences: searchParams.get("preferences") ?? "", // Convert array to comma-separated string
      });

      // Fetch data from the backend
      const response = await fetch(
        `http://localhost:2000/api/places?${queryParams}`
      );

      // console.log(
      //   "submitting wiht params",
      //   `http://localhost:2000/api/places?${queryParams}`
      // );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setTrips(data.data); // Set the fetched trips
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <h2 className="text-2xl font-semibold text-center">Search Trips</h2>
        {/* Location Dropdown */}
        <div>
          <label htmlFor="location">Select Location:</label>
          <select
            className="px-5 py-3 bg-primary-800 text-primary-200 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={locationsLoading} // Disable dropdown while loading
          >
            <option value="">Choose a location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {capitalizeFirstLetter(loc)}
              </option>
            ))}
          </select>
          {locationsLoading && <p>Loading locations...</p>}
        </div>

        {/* Preferences Checkboxes */}
        {/* <div>
          <label>Select Preferences:</label>
          {preferenceOptions.map((pref) => (
            <div key={pref}>
              <input
                type="checkbox"
                id={pref}
                value={pref}
                checked={preferences.includes(pref)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences([...preferences, pref]); // Add preference
                  } else {
                    setPreferences(preferences.filter((p) => p !== pref)); // Remove preference
                  }
                }}
              />
              <label htmlFor={pref}>{pref}</label>
            </div>
          ))}
        </div> */}

        {/* <TripsFilter filters={preferenceOptions} /> */}

        {/* Submit Button */}

        <div className="flex justify-end items-center gap-6">
          <button
            type="submit"
            className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all 
    disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
            disabled={loading || locationsLoading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Display Trips */}
      <div className=" flex flex-col gap-6 mt-10">
        <h2 className=" text-5xl font-semibold">Trips</h2>
        {loading ? (
          <p>Loading...</p>
        ) : trips.length > 0 ? (
          <ul>
            <PlacesList places={trips} />
          </ul>
        ) : (
          <p>Choose a location please 😊</p>
        )}
      </div>
    </div>
  );
}
