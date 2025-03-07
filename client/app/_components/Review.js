import TextExpander from "@/app/_components/TextExpander";
import { getServerSession } from "next-auth";
import { authConfig } from "../_services/auth";
import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteReview } from "../_services/data-services";

export default async function Review({ reviews }) {
  const session = await getServerSession(authConfig);

  //   {
  //     "_id": "67c9e9fcc3aab0bdbe5eb11e",
  //     "place": "Pns2l4eNsfO8kk83dixA6A",
  //     "text": "new dkfjasldk f alkdsj fl;k ",
  //     "timestamp": "2025-03-06T18:31:24.343Z",
  //     "user": {
  //         "_id": "67c8a572939a0b397e16eced",
  //         "name": "Dibya Adhikari",
  //         "email": "dibyaaadhikari@gmail.com",
  //         "preferences": [
  //             "Adult",
  //             "Bagels",
  //             "Bars"
  //         ],
  //         "likedPlaces": [],
  //         "__v": 0,
  //         "id": "67c8a572939a0b397e16eced"
  //     },
  //     "__v": 0
  // }

  if (reviews.length == 0) return <h1>NO REVIEWS FOR THIS PLACE</h1>;

  let currentUserReview = reviews.filter((review) => {
    return review?.user?._id == session.user.userId;
  });

  let otherReviews = reviews.filter((review) => {
    return review?.user?._id !== session.user.userId;
  });
  // return <div>This is revview</div>;

  return (
    <div
      className="flex gap-3 flex-col p-4 max-h-[500px] overflow-y-scroll [&::-webkit-scrollbar]:w-2
"
    >
      {currentUserReview.length != 0 ? (
        <>
          <h1 className="text-lg ">Your Reviews</h1>{" "}
          {currentUserReview.map((review) => (
            <div
              className="flex flex-col gap-4  border-[1px] px-3 py-4 border-primary-700 bg-primary-800 items-start align-center"
              key={review._id}
            >
              <RateComponent rate={review.rate} />
              <TextExpander>{review.text}</TextExpander>
              <form
                className=""
                action={async () => {
                  "use server";
                  deleteReview(review._id);
                }}
              >
                <button className="hover:text-red-500  justify-end items-center mx-auto">
                  <TrashIcon height={30} width={30} />
                </button>
              </form>
            </div>
          ))}
        </>
      ) : (
        ""
      )}
      <h1>Data's Reviews</h1>
      {otherReviews.map((review) => (
        <div
          className="flex flex-col border-[1px] px-3 py-4 border-primary-700 "
          key={review._id}
        >
          {review?.rate ? <RateComponent rate={review.rate} /> : ""}
          <TextExpander>{review.text}</TextExpander>
        </div>
      ))}
    </div>
  );
}

function RateComponent({ rate }) {
  return (
    <div className="flex items-center mx-[-5px]">
      <svg
        className={`w-4 h-4 ${
          rate >= 1 ? "text-yellow-300" : "text-gray-500"
        } } ms-1`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
      <svg
        className={`w-4 h-4 ${
          rate >= 2 ? "text-yellow-300" : "text-gray-500"
        } } ms-1`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
      <svg
        className={`w-4 h-4 ${
          rate >= 3 ? "text-yellow-300" : "text-gray-500"
        } } ms-1`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
      <svg
        className={`w-4 h-4 ${
          rate >= 4 ? "text-yellow-300" : "text-gray-500"
        } } ms-1`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
      <svg
        className={`w-4 h-4 ${
          rate >= 5 ? "text-yellow-300" : "text-gray-500"
        } } ms-1`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    </div>
  );
}
