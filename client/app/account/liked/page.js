export const metadata = {
  title: "Profile",
};

export default async function Page() {
  // const session = await auth();

  // const guest = await getUserFromEmail(session.user.email);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Your Liked Places
      </h2>

      <p className="text-lg mb-8 text-primary-200">See you soon!</p>

      {/* <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={guest.nationality}
        />
      </UpdateProfileForm> */}
    </div>
  );
}
