"use client";

import Image from "next/image";
import TextExpander from "@/app/_components/TextExpander";
import {
  CodeBracketIcon,
  EyeSlashIcon,
  HeartIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import bgImage from "../../public/bg.png";
import React, { useState } from "react";
import { updateUserPreference } from "../_services/data-services";
import BackButton from "@/app/_components/BackButton";
import ImageSlider from "./ImageSlider";

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function Place({ place, user }) {
  const {
    _id: id,
    name,
    description,
    city,
    image,
    latitude,
    longitude,
  } = place;

  console.log(place._id, ":place id ", "user liked", user.likedPlaces);

  // State to manage whether the place is liked
  const [liked, setLiked] = useState(user?.likedPlaces.includes(id));

  // Toggle the liked state
  const toggleLike = () => {
    setLiked(!liked);
    // Here, you might also want to call an API to update the backend

    let likedPlaces = user.likedPlaces; //[dabagbfa , dafadsf ]  , supppose we have dabagbfa
    console.log(likedPlaces, "before ");
    console.log(likedPlaces.includes(place._id));
    if (likedPlaces.includes(place._id)) {
      likedPlaces = likedPlaces.filter((place) => place != id);
      console.log("after removing 1 like", likedPlaces);
    } else likedPlaces.push(place._id);

    console.log(likedPlaces, "after like ");

    updateUserPreference(user.userId, { likedPlaces: likedPlaces }, id);
  };

  return (
    <>
      <BackButton />
      <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24 relative ">
        <div className="relative scale-[1.15] -translate-x-3  ">
          {/* <Image
          src={image == "not found" ? bgImage : image}
          alt={`Place ${name}`}
          fill
          className="object-cover"
        /> */}
          {/* <Image
            src={bgImage}
            alt={`Place ${name}`}
            fill
            className="object-cover"
          /> */}
          <ImageSlider images={place.img} />
        </div>

        <div>
          <h3 className="flex justify-between text-accent-100 font-black text-7xl mb-5 translate-x-[-254px] bg-primary-950 p-6 pb-1 w-[150%]">
            {capitalizeFirstLetter(name)}

            <button
              onClick={toggleLike}
              className="text-red-500 top-[0px] absolute right-[-10px] mx-4"
            >
              {liked ? (
                <HeartIcon className="h-12 w-12  text-red-700" />
              ) : (
                <HeartIcon className="h-12 w-12 text-primary-700 outline-1 hover:text-red-700" />
              )}
            </button>
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
    </>
  );
}

export default Place;
