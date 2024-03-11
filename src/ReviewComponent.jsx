import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReviewComponent = () => {
  // State to store user details and reviews
  const [hasPurchased, setHasPurchased] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setNewRating] = useState("");
  const [comment, setNewComment] = useState("");

  // Function to fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/checksession", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setCurrentUser(data);
      console.log(data.id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Function to submit a review
  // const product_id = productId
  const handleSubmit = async (productId, rating, comment) => {
    try {
      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      alert("Review successfully posted");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  // Function to get reviews for a specific product
  const fetchReviewsForProduct = async (product_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/review/${product_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setReviews(data);
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews.");
      setIsLoading(false);
    }
  };

  // Function to check purchase status
  const checkPurchase = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/check-purchase/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setHasPurchased(data.hasPurchased);
      console.log(`hasPurchased: ${data.hasPurchased}`);
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  // Function to delete a review
  const deleteReview = async (review_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/deleteReview/${review_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      alert("Review deleted successfully");
      // Optionally, fetch the updated list of reviews here
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  // Example useEffect to fetch current user on component mount
  useEffect(() => {
    fetchCurrentUser();
    checkPurchase();
    fetchReviewsForProduct(productId); // Fetch reviews for the specific product
  }, [productId]);

  // Your component's render logic goes here

  return (
    <div className="container mx-auto p-4">
      {/* Loading and error state handling */}
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <>
          {" "}
          {/* Render reviews list and form only if reviews exist */}
          {/* Review Creation Form */}
          {hasPurchased && (
            <div className="review-form">
              <h2>Add Your Review</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setNewRating(e.target.value)}
                  placeholder="Rating (1-5)"
                  required
                />
                <textarea
                  value={comment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your review"
                  required
                />
                <button type="submit">Submit Review</button>
              </form>
            </div>
          )}
          {/* Reviews Display */}
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <h3>Rating: {review.rating}</h3>
                <p>{review.comments}</p>
                {/* Delete button for current user's reviews */}
                {currentUser && review.userId === currentUser.id && (
                  <button onClick={() => deleteReview(review.id)}>
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ReviewComponent;
