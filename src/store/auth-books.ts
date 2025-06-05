// stores/book-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";
import { UserBooksListing } from "../@types/types";

enum BookCondition {
  NEW = "New",
  USED = "Used",
}

export interface Transaction {
  id: number;
  book: {
    id: number;
    title: string;
  };
  buyer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    region: string;
    city: string;
    phone_number: string;
  };
  seller: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    region: string;
    city: string;
  };
  amount: string;
  platform_commission: string;
  seller_amount: string;
  paypal_transaction_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  seller_confirmation_deadline: string | null;
  buyer_confirmation_deadline: string | null;
}

interface Book {
  id: number;
  title: string;
  description: string;
  price: string;
  category: {
    id: number;
    name: string;
  };
  genre: {
    id: number;
    name: string;
  };
  photo_detail?: {
    id: number;
    image: string;
  };
  condition: BookCondition;
  author: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    region: string;
    city: string;
    phone_number: string;
  };
  is_sold: boolean;
  transactions: Transaction[];
}

interface BookList {
  count: number;
  next: boolean;
  previous: boolean;
  results: Book[];
}

interface IBookStore {
  isLoading: boolean;
  books: BookList;
  detailBook: Book | null;
  userBooksListing: UserBooksListing;
  sellerTransactions: Transaction[];
  buyerTransactions: Transaction[];
  getBooks: (params?: any) => Promise<void>;
  createBook: (bookData: FormData) => Promise<void>;
  getDetailBook: (id: string) => Promise<void>;
  getAllBooksUserListing: (id: string) => Promise<void>;
  updateBook: (id: number, bookData: FormData) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  initiatePayment: (
    bookId: number
  ) => Promise<{ approval_url: string; transaction_id: number } | null>;
  confirmSellerShipment: (transactionId: number) => Promise<void>;
  confirmBuyerReceipt: (transactionId: number) => Promise<void>;
  openDispute: (transactionId: number) => Promise<void>;
  getSellerTransactions: () => Promise<void>;
  getBuyerTransactions: () => Promise<void>;
  // в useBookStore
  clearBooks: () => void;
}

const useBookStore = create(
  devtools<IBookStore>((set) => ({
    isLoading: false,
    books: { count: 0, next: false, previous: false, results: [] },
    detailBook: null,
    userBooksListing: {
      user: {
        id: 0,
        email: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        region: "",
        city: "",
        phone_number: "",
      },
      listings: [],
    },
    sellerTransactions: [],
    buyerTransactions: [],
    getBooks: async (params?: any) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<BookList>(
          "/books/book-listings/all/",
          {
            params: {
              items_per_page: params.items_per_page
                ? params.items_per_page
                : 12,
              ...params,
            },
          }
        );
        set({ books: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения книг:", error);
        set({ isLoading: false });
      }
    },
    // в useBookStore
    clearBooks: () =>
      set({ books: { count: 0, next: false, previous: false, results: [] } }),
    getDetailBook: async (id: string) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<Book>(`/books/book/${id}/`);
        set({ detailBook: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения книги:", error);
        set({ isLoading: false });
      }
    },
    getAllBooksUserListing: async (id: string) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<UserBooksListing>(
          `/books/user/${id}/listings/`
        );
        set({ userBooksListing: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения книг пользователя:", error);
        set({ isLoading: false });
      }
    },
    createBook: async (bookData: FormData) => {
      set({ isLoading: true });
      try {
        await instance.post("/books/create/", bookData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await useBookStore.getState().getBooks();
      } catch (error) {
        console.error("Ошибка создания книги:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    updateBook: async (id: number, bookData: FormData) => {
      set({ isLoading: true });
      try {
        await instance.put(`/books/book/${id}/update/`, bookData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await useBookStore.getState().getBooks();
      } catch (error) {
        console.error("Ошибка обновления книги:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    deleteBook: async (id: number) => {
      set({ isLoading: true });
      try {
        await instance.delete(`/books/book/${id}/delete/`);
        await useBookStore.getState().getBooks();
      } catch (error) {
        console.error("Ошибка удаления книги:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    initiatePayment: async (bookId: number) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.post<{
          approval_url: string;
          transaction_id: number;
        }>(`/books/book/${bookId}/payment/initiate/`);
        set({ isLoading: false });
        return data;
      } catch (error) {
        console.error("Ошибка инициирования платежа:", error);
        set({ isLoading: false });
        return null;
      }
    },
    confirmSellerShipment: async (transactionId: number) => {
      set({ isLoading: true });
      try {
        await instance.post(
          `/books/transaction/${transactionId}/seller-confirm/`
        );
        const id = useBookStore.getState().detailBook?.id;
        if (id) {
          await useBookStore.getState().getDetailBook(id.toString());
        }
      } catch (error) {
        console.error("Ошибка подтверждения отправки:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    confirmBuyerReceipt: async (transactionId: number) => {
      set({ isLoading: true });
      try {
        await instance.post(
          `/books/transaction/${transactionId}/buyer-confirm/`
        );
        const id = useBookStore.getState().detailBook?.id;
        if (id) {
          await useBookStore.getState().getDetailBook(id.toString());
        }
      } catch (error) {
        console.error("Ошибка подтверждения получения:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    openDispute: async (transactionId: number) => {
      set({ isLoading: true });
      try {
        await instance.post(`/books/transaction/${transactionId}/dispute/`);
        const id = useBookStore.getState().detailBook?.id;
        if (id) {
          await useBookStore.getState().getDetailBook(id.toString());
        }
      } catch (error) {
        console.error("Ошибка открытия спора:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    getSellerTransactions: async () => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<Transaction[]>(
          "/books/seller/transactions/"
        );
        set({ sellerTransactions: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения транзакций продавца:", error);
        set({ isLoading: false });
      }
    },
    getBuyerTransactions: async () => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<Transaction[]>(
          "/books/buyer/transactions/"
        );
        set({ buyerTransactions: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения транзакций покупателя:", error);
        set({ isLoading: false });
      }
    },
  }))
);

export default useBookStore;
