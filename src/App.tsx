import "./App.css";

import CustomHistoryRouter from "./routes/CustomHistoryRoutes";
import AppRoutes from "./routes/Router";
import { history } from "./services/history";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CustomHistoryRouter history={history}>
      <Layout />
    </CustomHistoryRouter>
  );
}

function Layout() {
  return (
    <>
      <div className="flex flex-col">
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default App;
