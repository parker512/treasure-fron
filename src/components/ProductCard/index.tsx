// src/components/ProductCard.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  title: string;
  author?: string;
  price: number;
  condition: "New" | "Used";
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  author,
  price,
  condition,
  image,
}) => {
  const navigate = useNavigate();
  const navigateDetail = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition max-w-[300px]"
      onClick={navigateDetail}
    >
      <img
        src={`http://127.0.0.1:8000${image}`}
        alt={title}
        className="w-40  rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">by {author}</p>
      <p className="text-green-600 font-bold">${price}</p>
      <p className="text-sm text-gray-500">Condition: {condition}</p>
      <Link
        to={`/book/${title.toLowerCase().replace(/\s+/g, "-")}`} // Simple slug generation
        className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
