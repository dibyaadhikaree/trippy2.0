import Spinner from "@/app/_components/Spinner";
import { Suspense } from "react";
import ForYouList from "../_components/ForYouList";
import Filter from "@/app/_components/PreferenceFilter";
import { getServerSession } from "next-auth";
import { authConfig } from "../_services/auth";
import NewUserRedirect from "../_components/NewUserRedirect";

export const metadata = {
  title: "Trips For You",
};

// export const revalidate = 3600;

export default async function Page({ searchParams }) {
  const session = await getServerSession(authConfig);

  // if (session.user.preferences.length == 0)
  //   return <NewUserRedirect isNewUser={session.user.preferences.length == 0} />;

  // const { preferences } = await searchParams;

  // const user_pref = preferences?.split(",") ?? session.user.preferences;

  // const filter = await searchParams?.preferences;

  // console.log(user_pref, "this is the filter");

  // if (!user_pref)
  //   return (
  //     <Link href="/account/preferences"> Please give us your preferences</Link>
  //   );

  return (
    <div>
      <h1 className="text-4xl mb-8 text-accent-400 font-medium">
        Trips For You
      </h1>
      <Suspense fallback={<Spinner />}>
        <ForYouList user={session.user.userId} />
      </Suspense>
    </div>
  );
}
