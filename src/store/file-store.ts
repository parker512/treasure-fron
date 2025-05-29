import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";

interface IFileStore {
  uploadFile: (file: File) => Promise<void>;
  response: any;
  uploadDocument: (category: string, file: File) => Promise<void>;
  responseDocument: any;
  reset: () => void; // Новая функция сброса
}

const useFileStore = create(
  devtools<IFileStore>((set) => ({
    response: null,
    uploadFile: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const { data } = await instance.post("media/upload-photo/", formData);
        set({ response: data });
      } catch (error) {
        console.error("Ошибка загрузки файла", error);
      }
    },
    responseDocument: null,
    uploadDocument: async (category, file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      try {
        const { data } = await instance.post("upload/uploadFile", formData);
        set({ responseDocument: data.result });
      } catch (error) {
        console.error("Ошибка загрузки документа", error);
      }
    },
    reset: () => set({ response: null, responseDocument: null }), // Сбрасываем оба состояния
  }))
);

export default useFileStore;
