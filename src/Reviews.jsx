// Reviews.js
import React, { useEffect, useState } from "react";
import ReviewList from "./ReviewList"; // Component to list reviews
import AddReviewForm from "./AddReviewForm"; // Component to add a new review

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const response = await fetch("http://localhost:3001/reviews");
    const data = await response.json();
    setReviews(data);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-4">Product Reviews</h1>
      <AddReviewForm fetchReviews={fetchReviews} />
      <ReviewList reviews={reviews} fetchReviews={fetchReviews} />
    </div>
  );
};

export default Reviews;
