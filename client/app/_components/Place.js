"use client";

import Image from "next/image";
import TextExpander from "@/app/_components/TextExpander";
import {
  CodeBracketIcon,
  EyeSlashIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import bgImage from "../../public/bg.png";
import React, { useState } from "react";
import { HeartIcon } from "@heroicons/react/solid"; // Ensure you have @heroicons/react
import { HeartIcon as HeartOutline } from "@heroicons/react/outline"; // For the outlined heart

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function Place({ place, liked: isLiked }) {
  const {
    _id: id,
    name,
    description,
    city,
    image,
    latitude,
    longitude,
  } = place;

  // State to manage whether the place is liked
  const [liked, setLiked] = useState(isLiked);

  // Toggle the liked state
  const toggleLike = () => {
    setLiked(!liked);
    // Here, you might also want to call an API to update the backend
    updateLikeStatus(id, !liked);
  };

  return (
    <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24 ">
      <div className="relative scale-[1.15] -translate-x-3  ">
        {/* <Image
          src={image == "not found" ? bgImage : image}
          alt={`Place ${name}`}
          fill
          className="object-cover"
        /> */}
        <Image
          src={bgImage}
          alt={`Place ${name}`}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <h3 className="text-accent-100 font-black text-7xl mb-5 translate-x-[-254px] bg-primary-950 p-6 pb-1 w-[150%]">
          {capitalizeFirstLetter(name)}
        </h3>

        <p className="text-lg text-primary-300 mb-10">
          <TextExpander>{description}</TextExpander>
        </p>

        <ul className="flex flex-col gap-4 mb-7">
          <li className="flex gap-3 items-center ">
            <MapPinIcon className="h-5 w-5 text-primary-600" />
            <span className="text-lg">{capitalizeFirstLetter(city)}</span>
          </li>
          {/* <li className="flex gap-3 items-center">
            <CodeBracketIcon className="h-5 w-5 text-primary-600" />
            <span className="text-lg">{"12km"}</span>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default Place;
