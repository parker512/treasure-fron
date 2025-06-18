// src/components/MainPage.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import useBookStore from "../../store/auth-books";
import useAuthStore from "../../store/auth-store";

const MainPage: React.FC = () => {
  const getBooks = useBookStore((state) => state.getBooks);
  const getUser = useAuthStore((state) => state.getUser);
  const bookList = useBookStore((state) => state.books);
  const user = useAuthStore((state) => state.user);
  const clearBooks = useBookStore((state) => state.clearBooks);
  const books = bookList.results;

  console.log(books);
  useEffect(() => {
    return () => {
      clearBooks();
    };
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!user.region) return;
    clearBooks();
    getBooks({ items_per_page: 6, city: user.region });
  }, [getBooks, user]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Discover Your Next Favorite Book
        </h1>
        <Link
          to="/browse"
          className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-200"
        >
          Browse Books
        </Link>
      </section>

      {/* Featured Books Section */}
      <section className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Останні книги у вашому регіоні
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length > 0 ? (
            books.map((book) => (
              <ProductCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={Number(book.price)}
                condition={book.condition}
                image={book?.photo_detail?.image}
                is_favorited={book.is_favorited}
              />
            ))
          ) : (
            <p>Немає книг</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
