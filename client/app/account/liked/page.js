import PlacesList from "@/app/_components/PlacesList";
import { authConfig } from "@/app/_services/auth";
import { getLikedPlaces } from "@/app/_services/data-services";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Profile",
};

export default async function Page() {
  const session = await getServerSession(authConfig);

  const likedPlaces = await getLikedPlaces(session.user.userId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Your Liked Places
      </h2>

      <PlacesList places={likedPlaces} />
    </div>
  );
}
