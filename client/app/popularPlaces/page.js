import Spinner from "@/app/_components/Spinner";
import { Suspense } from "react";
import PlacesList from "../_components/PlacesList";

export const metadata = {
  title: "Pouplar Places",
};

// export const revalidate = 3600;

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Popular Places
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Trippy recommends the best places for you.
      </p>

      <Suspense fallback={<Spinner />}>
        <PlacesList />
      </Suspense>
    </div>
  );
}
