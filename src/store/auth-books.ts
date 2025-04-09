import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";

interface IBookStore {
  isLoading: boolean;
  books: any[];
  getBooks: () => void;
}

const useBookStore = create(
  devtools<IBookStore>((set) => ({
    isLoading: false,
    books: [],
    getBooks: async () => {
      set({ isLoading: true });
      try {
        const { data } = await instance.get<any>("books/book-listings/all/");
        set({ books: data, isLoading: false });
      } catch (error) {
        console.error("Ошибка получения книг:", error);
        set({ isLoading: false });
      }
    },
  }))
);

export default useBookStore;
