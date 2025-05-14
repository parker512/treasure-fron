import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";

interface IFileStore {
  uploadFile: (file: File) => Promise<void>;
  response: any;
  uploadDocument: (category: string, file: File) => Promise<void>;
  responseDocument: any;
}

const useFileStore = create(
  devtools<IFileStore>((set) => ({
    response: null,
    uploadFile: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const { data } = await instance.post("media/upload-photo/", formData);

        set({ uploadFile: data });
        set({ response: data });
      } catch (error) {
        // const errorText = error?.response?.data?.message;
        // NotificationService.error(errorText);
      }
    },
    responseDocument: null,
    uploadDocument: async (category, file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      try {
        const { data } = await instance.post("upload/uploadFile", formData);
        set({ uploadDocument: data });
        set({ responseDocument: data.result });
      } catch (error) {
        // const errorText = error?.response?.data?.message;
        // NotificationService.error(errorText);
      }
    },
  }))
);

export default useFileStore;
