import { getServerSession } from "next-auth/next";
import { authConfig } from "@/app/_services/auth";
export const metadata = {
  title: "Accounts",
};

export default async function Page() {
  const session = await getServerSession(authConfig);

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {session.user.name}
    </h2>
  );
}
