//for making it static , but we used auth here so the route becomes dynamic
// export async function generateStaticParams() {
//   const { data: cabins } = await getPlaces();

import Place from "@/app/_components/Place";
import { getPlaceById } from "@/app/_services/data-services";

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
  //   const { data: cabin } = await getCabin(params.id);

  const { data: place } = await getPlaceById(placeId.id);

  console.log(place);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Place place={place} />
    </div>
  );
}
