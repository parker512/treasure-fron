// src/components/ProductPage.tsx
import React from "react";
import { useParams } from "react-router-dom"; // For dynamic routing

interface Book {
  title: string;
  author: string;
  price: number;
  condition: "New" | "Used";
  description: string;
  seller: { name: string; contact: string };
  image: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Assuming book ID from URL

  // Mock data (replace with real data fetching logic)
  const book: Book = {
    title: "Sample Book",
    author: "Sample Author",
    price: 12,
    condition: "Used",
    description: "A fascinating book about something interesting.",
    seller: { name: "John Doe", contact: "john@example.com" },
    image: "https://via.placeholder.com/300",
  };

  return (
    <div className="container mx-auto py-12 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Book Image */}
        <div className="md:w-1/2">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Book Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          <p className="text-green-600 text-2xl font-bold mb-2">
            ${book.price}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Condition: {book.condition}
          </p>
          <p className="text-gray-700 mb-6">{book.description}</p>

          {/* Seller Info */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold">
              Seller: {book.seller.name}
            </h3>
            <button className="text-blue-600 hover:underline">
              Contact: {book.seller.contact}
            </button>
          </div>

          {/* Buy Now Button */}
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full md:w-auto">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
