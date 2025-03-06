import { createReview } from "../_services/data-services";
import Button from "./Button";

// export function AddReviewForm({ placeId }) {
//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     const formData = {
//       text: event.target.text.value,
//       rating: event.target.rating.value,
//       place: placeId,
//     };

//     const data = await createReview(placeId, formData);
//   };

//   return (
//     <form action={handleFormSubmit}>
//       <textarea name="text" placeholder="Write a review" required />
//       <input type="number" name="rating" min="1" max="5" required />
//       <button type="submit">Submit Review</button>
//     </form>
//   );
// }
export function AddReviewForm({ placeId }) {
  return (
    <form
      action={async (data) => {
        "use server";
        const formData = {
          text: data.get("text"),
          rate: data.get("rate"),
        };
        const newReview = await createReview(placeId, formData);
      }}
      className="bg-primary-900 py-3 px-6 text-lg flex gap-3 flex-col"
    >
      <div className="flex items-center gap-4">
        <label htmlFor="numGuests">Rate?</label>
        <input
          type="number"
          min="1"
          max="5"
          step="1"
          name="rate"
          id="rate"
          className=" bg-primary-200 text-primary-800 m-2 shadow-sm rounded-sm"
          required
        ></input>
      </div>

      <div className="space-y-2">
        <label htmlFor="observations">Review</label>
        <input
          type="text"
          name="text"
          id="text"
          className=" bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center my-6 ">
        <Button buttonname="Update Now" updating={"Adding your Review"} />
      </div>
    </form>
  );
}
