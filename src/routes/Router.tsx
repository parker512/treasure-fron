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
import { ProfilePage } from "../pages/Profile";
import { CreateBookPage } from "../pages/CreateBook";
import BookDetail from "../pages/BookDetail";
import UserListings from "../pages/AllUserListing";
import { BrowseBooks } from "../pages/AllBooks";
import { ChatRoom } from "../pages/Chat";
import SellerOrders from "../pages/SellerOrders";
import { FavoritesPage } from "../pages/Favorites";

const ROUTES = [
  {
    element: <LoginPage />,
    path: PATHNAMES.LOGIN,
  },
  {
    element: <MainPage />,
    path: PATHNAMES.HOME,
  },
  {
    element: <ProfilePage />,
    path: PATHNAMES.PROFILE,
  },
  {
    element: <CreateBookPage />,
    path: PATHNAMES.LISTING_CREATE,
  },
  {
    element: <BookDetail />,
    path: PATHNAMES.BOOK_DETAIL,
  },
  {
    element: <UserListings />,
    path: PATHNAMES.USER_ALL_LISTING,
  },
  {
    element: <BrowseBooks />,
    path: PATHNAMES.BROWSE_BOOKS,
  },
  {
    element: <ChatRoom />,
    path: PATHNAMES.CHAT_ROOM,
  },
  {
    element: <SellerOrders />,
    path: PATHNAMES.SELLER,
  },
  {
    element: <FavoritesPage />,
    path: PATHNAMES.FAVORITES,
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
