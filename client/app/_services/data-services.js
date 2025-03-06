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

  const placeswImage = await Promise.all(
    data.data.map(async (place) => {
      return {
        ...place,
        image: await getImageUrl(place.image),
      };
    })
  );

  return placeswImage;
}

export async function getPopularPlaces() {
  const res = await fetch(baseUrl + "places/popularPlaces", {
    method: "GET",
  });

  const data = await res.json();

  const places = data.data;

  const placeswImage = await Promise.all(
    places.map(async (place) => {
      return {
        ...place,
        image: await getImageUrl(place.image),
      };
    })
  );

  console.log(placeswImage, "places w image");

  return placeswImage;
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

export async function getReviewsForPlace(id) {
  const res = await fetch(baseUrl + `places/${id}/reviews`, {
    method: "GET",
  });

  const data = await res.json();

  return data;
}
export async function createReview(id, formData) {
  const res = await fetch(baseUrl + `places/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();

  return data;
}

export async function getHeadDestinations() {
  const res = await fetch(baseUrl + `destinations`, {
    method: "GET",
  });

  const data = await res.json();

  return data.data;
}
