import PlaceCard from "@/app/_components/PlacesCard";
import { getPopularPlaces } from "@/app/_services/data-services";

async function PlacesList() {
  const { data: popularPlaces } = await getPopularPlaces();

  return (
    <div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
        {popularPlaces.map((place) => (
          <PlaceCard key={place._id} place={place} />
        ))}
      </div>
    </div>
  );
}

export default PlacesList;
