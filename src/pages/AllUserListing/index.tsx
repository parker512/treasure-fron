import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import useBookStore from "../../store/auth-books";
import { ButtonVariants } from "../../components/ui/Button/types";
import { Sizes } from "../../@types/sizes";

export default function UserListings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const getAllBooksUserListing = useBookStore(
    (state) => state.getAllBooksUserListing
  );
  const userBooksListing = useBookStore((state) => state.userBooksListing);
  console.log("userBooksListing", userBooksListing);

  const user = userBooksListing?.user;
  const listings = userBooksListing?.listings || [];

  useEffect(() => {
    if (id) {
      getAllBooksUserListing(id);
    }
  }, [getAllBooksUserListing, id]);

  const handleContact = () => {
    setIsContactOpen(true);
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Інформація про користувача */}
        <div className="lg:w-1/3">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              {user?.first_name || "Н/Д"} {user?.last_name || ""}
            </h2>
            <div className="space-y-3 text-gray-600 text-lg">
              <p>
                <span className="font-semibold text-gray-800">Локація:</span>{" "}
                {user?.region || "Н/Д"}, {user?.city || "Н/Д"}
              </p>
            </div>
            <Button
              variant={ButtonVariants.PRIMARY}
              size={Sizes.L}
              className="mt-6 w-full transition-all duration-300 hover:shadow-lg"
              onClick={handleContact}
            >
              Зв'язатися з продавцем
            </Button>
          </div>
        </div>

        {/* Список оголошень */}
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Усі оголошення
          </h2>
          {listings?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  onClick={() => handleBookClick(book.id.toString())}
                >
                  <img
                    className="w-full h-auto object-fill  rounded-xl mb-4"
                    src={
                      "http://127.0.0.1:8000" + book?.photo_detail?.image ||
                      "https://via.placeholder.com/200x300?text=Обкладинка+книги"
                    }
                    alt={book?.title || "Обкладинка книги"}
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {book?.title || "Без назви"}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Обкладинка:</span>{" "}
                    {book?.category?.name || "Н/Д"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Жанр:</span>{" "}
                    {book?.genre?.name || "Н/Д"}
                  </p>
                  <p className="text-gray-800 font-bold">
                    <span className="font-medium">Ціна:</span>{" "}
                    {book?.price ? `${book.price} грн` : "Н/Д"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg">Оголошення відсутні.</p>
          )}
        </div>
      </div>

      {/* Модальне вікно для зв'язку */}
      {/* {isContactOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Зв'язатися з продавцем
            </h3>
            <p className="text-gray-600 mb-6">
              Надішліть повідомлення {user?.first_name || "продавцю"} щодо його
              оголошень.
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
              >
                Надіслати
              </Button>
              <Button
                variant={ButtonVariants.SECONDARY}
                size={Sizes.M}
                onClick={() => setIsContactOpen(false)}
              >
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
