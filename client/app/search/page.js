import Image from "next/image";
import Categories from "@/app/_components/Categories";

export const metadata = {
  title: "Find Trips",
};

export const revaldate = 10;

export default async function Page() {
  return (
    <form
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      // action={updateGuest}
    >
      <div className="space-y-2">
        <label>Location</label>
        <input
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400 inline-flex"
          name="name"
          // defaultValue={name}
        />
      </div>
      <div className="space-y-2">
        <label>Time for travel</label>
        <input
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400 inline-flex"
          name="name"
          // defaultValue={name}
        />
      </div>
      <div className="space-y-2">
        <label>Categories</label>
        <Categories />
      </div>

      <div className="flex justify-end items-center gap-6">
        <Button />
      </div>
    </form>
  );
}

function Button() {
  // const { pending } = useFormStatus();

  return (
    <button
      // disabled={pending}
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all 
     
    disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {" "}
      Find Trips
      {/* {pending ? "Update Profile" : "Update profile"} */}
    </button>
  );
}
