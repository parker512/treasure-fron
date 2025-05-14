// stores/book-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";
import { UserBooksListing } from "../@types/types";

enum BookCondition {
  NEW = "New",
  USED = "Used",
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
  getBooks: (params?: any) => Promise<void>;
  createBook: (bookData: FormData) => Promise<void>;
  getDetailBook: (id: string) => Promise<void>;
  getAllBooksUserListing: (id: string) => Promise<void>;
  updateBook: (id: number, bookData: FormData) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
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
    getBooks: async (params?: any) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<BookList>(
          "/books/book-listings/all/",
          {
            params: {
              items_per_page: 6,
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
    getDetailBook: async (id: string) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<any>(`/books/book/${id}/`);
        set({ detailBook: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения книг:", error);
        set({ isLoading: false });
      }
    },
    getAllBooksUserListing: async (id: string) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<any>(`/books/user/${id}/listings/`);
        set({ userBooksListing: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения книг:", error);
        set({ isLoading: false });
      }
    },
    createBook: async (bookData: FormData) => {
      set({ isLoading: true });
      try {
        await instance.post("/books/create/", bookData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // После создания сразу рефетчим книги
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
        await useBookStore.getState().getBooks(); // опционально, если хочешь обновить список
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
        await useBookStore.getState().getBooks(); // опционально, если хочешь обновить список
      } catch (error) {
        console.error("Ошибка удаления книги:", error);
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);

export default useBookStore;
