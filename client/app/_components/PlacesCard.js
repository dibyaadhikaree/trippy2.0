// import { UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import bgImage from "../../public/bg.png";
import img from "@/public/trippy.png";
import {
  CodeBracketIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import ImageSlider from "./ImageSlider";

// import BackButton from "@/app/_components/BackButton";

// {
//   "xid": "W193705372",
//   "name": "Bhadrakali Temple",
//   "description": "Bhadrakali Temple (Nepali:भद्रकाली मन्दिर) (literal: \"Decent Kali\") is a Hindu temple dedicated to Devi Bhadrakali. It is located in Kathmandu, Nepal, next to Tundikhel.It is located near the Sahid Gate. The temple is at the eastern side of Tundikhel. This temple is also known as Shree Lumadhi Bhadrakali. It is one of the most renowned “Shaktipith” of Nepal. A form of the Goddess Kali, Bhadrakali in Sanskrit means “blessed, auspicious, beautiful and prosperous” and she is also known as “Gentle Kali”. Another name for the goddess is Lazzapith.",
//   "categories": [
//     "religion",
//     "hindu_temples",
//     "interesting_places"
//   ],
//   "latitude": 27.699254989624023,
//   "longitude": 85.3167495727539,
//   "city": "kathmandu",
//   "bbox": {
//     "lon_min": 85.316446,
//     "lon_max": 85.317031,
//     "lat_min": 27.698987,
//     "lat_max": 27.69962
//   },
//   "image": "https://commons.wikimedia.org/wiki/File:Bhadrakali_Temple.JPG",
//   "rate": "3",
//   "headDestination": "67a39a372563dadf878677bd"
// },

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function PlaceCard({ place }) {
  const { _id: id, name, description, city } = place;
  const image = "not found";

  return (
    <div className="flex border-primary-800 border">
      {/* <BackButton></BackButton> */}

      <div className="flex-1 relative w-full ">
        {/* <Image
          src={image == "not found" ? bgImage : image}
          // src={bgImage}
          fill
          className="object-cover object-top"
          alt="Mountains and forests with two cabins"
        /> */}
        <ImageSlider images={place.img} />
      </div>
      <div className="flex-grow">
        <div className="pt-5 pb-4 px-7 bg-primary-950">
          <h3 className="text-accent-500 font-semibold text-2xl mb-3">
            {name}
          </h3>

          <div className="flex gap-3 items-center mb-2">
            <MapPinIcon className="h-5 w-5 text-primary-600" />
            {capitalizeFirstLetter(city)}
          </div>
          {/* 1111111 PUT THE DISTNACE HERE */}
          {/* <div className="flex gap-3 items-center mb-2">
            {" "}
            <CodeBracketIcon className="h-5 w-5 text-primary-600" />
            16.5km
          </div> */}
        </div>

        <div className="bg-primary-950 border-t border-t-primary-800 text-right">
          <Link
            href={`/places/${id}`}
            className="border-l border-primary-800 py-4 px-6 inline-block hover:bg-accent-600 transition-all hover:text-primary-900"
          >
            View More ...
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;
