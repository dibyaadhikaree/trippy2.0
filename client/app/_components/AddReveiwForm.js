export function AddReviewForm({ placeId }) {
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      text: event.target.text.value,
      rating: event.target.rating.value,
      place: placeId,
    };

    const data = await createReview(placeId, formData);

    // Refresh the page to show the new review
    window.location.reload();
  };

  return (
    <form
      action={() => {
        "use server";
        handleFormSubmit;
      }}
    >
      <textarea name="text" placeholder="Write a review" required />
      <input type="number" name="rating" min="1" max="5" required />
      <button type="submit">Submit Review</button>
    </form>
  );
}
