// ReviewList.js
import React from "react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews, fetchReviews }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          fetchReviews={fetchReviews}
        />
      ))}
    </div>
  );
};

export default ReviewList;
