import PlaceCard from "@/app/_components/PlacesCard";

function PlacesList({ places }) {
  console.log(places);

  return (
    <div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
        {places.map((place) => (
          <PlaceCard key={place._id} place={place} />
        ))}
      </div>
    </div>
  );
}

export default PlacesList;
