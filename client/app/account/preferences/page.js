import UpdatePreferences from "@/app/_components/UpdatePreferences";
import { authConfig } from "@/app/_services/auth";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Your Preferences",
};

export default async function Page() {
  const session = await getServerSession(authConfig);

  // if (session.user.preferences.length != 0) redirect("/");

  // const guest = await getUserFromEmail(session.user.email);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Preferences
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Choose it so we can give you the best recommendations!
      </p>

      <UpdatePreferences user={session.user} />
    </div>
  );
}
