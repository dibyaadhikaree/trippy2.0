import PlaceCard from "@/app/_components/PlacesCard";

import { getForYou } from "@/app/_services/data-services";

// {
//     "_id": "66477f0f35a5cb5386abef3c",
//     "name": "004",
//     "createdAt": "2024-05-17T16:00:14.917Z",
//     "maxCapacity": 4,
//     "regularPrice": 500,
//     "discount": 50,
//     "image": "cabin-004.jpg",
//     "description": "Indulge in the ultimate luxury family vacation in this medium-sized cabin 004. Designed for families of up to 4, this cabin offers a sumptuous retreat for the discerning traveler. Inside, the cabin boasts of opulent interiors crafted from the finest quality wood, a comfortable living area, a fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-inspired en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.",
//     "__v": 0
// },

async function ForYouList({ user }) {
  const forYou = await getForYou(user);

  return (
    <div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
        {forYou.map((place) => (
          <PlaceCard key={place._id} place={place} />
        ))}
      </div>
    </div>
  );
}

export default ForYouList;
