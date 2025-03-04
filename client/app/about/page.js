import Image from "next/image";

import img1 from "@/public/about-1.jpg";
// import img2 from "@/public/about-2.jpg";

import Link from "next/link";

export const metadata = {
  title: "About",
};

export const revalidate = 86000;

export default async function About() {
  return (
    <div className="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Welcome To Trippy
        </h1>

        <div className="space-y-8">
          <p>
            Welcome to Trippy, where your travel dreams become reality. Trippy
            is a social tool designed to simplify and enhance your travel
            planning experience.
          </p>
          <p>
            Planning your next adventure with Trippy is seamless and intuitive.
            Our auto-complete tool quickly pulls up locations from our extensive
            database, enabling you to add places you're considering to your
            itinerary. Your friends can then offer feedback through comments,
            helping you craft the perfect trip.
          </p>
          <p></p>
        </div>
      </div>

      <div className="col-span-2">
        <Image
          src={img1}
          alt="Family sitting around a fire pit in front of cabin"
          placeholder="blur"
        />
      </div>

      <div className="col-span-2 relative aspect-square">
        <Image
          src="/about-2.jpg"
          fill
          className="object-cover"
          alt="Family that manages The Wild Oasis"
        />
      </div>

      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium ">
          Meet Our Team <br></br>Dibya , Pranjal , Prabesh , Mohit
        </h1>

        <div className="space-y-8">
          <p>
            Since our inception, we &apos; ve been committed to leveraging the
            power of social connections to transform the way people plan their
            travels. Join us at Trippy, and let`&apos;`s make your next journey
            unforgettable.
          </p>

          <div>
            <Link
              href="/forYou"
              className="inline-block mt-4 bg-accent-500 px-8 py-5 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
