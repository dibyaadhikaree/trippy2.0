const fs = require("fs");
const axios = require("axios");

const mongoose = require("mongoose");

const API_KEY = "5ae2e3f221c38a28845f05b6caad0c78eb2b0cfbbfc115fb6983b15a";
const BASE_URL = "https://api.opentripmap.com/0.1/en/places/";

const HeadDest = require("./model/headDestination");

// List of major cities & tourist destinations in Nepal
const headDestinations = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bhaktapur",
  "Dharan",
  "Bharatpur",
  "Biratnagar",
  "Hetauda",
  "Janakpur",
  "Lumbini",
  "Chitwan",
  "Ilam",
  "Bandipur",
  "Ghandruk",
  "Nagarkot",
  "Rara",
  "Mustang",
  "Manang",
  "Dolpa",
  "Tansen",
  "Kalinchowk",
  "Pathivara",
];

// Function to fetch data for each headDestination
async function fetchHeadDestinations() {
  let destinationsData = [];

  for (const city of headDestinations) {
    try {
      console.log(`Fetching data for: ${city}...`);

      const response = await axios.get(`${BASE_URL}geoname`, {
        params: {
          name: city,
          country: "NP",
          apikey: API_KEY,
        },
      });

      const data = response.data;

      console.log(response, data);

      if (data && data.name) {
        destinationsData.push({
          name: data.name,
          lat: data.lat,
          lon: data.lon,
          population: data.population || null,
          country: data.countryName,
        });

        console.log(`✅ Fetched: ${data.name}`);
      } else {
        console.log(`❌ No data found for ${city}`);
      }

      // Prevent hitting API limits (wait for 1 second between requests)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error fetching ${city}:`, error.message);
    }
  }

  // Save to JSON file
  fs.writeFileSync(
    "headDestinations.json",
    JSON.stringify(destinationsData, null, 2)
  );
  console.log("✅ Data saved to headDestinations.json");
}

// // Run the function
// fetchHeadDestinations();

const headDestinationsData = JSON.parse(
  fs.readFileSync("headDestinations.json", "utf-8")
);

// console.log(headDestinationsData);

// mongoose
//   .connect(
//     "mongodb+srv://dibyaaadhikari:trippytriprecommendation@trippy.beh0s.mongodb.net/",
//     {}
//   )
//   .then(
//     () => console.log("Succesfully connected to the DB"),
//     (err) => console.log("Couldnt connect", err.message)
//   );

async function fetchPlacesByRadius() {
  let allPlaces = [];

  const headDestinationData = await HeadDest.find();

  for (const destination of headDestinationData) {
    console.log(
      `📍 Fetching places in: ${destination.name} (Lat: ${destination.lat}, Lon: ${destination.lon})`
    );

    try {
      // API call to fetch places around the destination
      const response = await axios.get(BASE_URL + "radius", {
        params: {
          lat: destination.lat,
          lon: destination.lon,
          radius: destination?.population > 500000 ? 30000 : 22000, // Adjust radius based on population
          format: "json",
          apikey: API_KEY,
        },
      });

      if (!response.data || response.data.length === 0) {
        console.log(`❌ No places found for ${destination.name}`);
        continue;
      }

      // Log the full response to inspect data
      console.log("Full API response:", response.data);

      // ✅ Filter out places with no name or low importance (rate >= 2)
      let places = response.data.filter(
        (place) => place.name && place.rate >= 2
      );

      // Handle places with rate: 0 by giving them a default low rating if necessary
      places = places.map((place) => {
        return {
          name: place.name,
          id: place.xid,
          lat: place.point.lon, // Ensure this is the correct format
          lon: place.point.lat, // Ensure this is the correct format
          kind: place.kinds,
          // importance: rate, // Use this for future filtering or sorting
          city: destination.name,
          headDestination: destination._id,
        };
      });

      // Filter out places with low importance (rate >= 2)
      // places = places.filter((place) => place.importance >= 2);

      if (places.length === 0) {
        console.log(`❌ No high-quality places found for ${destination.name}`);
        continue;
      }

      allPlaces.push(...places);
      console.log(
        `✅ Found ${places.length} high-quality places in ${destination.name}`
      );

      // Prevent hitting API limits by pausing between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(
        `❌ Error fetching places for ${destination.name}: ${error.message}`
      );
    }
  }

  // Save all the collected places into a JSON file
  try {
    fs.writeFileSync(
      "./places.json",
      JSON.stringify(allPlaces, null, 2),
      "utf-8"
    );
    console.log("✅ Data saved to places.json");
  } catch (writeError) {
    console.error("❌ Error saving data to file:", writeError.message);
  }
}

// Run the function to fetch places
// fetchPlacesByRadius();

const placesData = JSON.parse(fs.readFileSync("./places.json", "utf-8"));

async function fetchDetailedPlaces() {
  let allPlaces = [];
  for (const place of placesData) {
    console.log(`📍 Fetching place detail: ${place.name} )`);

    try {
      // API call to fetch places around the destination

      //  const url = ;

      const response = await axios.get(
        `https://api.opentripmap.com/0.1/en/places/xid/${place.id}?apikey=${API_KEY}`,
        {
          params: {
            format: "json",
          },
        }
      );

      if (!response.data || response.data.length === 0) {
        console.log(`❌ No data found for ${place.name}`);
        continue;
      }

      // Log the full response to inspect data
      // console.log("Full API response:", response.data);

      const data = response.data;

      const detailedPlace = {
        xid: data.xid,
        name: data.name,
        description: data.wikipedia_extracts.text,
        categories: data.kinds.split(","),
        latitude: data.point.lat,
        longitude: data.point.lon,
        city: place.city,
        bbox: data.bbox,
        image: data.image,
        rate: data.rate,
        headDestination: place.headDestination,
      };

      console.log(detailedPlace);

      allPlaces.push(detailedPlace);
      // Prevent hitting API limits by pausing between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error fetching places detail ,${error}`);
    }
  }

  // Save all the collected places into a JSON file
  try {
    fs.writeFileSync(
      "./detailedPlaces.json",
      JSON.stringify(allPlaces, null, 2),
      "utf-8"
    );
    console.log("✅ Data saved to detailedPlaces.json");
  } catch (writeError) {
    console.error("❌ Error saving data to file:", writeError);
  }
}

fetchDetailedPlaces();

// Full API response: {
//   xid: 'W193705372',
//   name: 'Bhadrakali Temple',
//   address: {
//     city: 'काठमाडौं',
//     state: 'वाग्मती प्रदेश',
//     county: 'काठमाडौं',
//     suburb: 'Tripureshwar',
//     country: 'Nepal',
//     postcode: 'PO BOX. 220',
//     country_code: 'np',
//     neighbourhood: 'Bhotahity'
//   },
//   rate: '3',
//   osm: 'way/193705372',
//   bbox: {
//     lon_min: 85.316446,
//     lon_max: 85.317031,
//     lat_min: 27.698987,
//     lat_max: 27.69962
//   },
//   wikidata: 'Q85746836',
//   kinds: 'religion,hindu_temples,interesting_places',
//   sources: { geometry: 'osm', attributes: [ 'osm', 'wikidata' ] },
//   otm: 'https://opentripmap.com/en/card/W193705372',
//   wikipedia: 'https://en.wikipedia.org/wiki/Bhadrakali%20Temple%20%28Kathmandu%29',
//   image: 'https://commons.wikimedia.org/wiki/File:Bhadrakali_Temple.JPG',
//   preview: {
//     source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Bhadrakali_Temple.JPG/400px-Bhadrakali_Temple.JPG',
//     height: 300,
//     width: 400
//   },
//   wikipedia_extracts: {
//     title: 'en:Bhadrakali Temple (Kathmandu)',
//     text: 'Bhadrakali Temple (Nepali:भद्रकाली मन्दिर) (literal: "Decent Kali") is a Hindu temple dedicated to Devi Bhadrakali. It is located in Kathmandu, Nepa al, next to Tundikhel.It is located near the Sahid Gate. The temple is at the eastern side of Tundikhel. This temple is also known as Shree Lumadhi Bhadrakali. It is one of the most renowned “Shaktipith” of Nepal. A form of the Goddess Kali, Bhadrakali in Sanskrit means “blessed, auspicious, beautiful and prosperous” and she is also known as “Gentle Kali”. Another name for the goddess is Lazzapith.',
//     html: '<p><b>Bhadrakali Temple</b> (Nepali:भद्रकाली मन्दिर) (literal: "Decent Kali") is a Hindu temple dedicated to Devi Bhadrakali. It is located in Kathm mandu, Nepal, next to Tundikhel.</p><p>It is located near the Sahid Gate. The temple is at the eastern side of Tundikhel. This temple is also known as <i>Shree Lumadhi Bhadrakali</i>. It is one of the most renowned “Shaktipith” of Nepal. A form of the Goddess <i>Kali</i>, <i>Bhadrakali</i> in Sanskrit means “blessed, auspicious, beautiful and prosperous” and she is also known as “Gentle Kali”. Another name for the goddess is <i>Lazzapith.</i></p>'
//   },
//   point: { lon: 85.3167495727539, lat: 27.699254989624023 }
// }

//fetch detailed places and save to places.json

// --------------------------------------------------------------------------
//  const fs = require("fs");

// let headDestinations = [];

// const fetchHeadDestinations = async function () {
//   const url = `http://api.geonames.org/searchJSON?country=NP&featureClass=P&maxRows=100&username=dibyaadhikaree
// `;

//   const res = await fetch(url, {
//     method: "GET",
//   });

//   const { geonames: data } = await res.json();

//   headDestinations = data.map((dest) => {
//     const desty = {
//       name: dest.name,
//       longitude: dest.lng,
//       latitude: dest.lat,
//       fclName: dest.fclName,
//     };

//     return desty;
//   });

//   fs.writeFileSync(
//     "./headDestinations.json",
//     JSON.stringify(headDestinations, null, 2),
//     "utf-8"
//   );

//   console.log(headDestinations);
// };

// // fetchHeadDestinations();

// //after fetching head destinations , fetch places inside it

// const fetchData = async function (name) {
//   const url = `https://api.opentripmap.com/0.1/en/places/geoname?name=${name}&apikey=5ae2e3f221c38a28845f05b6caad0c78eb2b0cfbbfc115fb6983b15a`;

//   const res = await fetch(url, {
//     method: "GET",
//   });

//   const data = await res.json();

//   console.log(data);
// };

// // headDestinations.forEach((city) => fetchData(city.name));

// const fetchPlaces = async function (lon, lat, headCity) {
//   const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=15000&lon=${lon}&lat=${lat}&apikey=5ae2e3f221c38a28845f05b6caad0c78eb2b0cfbbfc115fb6983b15a`;

//   const res = await fetch(url, {
//     method: "GET",
//   });

//   const { type, features } = await res.json();

//   // !!!!RETURNED DATA : {
//   //   "type": "Feature",
//   //   "id": "9964880",
//   //   "geometry": {
//   //     "type": "Point",
//   //     "coordinates": [
//   //       87.2682571,
//   //       26.4562836
//   //     ]
//   //   },
//   //   "properties": {
//   //     "xid": "N6313577291",
//   //     "name": "Shiv Mandir",
//   //     "dist": 226.29344723,
//   //     "rate": 1,
//   //     "osm": "node/6313577291",
//   //     "kinds": "religion,other_temples,interesting_places"
//   //   }
//   // },

//   // console.log(features, name);

//   console.log(features, headCity);

//   const places = features.filter((place) => place.properties.rate >= 3);

//   const placesData = places.map((place) => {
//     const placesObj = {
//       place_id: place.properties.xid,
//       name: place.properties.name,

//       categories: place.properties.kinds.split(","),

//       location: {
//         lat: place.geometry.coordinates[1],
//         lng: place.geometry.coordinates[0],
//       },
//       headCity,
//       rate: place.properties.rate,
//     };

//     return placesObj;
//   });

//   fs.writeFileSync(
//     "./places.json",
//     JSON.stringify(placesData, null, 2),
//     "utf-8"
//   );
// };

// // //required format of data
// // place_id: place.properties.xid,
// // name: place.properties.xid,
// // description:
// //   "Pashupatinath Temple is a famous Hindu temple dedicated to Lord Shiva, located in Kathmandu.",
// // categories: ["Temple", "Religious", "Heritage", "Cultural", "Historical"],
// // type: "Religious",
// // latitude: 27.7104,
// // longitude: 85.3482,
// // city: "Kathmandu",
// // };

// // const headDestinations = JSON.parse(
// //   fs.readFileSync("./headDestinations.json", "utf-8")
// // );
// // // console.log(headDestinations);

// // fetchPlaces(
// //   headDestinations[0].longitude,
// //   headDestinations[0].latitude,
// //   headDestinations[0].name
// // );

// // headDestinations.forEach(({ latitude: lat, longitude: lng, name }) =>
// //   fetchPlaces(lng, lat, name)
// // );

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// const fetchDetailedPlaces = async function (xid) {
//   const url = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=5ae2e3f221c38a28845f05b6caad0c78eb2b0cfbbfc115fb6983b15a`;

//   try {
//     const response = await fetch(url);
//     const details = await response.json();

//     await sleep(40000);

//     console.log(details);

//     // return {
//     //   name: details.name || "Unknown Place",
//     //   description: details.wikipedia_extracts
//     //     ? details.wikipedia_extracts.text
//     //     : "No description available",
//     //   image: details.preview ? details.preview.source : "No image available",
//     //   address: details.address
//     //     ? details.address.formatted
//     //     : "No address available",
//     //   category: details.kinds,
//     //   lat: details.point.lat,
//     //   lng: details.point.lon,
//     //   rate: details.rate,
//     // };
//   } catch (error) {
//     console.error(`Error fetching details for XID ${xid}:`, error);
//     return null;
//   }
// };

// const places = JSON.parse(fs.readFileSync("./places.json", "utf-8"));

// // const detailedPlaces = fetchDetailedPlaces(places[1].place_id);

// const detailedPlaces = places.map((place) =>
//   fetchDetailedPlaces(place.place_id)
// );
