import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

import { ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from "../constants/cookiesKeys";
import { UNAUTHORIZED_STATUS_CODE_401 } from "../constants/httpStatuses";

//  not secure, client-side use only
export const isTokenExpired = (token: string) => {
  // if (!token) return true;

  // try {
  //   const tokenPayloadStr = token.split(".")[1];
  //   const tokenPayload = JSON.parse(atob(tokenPayloadStr));
  //   return Math.floor(new Date().getTime() / 1000) > tokenPayload?.exp;
  // } catch (error) {
  //   return true;
  // }

  //temp
  return false;
};

export const addAccessToken = (config: InternalAxiosRequestConfig) => {
  const access = Cookies.get(ACCESS_TOKEN);
  const refresh = Cookies.get(AUTH_REFRESH_TOKEN);

  const isRefreshTokenExpired = isTokenExpired(refresh);

  if (access && !isRefreshTokenExpired) {
    config.headers.Authorization = access;
  }

  return config;
};

let accessTokenPromise: Promise<string>;

export const updateAccessToken = async (error: AxiosError) => {
  if (error.response?.status !== UNAUTHORIZED_STATUS_CODE_401) {
    return Promise.reject(error);
  }

  if (!accessTokenPromise) {
    accessTokenPromise = fetchAccessToken().then((token) => {
      accessTokenPromise = null;
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
  const isRefreshTokenExpired = isTokenExpired(refresh);

  if (!refresh || isRefreshTokenExpired) return null;

  try {
    const { data } = await axios.post<{ access: string }>(
      "/token/refresh/",
      { refresh },
      { baseURL: "https://app-api.205medical.com/" } //https://app-api.205medical.com/
    );
    return data.access;
  } catch (error) {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(AUTH_REFRESH_TOKEN);
    return null;
  }
};
