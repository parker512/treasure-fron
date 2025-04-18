// stores/book-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";

interface Book {
  id: number;
  title: string;
  description: string;
  price: string;
  category: any;
  genre: any;
  photo_detail?: {
    id: number;
    image: string;
  };
}

interface IBookStore {
  isLoading: boolean;
  books: Book[];
  getBooks: () => Promise<void>;
  createBook: (bookData: FormData) => Promise<void>;
}

const useBookStore = create(
  devtools<IBookStore>((set) => ({
    isLoading: false,
    books: [],
    getBooks: async () => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<Book[]>(
          "/books/book-listings/all/"
        );
        set({ books: data, isLoading: false });
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
  }))
);

export default useBookStore;
