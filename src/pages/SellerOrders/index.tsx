import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import useBookStore, { Transaction } from "../../store/auth-books";
import useAuthStore from "../../store/auth-store";
import { Button } from "../../components/ui/Button";
import { ButtonVariants } from "../../components/ui/Button/types";
import { Sizes } from "../../@types/sizes";

export default function Orders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"seller" | "buyer">("seller");
  const {
    sellerTransactions,
    buyerTransactions,
    getSellerTransactions,
    getBuyerTransactions,
    confirmSellerShipment,
    confirmBuyerReceipt,
    openDispute,
    isLoading,
  } = useBookStore();
  const { isAuthorized } = useAuthStore();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
      return;
    }
    getSellerTransactions();
    getBuyerTransactions();
  }, [getSellerTransactions, getBuyerTransactions, isAuthorized, navigate]);

  const handleSellerConfirm = async (transactionId: number) => {
    try {
      await confirmSellerShipment(transactionId);
      toast.success("Отправка подтверждена");
      getSellerTransactions(); // Refresh seller transactions
    } catch (error) {
      toast.error("Ошибка подтверждения отправки");
      console.error("Ошибка подтверждения отправки:", error);
    }
  };

  const handleBuyerConfirm = async (transactionId: number) => {
    try {
      await confirmBuyerReceipt(transactionId);
      toast.success("Получение подтверждено, сделка завершена");
      getBuyerTransactions(); // Refresh buyer transactions
    } catch (error) {
      toast.error("Ошибка подтверждения получения");
      console.error("Ошибка подтверждения получения:", error);
    }
  };

  const handleDispute = async (transactionId: number) => {
    try {
      await openDispute(transactionId);
      toast.success("Спор открыт, ожидайте решения администратора");
      getBuyerTransactions(); // Refresh buyer transactions
    } catch (error) {
      toast.error("Ошибка открытия спора");
      console.error("Ошибка открытия спора:", error);
    }
  };

  const renderTable = (transactions: Transaction[], isSeller: boolean) => {
    if (transactions.length === 0) {
      return (
        <p className="text-gray-600 text-lg">
          {isSeller ? "У вас пока нет заказов." : "У вас пока нет покупок."}
        </p>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Книга
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {isSeller ? "Покупатель" : "Продавец"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`/book/${transaction.book.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {transaction.book.title}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isSeller
                    ? `${transaction.buyer.first_name} ${transaction.buyer.last_name}`
                    : `${transaction.seller.first_name} ${transaction.seller.last_name}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.amount} грн
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isSeller && transaction.status === "PAID" && (
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
                  {!isSeller && transaction.status === "SELLER_CONFIRMED" && (
                    <div className="flex gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
        Мої замовлення та покупки
      </h2>
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("seller")}
              className={`${
                activeTab === "seller"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Мої замовлення
            </button>
            <button
              onClick={() => setActiveTab("buyer")}
              className={`${
                activeTab === "buyer"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Мої покупки
            </button>
          </nav>
        </div>
      </div>
      {activeTab === "seller"
        ? renderTable(sellerTransactions, true)
        : renderTable(buyerTransactions, false)}
    </div>
  );
}
