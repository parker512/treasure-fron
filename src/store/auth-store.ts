import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { instance } from "../services/api-client";
import { ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from "../constants/cookiesKeys";
import Cookies from "js-cookie";
import { isTokenExpired } from "../services/interceptors";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface IAuthTokens {
  access: string;
  refresh: string;
}

interface IAuthStore {
  isLoading: boolean;
  isAuthorized: boolean;
  user: any;

  login: (values: LoginParams, onSuccess: () => void) => void;
  logout: () => void;
  register: (values: RegisterParams, onSuccess: () => void) => void;
  getUser: () => void;
  updateUser: (values: any, onSuccess: () => void) => void;
}

const useAuthStore = create(
  devtools<IAuthStore>((set) => ({
    isLoading: false,
    isAuthorized: false,
    user: {
      id: 0,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      google_id: undefined,
      role: undefined,
      purchase_limit: 0,
      created_at: "",
      updated_at: "",
      avatar: undefined,
      logo: undefined,
    },

    login: async (values: LoginParams, onSuccess: () => void) => {
      set({ isLoading: true });

      try {
        const { data } = await instance.post<IAuthTokens>(
          "auth/login/",
          values
        );

        Cookies.set(ACCESS_TOKEN, data.access); // Исправлено: access вместо access_token
        Cookies.set(AUTH_REFRESH_TOKEN, data.refresh); // Исправлено: refresh вместо refresh_token

        set({ isLoading: false, isAuthorized: true }); // Устанавливаем авторизацию

        onSuccess();
      } catch (error) {
        console.error("Ошибка входа:", error);
        set({ isLoading: false });
        // Здесь можно добавить обработку ошибки, например, показать сообщение пользователю
      }
    },
    register: async (values: RegisterParams, onSuccess: () => void) => {
      set({ isLoading: true });
      try {
        const { data } = await instance.post("auth/register/", values);

        setTimeout(() => {
          set({ isLoading: false });
          onSuccess();
        }, 1000);
      } catch (err) {}
    },
    logout: () => {
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(AUTH_REFRESH_TOKEN);

      set({
        isAuthorized: false,
        user: {
          id: 0,
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          google_id: undefined,
          role: undefined,
          purchase_limit: 0,
          created_at: "",
          updated_at: "",
          avatar: undefined,
          logo: undefined,
        },
      });
    },
    getUser: async () => {
      set({ isLoading: true });
      try {
        const access = Cookies.get(ACCESS_TOKEN);
        const refresh = Cookies.get(AUTH_REFRESH_TOKEN);

        if (!access || !refresh) {
          set({ isAuthorized: false, isLoading: false });
          return;
        }

        const { data } = await instance.get<any>("/auth/profile/");

        set({
          user: data,
          isAuthorized: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Ошибка получения пользователя:", error);
        set({ isAuthorized: false, isLoading: false });
      }
    },

    updateUser: async (updatedFields: any, onSuccess?: () => void) => {
      set({ isLoading: true });

      try {
        const { data } = await instance.patch("/auth/profile/", updatedFields);

        set({
          user: data,
          isLoading: false,
        });

        onSuccess?.();
      } catch (error) {
        console.error("Ошибка обновления профиля:", error);
        set({ isLoading: false });
      }
    },
  }))
);

export default useAuthStore;
