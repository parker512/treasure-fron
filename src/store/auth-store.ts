import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";
import { ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from "../constants/cookiesKeys";
import Cookies from "js-cookie";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface IAuthTokens {
  access_token: string;
  refresh_token: string;
}

interface IAuthStore {
  isLoading: boolean;
  login: (values: LoginParams, onSuccess: () => void) => void;
  logout: () => void;
  register: (values: RegisterParams, onSuccess: () => void) => void;
}

const useAuthStore = create(
  devtools<IAuthStore>((set) => ({
    isLoading: false,
    login: async (values: LoginParams, onSuccess: () => void) => {
      set({ isLoading: true });
      console.log("Values in store:", values);
      try {
        const { data } = await instance.post<IAuthTokens>(
          "auth/login/",
          values
        );

        Cookies.set(ACCESS_TOKEN, data.access_token);
        Cookies.set(AUTH_REFRESH_TOKEN, data.refresh_token);

        set({ isLoading: false });

        onSuccess();
      } catch (response) {
        const errorText = response || "An error occurred";
        set({ isLoading: false });
        // alert(errorText);
      }
    },
    register: (values: RegisterParams, onSuccess: () => void) => {
      set({ isLoading: true });
      setTimeout(() => {
        set({ isLoading: false });
        onSuccess();
      }, 1000);
    },
    logout: () => {
      // Здесь можно добавить логику очистки состояния, например сброс токена
      console.log("User logged out");
    },
  }))
);

export default useAuthStore;
