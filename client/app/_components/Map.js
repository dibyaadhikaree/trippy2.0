"use client";
// components/Map.js
import dynamic from "next/dynamic";
import { useMemo } from "react";
export default function Map({ latitude, longitude }) {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/_components/MapComponent"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="border-[2px] border-primary-300">
      <Map latitude={latitude} longitude={longitude} />
    </div>
  );
}
