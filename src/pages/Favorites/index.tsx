import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import useBookStore from "../../store/auth-books";
import { HeartIcon } from "lucide-react";

export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, getFavorites, removeFromFavorites } =
    useBookStore();

  // Загружаем избранные книги при монтировании компонента
  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  // Обработчик удаления из избранного
  const handleRemoveFromFavorites = async (bookId: number) => {
    await removeFromFavorites(bookId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Избранные книги</h1>
      {isLoading ? (
        <div className="text-center">Загрузка...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-gray-500">
          У вас нет избранных книг.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Link to={`/book/${favorite.book_listing.id}`}>
                {favorite.book_listing.photo_detail ? (
                  <img
                    src={favorite.book_listing.photo_detail.image}
                    alt={favorite.book_listing.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    Нет изображения
                  </div>
                )}
              </Link>
              <div className="p-4">
                <Link to={`/book/${favorite.book_listing.id}`}>
                  <h2 className="text-xl font-semibold mb-2">
                    {favorite.book_listing.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-2">
                  Автор: {favorite.book_listing.author}
                </p>
                <p className="text-gray-600 mb-2">
                  Цена: {favorite.book_listing.price} грн
                </p>
                <p className="text-gray-600 mb-4">
                  Состояние:{" "}
                  {favorite.book_listing.condition === "New" ? "Новое" : "Б/У"}
                </p>
                <button
                  onClick={() =>
                    handleRemoveFromFavorites(favorite.book_listing.id)
                  }
                  className="flex items-center text-red-500 hover:text-red-700"
                >
                  <HeartIcon className="w-5 h-5 mr-2" />
                  Видалити з обраного
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
