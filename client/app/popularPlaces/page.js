import Spinner from "@/app/_components/Spinner";
import { Suspense } from "react";
import PlacesList from "../_components/PlacesList";
import { getPopularPlaces } from "../_services/data-services";

export const metadata = {
  title: "Pouplar Places",
};

// export const revalidate = 3600;

export default async function Page() {
  const popularPlaces = await getPopularPlaces();

  console.log(popularPlaces);

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Popular Places
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Trippy recommends the best places for you.
      </p>

      <Suspense fallback={<Spinner />}>
        <PlacesList places={popularPlaces} />
      </Suspense>
    </div>
  );
}
