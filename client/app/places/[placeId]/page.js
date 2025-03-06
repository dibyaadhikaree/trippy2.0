//for making it static , but we used auth here so the route becomes dynamic
// export async function generateStaticParams() {
//   const { data: cabins } = await getPlaces();

import { AddReviewForm } from "@/app/_components/AddReveiwForm";
import Map from "@/app/_components/Map";
import Place from "@/app/_components/Place";
import Review from "@/app/_components/Review";
import {
  getPlaceById,
  getReviewsForPlace,
} from "@/app/_services/data-services";
import { MapIcon } from "@heroicons/react/24/solid";

//   return cabins.map((cabin) => ({
//     id: cabin._id,
//   }));
// }

// export async function generateMetadata({ params }) {
//   const {
//     data: { name },
//   } = await getCabin(params.id);

//   return { title: name };
// }

export default async function Page({ params }) {
  const placeId = await params;

  try {
    const { data: place } = await getPlaceById(placeId.placeId);

    const { data: reviews } = await getReviewsForPlace(placeId.placeId);

    return (
      <div className="max-w-6xl mx-auto mt-8">
        <Place place={place} />
        <div className="grid grid-cols-2 border border-primary-800 min-h-[400px] mb-10 text-accent-400">
          <div className="border-primary-100 border-2">
            <Review reviews={reviews} />
            <AddReviewForm placeId={place._id} />
          </div>
          <Map latitude={place.latitude} longitude={place.longitude} />
        </div>
      </div>
    );
  } catch (err) {
    console.log(err);
  }
}
