// AddReviewForm.js
import React, { useState } from "react";

const AddReviewForm = ({ fetchReviews }) => {
  const [productName, setProductName] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      productName,
      rating,
      comments,
      reviewDate: new Date().toISOString(),
    };
    await fetch("http://localhost:3001/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    });
    fetchReviews(); // Refresh the list of reviews
    // Reset form fields
    setProductName("");
    setRating(5);
    setComments("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-8">
      <div className="mb-4">
        <label
          htmlFor="productName"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="rating"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Rating
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      <div className="mb-6">
        <label
          htmlFor="comments"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Comments
        </label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        ></textarea>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default AddReviewForm;
