import { FC, useEffect } from "react";
import Cookies from "js-cookie";
import { PATHNAMES } from "../constants/routes";
import { LoginPage } from "../pages/Login";
import { AUTH_REFRESH_TOKEN } from "../constants/cookiesKeys";
import { isTokenExpired } from "../services/interceptors";
import { useLocation, useRoutes } from "react-router-dom";
import MainPage from "../pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useAuthStore from "../store/auth-store";

const ROUTES = [
  {
    element: <LoginPage />,
    path: PATHNAMES.LOGIN,
  },
  {
    element: <MainPage />,
    path: PATHNAMES.HOME,
  },
];

const AppRoutes: FC = () => {
  const refreshToken = Cookies.get(AUTH_REFRESH_TOKEN);
  const skip = !refreshToken || isTokenExpired(refreshToken);

  const location = useLocation();
  const authPage = [PATHNAMES.LOGIN];
  const hideHeaderFooter = authPage.includes(location.pathname);

  const getUser = useAuthStore((state) => state.getUser);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {useRoutes(ROUTES)}
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default AppRoutes;
