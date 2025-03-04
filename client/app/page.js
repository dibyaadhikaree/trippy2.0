import Image from "next/image";

import bgImage from "@/public/bg.png";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "./_services/auth";
import NewUserRedirect from "./_components/NewUserRedirect";

export default async function Page() {
  const session = await getServerSession(authConfig);

  if (session && session.user.preferences.length == 0)
    return <NewUserRedirect isNewUser={session.user.preferences.length == 0} />;

  return (
    <main className="mt-[65px]">
      <Image
        src={bgImage}
        fill
        className="object-cover object-top"
        alt="Mountains and forests with two cabins"
        placeholder="blur"
      />

      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-primary-50 mb-[100px] tracking-tight font-normal">
          Welcome to Trippy
        </h1>
        <Link
          href="/search"
          className="bg-accent-400 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Find your next destination
        </Link>
      </div>
    </main>
  );
}
