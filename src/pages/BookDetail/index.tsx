// components/BookDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import useAuthStore from "../../store/auth-store";
import { ButtonVariants } from "../../components/ui/Button/types";
import { Sizes } from "../../@types/sizes";
import { useChatStore } from "../../store/chat-store";
import { instance } from "../../services/api-client";
import { toast } from "react-toastify";
import useBookStore from "../../store/auth-books";

export default function BookDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setCurrentChatId = useChatStore((s) => s.setCurrentChatId);
  const setMessages = useChatStore((s) => s.setMessages);
  const {
    detailBook: book,
    getDetailBook,
    initiatePayment,
    confirmSellerShipment,
    confirmBuyerReceipt,
    openDispute,
    isLoading,
  } = useBookStore();
  const { user, isAuthorized } = useAuthStore();

  useEffect(() => {
    if (id) {
      getDetailBook(id);
    }
  }, [getDetailBook, id]);

  // Handle PayPal redirect callback
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentId = query.get("paymentId");
    const payerId = query.get("PayerID");
    const cancelled = query.get("cancelled");

    if (cancelled === "true") {
      toast.error("Платеж был отменен");
      navigate(`/book/${id}`, { replace: true });
      return;
    }

    if (paymentId && payerId && id) {
      instance
        .get(
          `/books/payment/execute/?paymentId=${paymentId}&PayerID=${payerId}`
        )
        .then((response) => {
          toast.success("Платеж успешно выполнен");
          getDetailBook(id);
          navigate(`/book/${id}`, { replace: true });
          setError(null);
        })
        .catch((err) => {
          toast.error("Ошибка выполнения платежа");
          console.error("Payment execution error:", err);
        });
    }
  }, [location, id, getDetailBook, navigate]);

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
      toast.error("Ошибка при создании чата");
      console.error("Ошибка при создании чата:", error);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthorized) {
      navigate("/login");
      return;
    }
    if (!id) return;
    const result = await initiatePayment(parseInt(id));
    if (result) {
      toast.info("Перенаправление на PayPal...");
      window.location.href = result.approval_url;
    } else {
      toast.error("Ошибка инициирования платежа");
    }
  };

  const handleSellerConfirm = async (transactionId: number) => {
    try {
      await confirmSellerShipment(transactionId);
      toast.success("Отправка подтверждена");
    } catch (error) {
      toast.error("Ошибка подтверждения отправки");
      console.error("Ошибка подтверждения отправки:", error);
    }
  };

  const handleBuyerConfirm = async (transactionId: number) => {
    try {
      await confirmBuyerReceipt(transactionId);
      toast.success("Получение подтверждено, сделка завершена");
    } catch (error) {
      toast.error("Ошибка подтверждения получения");
      console.error("Ошибка подтверждения получения:", error);
    }
  };

  const handleDispute = async (transactionId: number) => {
    try {
      await openDispute(transactionId);
      toast.success("Спор открыт, ожидайте решения администратора");
    } catch (error) {
      toast.error("Ошибка открытия спора");
      console.error("Ошибка открытия спора:", error);
    }
  };

  const renderTransactionStatus = () => {
    if (!book?.transactions || book.transactions.length === 0) return null;

    const transaction = book.transactions[0];
    const isBuyer = user?.id === transaction.buyer.id;
    const isSeller = user?.id === transaction.seller.id;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Статус транзакции
        </h3>
        <p className="text-gray-700 text-lg mb-4">
          Статус:{" "}
          {transaction.status === "PENDING"
            ? "Ожидает оплаты"
            : transaction.status === "PAID"
            ? "Оплачено"
            : transaction.status === "SELLER_CONFIRMED"
            ? "Продавец подтвердил отправку"
            : transaction.status === "BUYER_CONFIRMED"
            ? "Покупатель подтвердил получение"
            : transaction.status === "COMPLETED"
            ? "Завершено"
            : transaction.status === "CANCELLED"
            ? "Отменено"
            : transaction.status === "DISPUTED"
            ? "Спор открыт"
            : "Неизвестно"}
        </p>
        {transaction.status === "PAID" && isSeller && (
          <Button
            variant={ButtonVariants.PRIMARY}
            size={Sizes.M}
            onClick={() => handleSellerConfirm(transaction.id)}
            className="transition-all duration-300 hover:shadow-lg"
            isDisabled={isLoading}
          >
            Подтвердить отправку
          </Button>
        )}
        {transaction.status === "SELLER_CONFIRMED" && isBuyer && (
          <div className="flex gap-4">
            <Button
              variant={ButtonVariants.PRIMARY}
              size={Sizes.M}
              onClick={() => handleBuyerConfirm(transaction.id)}
              className="transition-all duration-300 hover:shadow-lg"
              isDisabled={isLoading}
            >
              Подтвердить получение
            </Button>
            <Button
              variant={ButtonVariants.SECONDARY}
              size={Sizes.M}
              onClick={() => handleDispute(transaction.id)}
              className="transition-all duration-300 hover:shadow-lg"
              isDisabled={isLoading}
            >
              Открыть спор
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Book Image */}
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

        {/* Book Details */}
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
            {book?.is_sold ? (
              <p className="text-red-600 font-semibold mt-4">Книга продана</p>
            ) : (
              <Button
                variant={ButtonVariants.PRIMARY}
                size={Sizes.L}
                onClick={handleBuyNow}
                className="mt-6 transition-all duration-300 hover:shadow-lg"
                isDisabled={
                  isLoading ||
                  user?.id === book?.user?.id ||
                  !isAuthorized ||
                  book?.is_sold
                }
              >
                Купить сейчас
              </Button>
            )}
          </div>

          {/* Seller Info */}
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
                isDisabled={isLoading}
              >
                Зв'язатися с продавцем
              </Button>
              <Button
                variant={ButtonVariants.SECONDARY}
                size={Sizes.L}
                className="transition-all duration-300 hover:shadow-lg"
                onClick={handleViewOtherListings}
                isDisabled={isLoading}
              >
                Перейти на профіль
              </Button>
            </div>
          </div>

          {/* Transaction Status */}
          {renderTransactionStatus()}
        </div>
      </div>

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Зв'язатися с продавцем
            </h3>
            <p className="text-gray-600 mb-6">
              Надішліть повідомлення {book?.user?.first_name || "продавцу"} щодо
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
