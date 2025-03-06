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
    <div className="flex align-baseline mx-4">
      <Map latitude={latitude} longitude={longitude} />
    </div>
  );
}
