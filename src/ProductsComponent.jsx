import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductsComponent = () => {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/reviews/${productId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("accessToken");
        console.log(token);

        // Include the token in the request headers
        const response = await fetch("http://localhost:5000/customerproducts", {
          method: "GET", // Assuming it's a GET request; adjust if necessary
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the Bearer scheme for Authorization header
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <button onClick={() => handleProductClick(product.id)}>
              {product.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsComponent;
