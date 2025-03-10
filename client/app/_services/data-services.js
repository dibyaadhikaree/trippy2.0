// import { notFound } from "next/navigation";
"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { authConfig } from "./auth";
import { redirect } from "next/dist/server/api-utils";

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
    let imageUrl;
    const fileTitle = filePageUrl.split("/wiki/")[1];
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      fileTitle
    )}&prop=imageinfo&iiprop=url&format=json`;

    const res = await fetch(apiUrl);
    const data = await res.json();
    const pages = data.query.pages;
    for (const pageId in pages) {
      const imageInfo = pages[pageId].imageinfo[0];
      imageUrl = imageInfo.url;
      console.log("Image URL:", imageUrl);
    }
    return imageUrl;
  } catch (err) {
    return "not found";
  }
}

export async function getForYou(user) {
  const res = await fetch(baseUrl + `places/forYou`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: user,
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

  const places = data.data;

  return places;
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

export async function updateUserPreference(user, data, path) {
  try {
    console.log("UPDATING USER PREF FOR", user, data);

    const response = await fetch(baseUrl + "users/" + user, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const updated = await response.json();

    if (path) {
      revalidatePath("/places/" + path);
    }

    //referesh the data
    const resp = await fetch(+"http://localhost:2000/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviews: true,
        users: true,
        places: true,
      }),
    });

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
export async function getLikedPlaces(user) {
  const res = await fetch(baseUrl + `places/likedPlaces/${user}`, {
    method: "GET",
  });

  const data = await res.json();

  return data.data;
}

export async function getReviewsForPlace(id) {
  const res = await fetch(baseUrl + `places/${id}/reviews`, {
    method: "GET",
  });

  const data = await res.json();

  return data;
}
export async function createReview(id, formData) {
  const session = await getServerSession(authConfig);

  const res = await fetch(baseUrl + `places/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, user: session.user.userId }),
  });
  const data = await res.json();

  revalidatePath("/places/" + id);
  revalidatePath("/account/likedPlaces");

  const resp = await fetch("http://localhost:5000/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reviews: true,
      places: true,
    }),
  });

  return data;
}
export async function deleteReview(id, path) {
  const res = await fetch(baseUrl + `reviews/${id}`, {
    method: "DELETE",
  });

  const resp = await fetch("http://localhost:5000/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reviews: true,
      places: true,
    }),
  });

  return null;
}

export async function getHeadDestinations() {
  const res = await fetch(baseUrl + `destinations`, {
    method: "GET",
  });

  const data = await res.json();

  return data.data;
}
export async function getCategoryList() {
  const res = await fetch(baseUrl + `categories`, {
    method: "GET",
  });

  const data = await res.json();

  return data.data;
}

export async function getMappedCategory() {
  const res = await fetch(baseUrl + `categories`, {
    method: "GET",
  });

  const data = await res.json();

  return data.data;
}
