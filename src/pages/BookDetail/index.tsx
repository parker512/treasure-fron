import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import useBookStore from "../../store/auth-books";
import { ButtonVariants } from "../../components/ui/Button/types";
import { Sizes } from "../../@types/sizes";
import { useChatStore } from "../../store/chat-store";
import axios from "axios";
import { instance } from "../../services/api-client";

export default function BookDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const setCurrentChatId = useChatStore((s) => s.setCurrentChatId);
  const setMessages = useChatStore((s) => s.setMessages);

  const { detailBook: book } = useBookStore((state) => state);
  const getDetailBook = useBookStore((state) => state.getDetailBook);

  console.log("Book details:", book);

  useEffect(() => {
    if (id) {
      getDetailBook(id);
    }
  }, [getDetailBook, id]);

  const handleViewOtherListings = () => {
    navigate(`/user/${book?.user?.id}/listings`);
  };

  const handleContact = async () => {
    try {
      const res = await instance.post(`/chat/create/${id}/`);

      setCurrentChatId(res.data.chat_id);
      setMessages(res.data.messages);
      navigate(`/chat/${res.data.chat_id}`);
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Зображення книги */}
        <div className="lg:w-1/3 flex justify-center">
          <div className="relative group">
            <img
              className="rounded-2xl shadow-xl object-cover w-full h-auto max-h-[600px] transition-transform duration-300 group-hover:scale-105"
              src={
                book?.photo_detail?.image ||
                "https://via.placeholder.com/400x600?text=Обкладинка+книги"
              }
              alt={book?.title || "Обкладинка книги"}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Деталі книги */}
        <div className="lg:w-2/3 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {book?.title || "Без назви"}
            </h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                <span className="font-semibold text-gray-800">Обкладинка:</span>{" "}
                {book?.category?.name || "Н/Д"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Жанр:</span>{" "}
                {book?.genre?.name || "Н/Д"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Стан:</span>{" "}
                {book?.condition || "Н/Д"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Опис:</span>{" "}
                {book?.description || "Опис відсутній."}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Локація:</span>{" "}
                {book?.user?.region || "Н/Д"}, {book?.user?.city || "Н/Д"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Ціна:</span>{" "}
                {book?.price ? `${book.price} грн` : "Н/Д"}
              </p>
            </div>
          </div>

          {/* Інформація про продавця */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Продавець
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              {book?.user?.first_name || "Н/Д"} {book?.user?.last_name || ""}
            </p>
            <div className="flex gap-4">
              <Button
                variant={ButtonVariants.PRIMARY}
                size={Sizes.L}
                className="transition-all duration-300 hover:shadow-lg"
                onClick={handleContact}
              >
                Зв'язатися з продавцем
              </Button>
              <Button
                variant={ButtonVariants.SECONDARY}
                size={Sizes.L}
                className="transition-all duration-300 hover:shadow-lg"
                onClick={handleViewOtherListings}
              >
                Перейти на профіль
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальне вікно для зв'язку */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Зв'язатися з продавцем
            </h3>
            <p className="text-gray-600 mb-6">
              Надішліть повідомлення {book?.user?.first_name || "продавцю"} щодо
              цієї книги.
            </p>
            <textarea
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введіть ваше повідомлення..."
            ></textarea>
            <div className="flex gap-4 mt-6">
              <Button
                variant={ButtonVariants.PRIMARY}
                size={Sizes.M}
                onClick={() => setIsContactOpen(false)}
                className="!px-20 py-2"
              >
                Надіслати
              </Button>
              <Button
                variant={ButtonVariants.SECONDARY}
                size={Sizes.M}
                onClick={() => setIsContactOpen(false)}
                className="!px-20 py-2"
              >
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
