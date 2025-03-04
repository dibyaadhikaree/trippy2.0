import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/app/_services/auth"; // Adjust path if necessary

export default async function Navigation() {
  const session = await getServerSession(authConfig);

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        {/* <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li> */}

        <Link href="/forYou">For You</Link>
        <Link href="/popularPlaces">Popular Places</Link>
        <Link href="/about">About</Link>

        {session?.user?.image ? (
          <Link
            href="/account"
            className="hover:text-accent-400 transition-colors  flex items-center gap-4 border-4 border-accent-600 rounded-full"
          >
            <Image
              width={40}
              height={40}
              src={session.user.image}
              className="h-8 rounded-full"
              alt={session.user.name}
              referrerPolicy="no-referrer"
            />
          </Link>
        ) : (
          <Link
            href="/login"
            className="hover:text-accent-400 transition-colors"
          >
            Login
          </Link>
        )}
      </ul>
    </nav>
  );
}
