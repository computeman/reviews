import React from "react";
import StarRatings from "react-star-ratings";

const ReviewCard = ({
  review,
  fetchReviews,
  setEditingReview,
  setIsEditing,
}) => {
  const deleteReview = async (id) => {
    await fetch(`http://localhost:3001/reviews/${id}`, {
      method: "DELETE",
    });
    fetchReviews(); // Refresh the reviews list after deletion
  };

  const startEdit = (review) => {
    setEditingReview(review); // Set the review to be edited in the parent component's state
    setIsEditing(true); // Indicate that the app is in "editing mode"
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md m-4 p-4">
      <h5 className="text-lg font-bold">{review.productName}</h5>
      <StarRatings
        rating={review.rating}
        starRatedColor="yellow"
        numberOfStars={5}
        name="rating"
        starDimension="20px"
        starSpacing="2px"
      />
      <p className="text-gray-700 mt-2">{review.comments}</p>
      <p className="text-gray-600 text-sm">
        Reviewed on: {new Date(review.reviewDate).toLocaleDateString()}
      </p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => startEdit(review)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-l"
        >
          Edit
        </button>
        <button
          onClick={() => deleteReview(review.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-r"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
