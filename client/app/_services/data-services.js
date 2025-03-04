// import { notFound } from "next/navigation";
"use server";
import { cookies } from "next/headers";

const baseUrl = "http://localhost:2000/api/";

export async function getAllPlaces() {
  const res = await fetch(baseUrl + "places/", {
    method: "GET",
  });

  const data = await res.json();

  //   if (data.status == "error") notFound();

  //fetch image and send new data

  const place = data.data;

  const imageUrl = await getImageUrl(place.image);

  place.image = imageUrl;

  return place;
}

async function getImageUrl(filePageUrl) {
  try {
    // Extract the filename from the provided URL
    const filename = filePageUrl.split("/").pop();
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&format=json&origin=*`;

    // Fetch data from the MediaWiki API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the image URL from the response
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    const imageUrl = page.imageinfo[0].url;

    return imageUrl;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
}

export async function getForYou(preference) {
  const res = await fetch(baseUrl + `places/forYou`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      preference,
    }),
  });

  const data = await res.json();

  return data.data;
}

export async function getPopularPlaces() {
  const res = await fetch(baseUrl + "places/popularPlaces", {
    method: "GET",
  });

  const data = await res.json();

  console.log(data);

  return data;
}

export async function getUserFromEmail(email) {
  const data = await fetch(baseUrl + `users/getUserFromEmail/${email}`, {
    method: "GET",
  });

  const user = await data.json();

  return user.data;
}

export async function createUser(user) {
  const response = await fetch(baseUrl + "users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const currentUser = await response.json();

  // cookies().set({
  //   name: "new_user",
  //   value: userData.isNewUser ? "true" : "false",
  //   httpOnly: true,
  //   path: "/",
  // });

  console.log(currentUser, "newly created user");

  return currentUser.data;
}

export async function updateUserPreference(user, preferences) {
  try {
    const response = await fetch(baseUrl + "users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.userId,
        preferences,
      }),
    });

    const updated = await response.json();

    return updated;
  } catch (err) {
    console.log(err);
  }
}

export async function getPlaceById(id) {
  const res = await fetch(baseUrl + `places/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  return data;
}
