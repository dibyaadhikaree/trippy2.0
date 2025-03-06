//for making it static , but we used auth here so the route becomes dynamic
// export async function generateStaticParams() {
//   const { data: cabins } = await getPlaces();

import { AddReviewForm } from "@/app/_components/AddReviewForm";
import Map from "@/app/_components/Map";
import Place from "@/app/_components/Place";
import Review from "@/app/_components/Review";
import { authConfig } from "@/app/_services/auth";
import {
  getPlaceById,
  getReviewsForPlace,
} from "@/app/_services/data-services";
import { MapIcon } from "@heroicons/react/24/solid";
import { getServerSession } from "next-auth";

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

  const session = await getServerSession(authConfig);

  const liked = session?.user?.likedPlaces.includes(placeId);

  try {
    const { data: place } = await getPlaceById(placeId.placeId);

    const { data: reviews } = await getReviewsForPlace(placeId.placeId);

    return (
      <div className="max-w-6xl mx-auto mt-8">
        <Place place={place} liked={liked} />
        <div className="grid grid-cols-2  min-h-[400px] mb-10 text-accent-400 items-center">
          <div className="border-2 border-primary-700 ">
            <Review reviews={reviews} />
          </div>
          <Map latitude={place.latitude} longitude={place.longitude} />
        </div>
        <AddReviewForm placeId={place._id} />
      </div>
    );
  } catch (err) {
    console.log(err);
  }
}
