import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import "./Review.css";

const ReviewComponent = () => {
  // State to store user details and reviews
  const [hasPurchased, setHasPurchased] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setNewRating] = useState(0);
  const [comment, setNewComment] = useState("");
  const [ratingCounts, setRatingCounts] = useState({});

  useEffect(() => {
    const fetchRatingCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/reviews/${productId}/rating-counts`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rating counts");
        }
        const ratingCounts = await response.json();
        setRatingCounts(ratingCounts);
      } catch (error) {
        console.error("Error fetching rating counts:", error);
      }
    };

    fetchRatingCounts();
  }, [productId]);

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
      console.log(`Current user: ${data.id}`);
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
      fetchReviewsForProduct();
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
      console.log(`reviews ${data}`);
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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      alert("Review deleted successfully");
      fetchReviewsForProduct(productId);
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

  return (
    <div className="container">
      <div className="rating-breakdown">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="rating-stars">
            <StarRatings
              rating={rating}
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="15px" // Adjust size
              starSpacing="2px"
              isAggregateRating={true} // Read-only
            />
            <span>({ratingCounts[rating] || 0})</span>
          </div>
        ))}
      </div>
      <div className="reviews-container">
        {/* Loading and error state handling */}
        {isLoading ? (
          <p className="loading-text">Loading reviews...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="no-reviews-text">No reviews yet.</p>
        ) : (
          <>
            {/* Render reviews list and form only if reviews exist */}
            {/* Review Creation Form */}
            {hasPurchased && (
              <div className="review-form">
                <h2 className="form-heading">Add Your Review</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(productId, rating, comment);
                  }}
                  className="submit-form"
                >
                  <StarRatings
                    rating={Number(rating)}
                    starRatedColor="gold"
                    changeRating={setNewRating}
                    numberOfStars={5}
                    name="rating"
                    starDimension="30px"
                    starSpacing="5px"
                  />
                  <textarea
                    className="comment-textarea"
                    value={comment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your review"
                    required
                  />
                  <button type="submit" className="submit-btn">
                    Submit Review
                  </button>
                </form>
              </div>
            )}
            {/* Reviews Display */}
            <ul className="review-list">
              {reviews.map((review) => (
                <li key={review.id} className="review-item">
                  <h3 className="review-rating">
                    Rating:
                    <StarRatings
                      rating={review.name}
                      starRatedColor="gold"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="3px"
                      isAggregateRating={true}
                    />
                  </h3>
                  <p className="review-comment">{review.comments}</p>
                  {/* Delete button for current user's reviews */}
                  {currentUser && review.userId === currentUser.id && (
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
