import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify"; // Для уведомлений
import useBookStore from "../../store/auth-books";
import { HeartIcon } from "lucide-react";

interface ProductCardProps {
  id: number;
  title: string;
  author?: string;
  price: number | string; // Поддержка string, так как в Book price: string
  condition: "New" | "Used";
  image?: string;
  is_favorited: boolean; // Добавляем поле для статуса избранного
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  author,
  price,
  condition,
  image,
  is_favorited: initialIsFavorited,
}) => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, getBooks } = useBookStore();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  // Обработчик переключения состояния избранного
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isFavorited) {
        await removeFromFavorites(id);
        setIsFavorited(false);
        toast.success("Книга видалена з обраного!");
      } else {
        await addToFavorites(id);
        setIsFavorited(true);
        toast.success("Книга додана до обраного!");
      }
      await getBooks();
    } catch (error: any) {
      toast.error("Помилка");
      console.error("Ошибка:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const navigateDetail = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition max-w-[300px]"
      onClick={navigateDetail}
    >
      <img
        src={image ? `http://127.0.0.1:8000${image}` : "/placeholder-image.jpg"} // Запасное изображение
        alt={title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">Автор: {author || "Неизвестный автор"}</p>
      <p className="text-green-600 font-bold">{price} грн</p>
      <p className="text-sm text-gray-500">
        Состояние: {condition === "New" ? "Новое" : "Б/У"}
      </p>
      <div className="flex justify-between items-center mt-2">
        <Link
          to={`/book/${title.toLowerCase().replace(/\s+/g, "-")}`} // Simple slug generation
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Детальніше
        </Link>
        <button
          onClick={handleToggleFavorite}
          className={`flex items-center ${
            isFavorited ? "text-red-500" : "text-gray-500"
          } hover:text-red-700 transition-colors duration-300`}
        >
          <HeartIcon className="w-5 h-5 mr-2" />
          {isFavorited ? "Видалити" : "В обрані"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
