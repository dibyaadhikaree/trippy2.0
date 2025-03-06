import TextExpander from "@/app/_components/TextExpander";

export default function Review({ reviews }) {
  console.log(reviews);

  console.log(reviews[0].text.toString());

  // return <div>This is revview</div>;

  return reviews.map((review) => (
    <div className="flex m-2 border-2 p-2 border-primary-50 " key={review._id}>
      <TextExpander>{review.text}</TextExpander>
    </div>
  ));
}
