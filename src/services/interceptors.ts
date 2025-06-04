import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

import { ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from "../constants/cookiesKeys";
import { UNAUTHORIZED_STATUS_CODE_401 } from "../constants/httpStatuses";

export const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const tokenPayloadStr = token.split(".")[1];
    const tokenPayload = JSON.parse(atob(tokenPayloadStr));
    const currentTime = Math.floor(new Date().getTime() / 1000);
    return currentTime > tokenPayload.exp;
  } catch (error) {
    console.error("Ошибка разбора токена:", error);
    return true;
  }
};

export const addAccessToken = (config: InternalAxiosRequestConfig) => {
  const access = Cookies.get(ACCESS_TOKEN);
  const refresh = Cookies.get(AUTH_REFRESH_TOKEN);

  const isRefreshTokenExpired = refresh ? isTokenExpired(refresh) : true;

  if (access && !isRefreshTokenExpired) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
};

let accessTokenPromise: Promise<string | null> | undefined;

export const updateAccessToken = async (error: AxiosError) => {
  if (
    error.response?.status !== UNAUTHORIZED_STATUS_CODE_401 ||
    !error.config
  ) {
    return Promise.reject(error);
  }

  if (!accessTokenPromise) {
    accessTokenPromise = fetchAccessToken().then((token) => {
      accessTokenPromise = undefined;
      return token;
    });
  }

  const token = await accessTokenPromise;
  if (!token) return Promise.reject(error);

  Cookies.set(ACCESS_TOKEN, token);

  const config = addAccessToken(error.config);
  return axios(config);
};

const fetchAccessToken = async () => {
  const refresh = Cookies.get(AUTH_REFRESH_TOKEN);
  const isRefreshTokenExpired = refresh ? isTokenExpired(refresh) : true;

  if (!refresh || isRefreshTokenExpired) {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(AUTH_REFRESH_TOKEN);
    return null;
  }

  try {
    const { data } = await axios.post<{ access: string }>(
      "http://127.0.0.1:8000/api/refresh/",
      { refresh },
      { baseURL: "http://127.0.0.1:8000/api/" }
    );
    return data.access;
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(AUTH_REFRESH_TOKEN);
    return null;
  }
};
